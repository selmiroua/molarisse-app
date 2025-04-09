package com.projet.molarisse.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
// bch nrj3ouha filter lezm el extends ethika
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String requestPath = request.getServletPath();
        String requestMethod = request.getMethod();
        logger.info("Processing request: {} {} {}", requestMethod, requestPath);
        
        // Skip authentication for public endpoints and OPTIONS requests
        if(requestPath.contains("/auth") || 
           requestPath.equals("/api/users/doctors") ||
           requestPath.equals("/api/users/doctors/accepted") ||
           requestPath.equals("/api/users/test") ||
           requestMethod.equals("OPTIONS")) {
            logger.info("Skipping authentication for public endpoint or OPTIONS request: {} {}", requestMethod, requestPath);
            filterChain.doFilter(request, response);
            return;
        }
        
        // Add CORS headers for preflight requests
        if (requestMethod.equals("OPTIONS")) {
            response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        try {
            final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            logger.info("Authorization Header: {}", authHeader);
            final String jwt;
            final String userEmail;
            if(authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("Authorization header is missing or invalid.");
                filterChain.doFilter(request, response);
                return;
            }
            jwt = authHeader.substring(7);
            logger.info("Extracted JWT Token: {}", jwt);
            userEmail = jwtService.extractUsername(jwt);
            logger.info("Extracted Username: {}", userEmail);
            if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                logger.info("Loaded UserDetails for {}: {}", userEmail, userDetails);
                logger.info("User authorities from UserDetails: {}", userDetails.getAuthorities());
                logger.info("User class: {}", userDetails.getClass().getName());
                
                if(jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Authentication set in SecurityContext. Token: {}, Authorities: {}", 
                        authToken,
                        authToken.getAuthorities());
                    logger.info("Security context authentication: {}", SecurityContextHolder.getContext().getAuthentication());
                } else {
                    logger.warn("Token validation failed");
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Error processing JWT token", e);
            throw e;
        }
    }

    private boolean isPublicEndpoint(String requestPath, String requestMethod) {
        // Auth endpoints
        if (requestPath.startsWith("/api/v1/auth/")) {
            return true;
        }

        // Profile picture endpoints
        if (requestPath.startsWith("/api/v1/users/profile/picture/")) {
            return true;
        }

        // Demande picture endpoints
        if (requestPath.startsWith("/api/v1/demandes/picture/")) {
            return true;
        }

        // Doctors endpoint
        if (requestPath.equals("/api/users/doctors") && requestMethod.equals("GET")) {
            return true;
        }

        return false;
    }
}
