package com.qorikusi.authidentity.service.impl;

import com.qorikusi.authidentity.service.JwtService;
import com.qorikusi.authidentity.util.Constants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${security.jwt.secret:}")
    private String secret;
    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        if (!StringUtils.hasText(secret)) {
            throw new IllegalStateException("JWT_SECRET no definido");
        }

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        try {
            secretKey = Keys.hmacShaKeyFor(keyBytes);
        } catch (WeakKeyException ex) {
            throw new IllegalStateException("JWT_SECRET insuficiente o inseguro", ex);
        }
    }

    @Override
    public String generateAccessToken(String subject, UUID uuid, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(Constants.ACCESS_TOKEN_EXP_SECONDS)))
                .claim("role", role)
                .claim("uuid", uuid.toString())
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public String generatePasswordResetToken(String correo, UUID uuid) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(correo)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(Constants.RESET_TOKEN_EXP_SECONDS)))
                .claim("typ", "pwd-reset")
                .claim("uuid", uuid.toString())
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public Claims parsePasswordResetToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}