package com.qorikusi.customers.domain.model.dto.request;

import com.qorikusi.customers.util.Constants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank(message = Constants.PASSWORD_NOT_BLANK_MESSAGE_ERROR)
    @Size(min = 8, message = Constants.PASSWORD_MIN_SIZE_MESSAGE_ERROR)
    @Pattern(regexp = Constants.PASSWORD_REGEX,
            message = Constants.PASSWORD_PATTERN_MESSAGE_ERROR)
    private String actualContrasenia;

    @NotBlank(message = Constants.PASSWORD_NOT_BLANK_MESSAGE_ERROR)
    @Size(min = 8, message = Constants.PASSWORD_MIN_SIZE_MESSAGE_ERROR)
    @Pattern(regexp = Constants.PASSWORD_REGEX,
            message = Constants.PASSWORD_PATTERN_MESSAGE_ERROR)
    private String nuevaContrasenia;
}