package com.qorikusi.payments.exception;

import com.qorikusi.payments.domain.model.dto.response.ErrorResponse;
import com.qorikusi.payments.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidToken() {
        return buildResponse("INVALID_TOKEN", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleMessageNotReadable() {
        return buildResponse(Constants.INVALID_REQUEST_CODE, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument() {
        return buildResponse(Constants.INVALID_REQUEST_CODE, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid() {
        return buildResponse(Constants.INVALID_REQUEST_CODE, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleOrderNotFound() {
        return buildResponse("ORDER_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePaymentNotFound() {
        return buildResponse("ORDER_NOT_FOUND", HttpStatus.NOT_FOUND);
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