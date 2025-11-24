package com.qorikusi.customers.security.service.impl;

import com.qorikusi.customers.security.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.security.WeakKeyException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@Slf4j
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
    public boolean validateToken(String token) {
        try {
            if (token == null || token.isBlank()) return false;
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            log.warn("Token inválido: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    @Override
    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role").toString();
    }

    @Override
    public UUID getUuidFromToken(String token) {
        String uuidStr = getClaimsFromToken(token).get("uuid", String.class);
        return UUID.fromString(uuidStr);
    }

    private Claims getClaimsFromToken(String authorizationHeader) {
        try {
            String token = authorizationHeader.substring(7).trim();
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (DecodingException | SignatureException e) {
            log.error(e.getMessage());
            throw new IllegalArgumentException("Token JWT inválido o malformado", e);
        }
    }
}