package com.qorikusi.customers.security.filter;

import com.qorikusi.customers.exception.InvalidTokenException;
import com.qorikusi.customers.security.service.impl.JwtServiceImpl;
import com.qorikusi.customers.util.Constants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtServiceImpl jwtServiceImpl;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith(Constants.BEARER)) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authorizationHeader.substring(7).trim();
            if (!jwtServiceImpl.validateToken(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            String username = jwtServiceImpl.getUsernameFromToken(authorizationHeader);
            String role = jwtServiceImpl.getRoleFromToken(authorizationHeader);

            var authentication = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    List.of(new SimpleGrantedAuthority(role))
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            log.error("Error procesando JWT: {}", e.getMessage());
            throw new InvalidTokenException();
        }

        filterChain.doFilter(request, response);
    }
}