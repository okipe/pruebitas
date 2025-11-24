package com.qorikusi.customers.domain.model.dto.request;

import com.qorikusi.customers.util.Constants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DireccionRequest {

    @NotBlank(message = Constants.STREET_NOT_BLANK_MESSAGE_ERROR)
    @Size(max = 250, message = Constants.STREET_INVALID_SIZE_MESSAGE_ERROR)
    private String calle;

    @NotBlank(message = Constants.UBIGEO_NOT_BLANK_MESSAGE_ERROR)
    @Size(min = 6, max = 6, message = Constants.UBIGEO_INVALID_SIZE_MESSAGE_ERROR)
    private String codigoUbigeo;
}