package com.qorikusi.authidentity.domain.model.dto.request;

import com.qorikusi.authidentity.util.Constants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @NotBlank(message = Constants.EMAIL_NOT_BLANK_MESSAGE_ERROR)
    @Email(regexp = Constants.EMAIL_REGEX, message = Constants.EMAIL_PATTERN_MESSAGE_ERROR)
    private String correo;
}