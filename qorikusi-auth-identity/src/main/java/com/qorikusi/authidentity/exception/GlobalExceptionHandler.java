package com.qorikusi.authidentity.exception;

import com.qorikusi.authidentity.domain.model.dto.response.ErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Objects;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserFound() {
        return buildResponse("USER_ALREADY_EXISTS", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmailFoundException.class)
    public ResponseEntity<ErrorResponse> handleEmailFound() {
        return buildResponse("EMAIL_ALREADY_EXISTS", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ClientNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleClientNotFound() {
        return buildResponse("CLIENT_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleDisabledUser() {
        return buildResponse("CREDENTIALS_DISABLED", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication() {
        return buildResponse("INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidToken() {
        return buildResponse("INVALID_TOKEN", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ErrorResponse> handleSignatureException() {
        return buildResponse("INVALID_TOKEN_SIGNATURE", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredToken() {
        return buildResponse("TOKEN_EXPIRED", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        String error = ex.getBindingResult().getFieldErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("Solicitud inválida");
        log.warn(error);
        return buildResponse("INVALID_REQUEST", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException() {
        return buildResponse("INTERNAL_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ErrorResponse> buildResponse(String code, HttpStatus status) {
        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                code,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, status);
    }
}