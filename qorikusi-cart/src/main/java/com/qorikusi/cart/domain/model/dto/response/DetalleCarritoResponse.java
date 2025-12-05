package com.qorikusi.cart.domain.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalleCarritoResponse {
    private UUID uuidProducto;
    private String categoria;
    private String nombre;
    private BigDecimal precio;
    private Integer cantidad;
    private BigDecimal subtotal;
    private String imagen; // Agregado para imagen de producto en el cart
}