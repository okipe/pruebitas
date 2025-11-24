package com.qorikusi.customers.domain.model.dto.request;

import com.qorikusi.customers.util.Constants;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateClientDataRequest {

    @Pattern(regexp = Constants.LETTER_REGEX)
    @Size(max = 100, message = Constants.ONE_HUNDRED_INVALID_MAX_SIZE_MESSAGE_ERROR)
    private String nombres;

    @Pattern(regexp = Constants.LETTER_REGEX)
    @Size(max = 100, message = Constants.ONE_HUNDRED_INVALID_MAX_SIZE_MESSAGE_ERROR)
    private String apellidos;

    @Pattern(regexp = Constants.NUMBER_REGEX)
    @Size(max = 20, message =  Constants.TWENTY_INVALID_MAX_SIZE_MESSAGE_ERROR)
    private String telefono;

    private Integer puntos;

    @Pattern(regexp = Constants.LETTER_REGEX)
    @Size(max = 20, message =  Constants.TWENTY_INVALID_MAX_SIZE_MESSAGE_ERROR)
    private String signoZodiacal;

    @Pattern(regexp = Constants.LETTER_REGEX)
    @Size(max = 30, message =   Constants.THIRTY_INVALID_MAX_SIZE_MESSAGE_ERROR)
    private String faseLunarPreferida;
}