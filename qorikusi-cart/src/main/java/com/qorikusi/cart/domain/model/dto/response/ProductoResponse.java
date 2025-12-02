package com.qorikusi.cart.domain.model.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductoResponse {
    private UUID uuidProducto;
    private String categoria;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private String energiaLunar;
}