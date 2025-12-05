package com.qorikusi.orders.domain.model.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductoResponse (
        UUID uuidProducto,
        String categoria,
        String nombre,
        String descripcion,
        BigDecimal precio,
        String energiaLunar
){}