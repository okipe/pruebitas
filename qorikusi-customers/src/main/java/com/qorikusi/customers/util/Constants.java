package com.qorikusi.customers.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class Constants {
    public final String BEARER = "Bearer";
    public final String CLIENT_NOT_FOUND_ERROR_DESCRIPTION = "El cliente no fue encontrado.";
    public final String DIRECTION_NOT_FOUND_ERROR_DESCRIPTION = "La dirección no fue encontrada";
    public final String UBIGEO_NOT_FOUND_ERROR_DESCRIPTION = "El Ubigeo no fue encontrado";
    public final String INVALID_CREDENTIALS_ERROR_DESCRIPTION = "Credenciales inválidas";
    public final String EMAIL_REGEX = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";
    public final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).*$";
    public final String LETTER_REGEX = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$";
    public final String NUMBER_REGEX = "^[0-9]+$";
    public final String EMAIL_NOT_BLANK_MESSAGE_ERROR = "El correo es obligatorio";
    public final String EMAIL_PATTERN_MESSAGE_ERROR = "Formato de correo inválido";
    public final String PASSWORD_NOT_BLANK_MESSAGE_ERROR = "La contraseña es obligatoria";
    public final String PASSWORD_MIN_SIZE_MESSAGE_ERROR = "La contraseña debe tener al menos 8 caracteres";
    public final String PASSWORD_PATTERN_MESSAGE_ERROR = "La contraseña debe tener contener mayúsculas, minúsculas, números y caracteres especiales";
    public final String STREET_NOT_BLANK_MESSAGE_ERROR = "La calle es obligatoria";
    public final String UBIGEO_NOT_BLANK_MESSAGE_ERROR = "El código de ubigeo es obligatorio.";
    public final String UBIGEO_INVALID_SIZE_MESSAGE_ERROR = "El tamaño del código de ubigeo es inválido";
    public final String STREET_INVALID_SIZE_MESSAGE_ERROR = "El tamaño del nombre de la calle es inválido";
    public final String ONE_HUNDRED_INVALID_MAX_SIZE_MESSAGE_ERROR = "Texto mayor a 100 caracteres";
    public final String TWENTY_INVALID_MAX_SIZE_MESSAGE_ERROR = "Texto mayor a 20 caracteres";
    public final String THIRTY_INVALID_MAX_SIZE_MESSAGE_ERROR = "Texto mayor a 30 caracteres";
}