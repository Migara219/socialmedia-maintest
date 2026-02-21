package com.example.socialmedia.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access.expiration}")
    private long accessTokenExpiration; // e.g., 15 minutes

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiration; // e.g., 7 days

    // Generate token with given user name
    public String generateAccessToken(String username) {
        return generateToken(username, accessTokenExpiration);
    }

    public String generateRefreshToken(String username) {
        return generateToken(username, refreshTokenExpiration);
    }

    // Create a JWT token with specified claims and subject (user name)
    private String generateToken(String username, long expiration) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username, expiration);
    }

    private String createToken(Map<String, Object> claims, String username, long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Get the signing key for JWT token
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Extract the username from the token
    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    // Extract all claims from the token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Check if the token is expired
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    // Validate the token against user details and expiration
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Validate the token
    public boolean validateToken(String token) {
        final String username = extractUsername(token);
        return !isTokenExpired(token); // You can also add any other validation logic here if necessary
    }

    // Add this getter method
    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    // Add this getter method if needed
    public long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }
}