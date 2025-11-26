package com.qorikusi.products.domain.model.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoRequest {
    private Integer categoria;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private String energiaLunar;
    private String imagen;
}