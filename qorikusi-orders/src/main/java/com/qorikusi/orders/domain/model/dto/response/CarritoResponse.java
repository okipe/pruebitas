package com.qorikusi.orders.domain.model.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CarritoResponse(
    UUID uuidCarrito,
    List<DetalleCarritoResponse> detalles,
    BigDecimal total
) {
    public record DetalleCarritoResponse(
        UUID uuidProducto,
        String categoria,
        String nombre,
        BigDecimal precio,
        int cantidad,
        BigDecimal subtotal
    ) {}
}