package com.qorikusi.authidentity.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class Constants {
    public final String BEARER = "Bearer ";
    public final long ACCESS_TOKEN_EXP_SECONDS = 3600;
    public final long RESET_TOKEN_EXP_SECONDS = 900;
    public final String EMAIL_REGEX = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";
    public final String USERNAME_REGEX = "^[a-zA-Z0-9._-]{7,50}$";
    public final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).*$";
    public final String LOGIN_NOT_BLANK_MESSAGE_ERROR = "El usuario o correo es obligatorio";
    public final String USER_NOT_BLANK_MESSAGE_ERROR = "El usuario es obligatorio";
    public final String USER_PATTER_MESSAGE_ERROR = "Formato de usuario inválido";
    public final String EMAIL_NOT_BLANK_MESSAGE_ERROR = "El correo es obligatorio";
    public final String EMAIL_PATTERN_MESSAGE_ERROR = "Formato de correo inválido";
    public final String PASSWORD_NOT_BLANK_MESSAGE_ERROR = "La contraseña es obligatoria";
    public final String PASSWORD_MIN_SIZE_MESSAGE_ERROR = "La contraseña debe tener al menos 8 caracteres";
    public final String PASSWORD_PATTERN_MESSAGE_ERROR = "La contraseña debe tener contener mayúsculas, minúsculas, números y caracteres especiales";
}