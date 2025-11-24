package com.qorikusi.customers.domain.model.dto.response;

import lombok.Data;

@Data
public class DireccionResponse {
    private String uuidDireccion;
    private String cliente;
    private String codigoUbigeo;
    private String departamento;
    private String provincia;
    private String distrito;
    private String calle;
}