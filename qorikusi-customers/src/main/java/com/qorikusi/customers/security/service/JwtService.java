package com.qorikusi.customers.security.service;

import java.util.UUID;

public interface JwtService {
    boolean validateToken(String token);

    String getUsernameFromToken(String token);

    String getRoleFromToken(String token);

    UUID getUuidFromToken(String token);
}