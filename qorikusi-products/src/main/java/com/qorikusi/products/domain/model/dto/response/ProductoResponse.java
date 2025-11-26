package com.qorikusi.products.domain.model.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoResponse {
    private String uuidProducto;
    private String categoria;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private String energiaLunar;
    private String imagen;
    private String estado;
}