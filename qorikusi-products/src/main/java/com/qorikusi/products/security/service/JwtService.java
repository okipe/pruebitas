package com.qorikusi.products.security.service;

public interface JwtService {
    boolean validateToken(String token);

    String getUsernameFromToken(String token);

    String getRoleFromToken(String token);
}