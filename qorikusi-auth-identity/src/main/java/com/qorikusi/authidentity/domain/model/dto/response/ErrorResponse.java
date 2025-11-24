package com.qorikusi.authidentity.domain.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String code;
    private LocalDateTime timestamp;
}