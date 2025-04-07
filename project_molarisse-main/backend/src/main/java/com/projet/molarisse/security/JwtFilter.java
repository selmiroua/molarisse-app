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
        logger.info("Processing request: {} {}", request.getMethod(), request.getRequestURI());
        
        if(request.getServletPath().contains("/auth")) {
            logger.info("Skipping authentication for /auth endpoint");
            filterChain.doFilter(request, response);
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
}
