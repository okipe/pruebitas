package com.qorikusi.authidentity.service;

import io.jsonwebtoken.Claims;

import java.util.UUID;

public interface JwtService {

    String generateAccessToken(String subject, UUID uuid, String role);

    String generatePasswordResetToken(String correo, UUID uuid);

    Claims parsePasswordResetToken(String token);
}