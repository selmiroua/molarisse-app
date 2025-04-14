package com.projet.molarisse.security;

import com.projet.molarisse.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtAuthFilter;
    private final UserRepository userRepository;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers(
                                        "/api/v1/v2/api-docs",
                                        "/api/v1/v3/api-docs",
                                        "/api/v1/swagger-resources/**",
                                        "/api/v1/configuration/ui",
                                        "/api/v1/configuration/security",
                                        "/api/v1/swagger-ui/**",
                                        "/api/v1/webjars/**",
                                        "/api/v1/swagger-ui.html"
                                ).permitAll()
                                .requestMatchers(HttpMethod.POST, "/appointments/book").authenticated() // Allow patients to book appointments
                                .requestMatchers(HttpMethod.GET, "/appointments/patient/**").hasAuthority("ROLE_PATIENT") // Allow patients to view their appointments
                                .requestMatchers(HttpMethod.GET, "/appointments/my-doctor-appointments").hasAuthority("ROLE_doctor") // Allow doctors to view their appointments
                                .requestMatchers(HttpMethod.GET, "/appointments/secretary/**").hasAuthority("ROLE_SECRETAIRE") // Allow secretaries to view appointments
                                .requestMatchers(HttpMethod.PUT, "/appointments/status/{appointmentId}").hasAuthority("ROLE_SECRETAIRE") // Allow secretaries to update appointment status
                                .requestMatchers(HttpMethod.PUT, "/appointments/update-status").hasAuthority("ROLE_SECRETAIRE") // Allow new simple endpoint
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                // Allow auth endpoints
                                .requestMatchers("/auth/**").permitAll()
                                .requestMatchers("/api/v1/auth/**").permitAll()
                                // Allow test endpoint
                                .requestMatchers(HttpMethod.GET, "/api/users/test").permitAll()
                                // Allow profile picture viewing
                                .requestMatchers(HttpMethod.GET, "/api/users/profile/picture/**").permitAll()
                                // Allow demande pictures viewing
                                .requestMatchers(HttpMethod.GET, "/api/v1/demandes/pictures/**").permitAll()
                                // Allow doctors endpoints
                                .requestMatchers(HttpMethod.GET, "/api/users/doctors/accepted").permitAll()
                                // Demande endpoints (authenticated but no specific role required)
                                .requestMatchers(HttpMethod.POST, "/api/v1/demandes").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/v1/demandes/secretary").permitAll() // Allow secretary requests
                                .requestMatchers(HttpMethod.GET, "/api/v1/demandes/check").authenticated()
                                // Demande management endpoints (admin only)
                                .requestMatchers(HttpMethod.GET, "/api/v1/demandes/all").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/v1/demandes/{id}/status").hasRole("ADMIN")
                                // Profile management endpoints
                                .requestMatchers(HttpMethod.GET, "/api/users/profile").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/users/profile/picture").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/api/users/password").authenticated()
                                // Notification endpoints
                                .requestMatchers("/api/v1/notifications/**").authenticated()
                                // All other requests require authentication
                                .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}