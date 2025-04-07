package com.projet.molarisse.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

//this jwtService is the service that will do evreything related to our jwttoken
@Service

public class JwtService {
    @Value("${application.security.jwt.expiration}")
    private  long jwtExpiration;
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;


    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims ,T> claimResolver){
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);



    }

    private Claims extractAllClaims(String token) {
        Claims claims = Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
                
        System.out.println("Extracted claims from token: " + claims);
        if (claims.get("authorities") != null) {
            System.out.println("Authorities from token: " + claims.get("authorities"));
        }
        
        return claims;
    }


    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(),userDetails);

    }
    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {

        return buildToken(claims, userDetails, jwtExpiration);

    }

    private String buildToken
            (Map<String, Object> extraClaims,
             UserDetails userDetails,
             long jwtExpiration
            ) {
        var authorities = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
                
        System.out.println("Building token for user: " + userDetails.getUsername());
        System.out.println("User authorities: " + authorities);
        System.out.println("User details class: " + userDetails.getClass().getName());
        System.out.println("Raw authorities: " + userDetails.getAuthorities());

        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .claim("authorities", authorities)
                .signWith(getSignInKey())
                .compact();
    }

    //check if the token is valid or not
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        System.out.println("Validating token for user: " + username);
        System.out.println("Token authorities: " + extractAllClaims(token).get("authorities"));
        System.out.println("UserDetails authorities: " + userDetails.getAuthorities());
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
