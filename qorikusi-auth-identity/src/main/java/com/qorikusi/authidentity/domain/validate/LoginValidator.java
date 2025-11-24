package com.qorikusi.authidentity.domain.validate;

import com.qorikusi.authidentity.util.Constants;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class LoginValidator implements ConstraintValidator<ValidLogin, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        boolean valid;
        if (value.contains("@")) {
            valid = value.matches(Constants.EMAIL_REGEX);
            if (!valid) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(Constants.EMAIL_PATTERN_MESSAGE_ERROR)
                        .addConstraintViolation();
            }
        } else {
            valid = value.matches(Constants.USERNAME_REGEX);
            if (!valid) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(Constants.USER_PATTER_MESSAGE_ERROR)
                        .addConstraintViolation();
            }
        }
        return valid;
    }
}