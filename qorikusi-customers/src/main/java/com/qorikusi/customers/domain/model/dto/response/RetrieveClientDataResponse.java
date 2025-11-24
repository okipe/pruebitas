package com.qorikusi.customers.domain.model.dto.response;

import lombok.Data;

@Data
public class RetrieveClientDataResponse {
    private String nombres;
    private String apellidos;
    private String telefono;
    private Integer puntos;
    private String signoZodiacal;
    private String faseLunarPreferida;
}