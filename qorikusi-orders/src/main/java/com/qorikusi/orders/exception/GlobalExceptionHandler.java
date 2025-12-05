package com.qorikusi.orders.exception;

import com.qorikusi.orders.domain.model.dto.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidToken() {
        return buildResponse("INVALID_TOKEN", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ClientNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleClientNotFound() {
        return buildResponse("CLIENT_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CartNotFoundException.class)
    public  ResponseEntity<ErrorResponse> handleCartNotFound() {
        return buildResponse("CART_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductNotFound() {
        return buildResponse("PRODUCT_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public  ResponseEntity<ErrorResponse> handleOrderNotFound() {
        return buildResponse("ORDER_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ServiceCommunicationException.class)
    public ResponseEntity<ErrorResponse> handleServiceCommunication() {
        return buildResponse("SERVICE_COMMUNICATION_ERROR", HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientStock() {
        return buildResponse("INSUFFICIENT_STOCK", HttpStatus.CONFLICT);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleMessageNotReadable() {
        return buildResponse("INVALID_REQUEST", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument() {
        return buildResponse("INVALID_REQUEST", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied() {
        return buildResponse("ACCESS_DENIED", HttpStatus.FORBIDDEN);
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