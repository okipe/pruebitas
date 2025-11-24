package com.qorikusi.customers.domain.model.dto.request;

import com.qorikusi.customers.util.Constants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetEmailRequest {

    @NotBlank(message = Constants.EMAIL_NOT_BLANK_MESSAGE_ERROR)
    @Email(regexp = Constants.EMAIL_REGEX, message = Constants.EMAIL_PATTERN_MESSAGE_ERROR)
    private String actualCorreo;

    @NotBlank(message = Constants.EMAIL_NOT_BLANK_MESSAGE_ERROR)
    @Email(regexp = Constants.EMAIL_REGEX, message = Constants.EMAIL_PATTERN_MESSAGE_ERROR)
    private String nuevoCorreo;
}