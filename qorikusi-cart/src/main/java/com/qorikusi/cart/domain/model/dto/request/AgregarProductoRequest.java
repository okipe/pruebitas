package com.qorikusi.cart.domain.model.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class AgregarProductoRequest {
    private UUID uuidProducto;
    private Integer cantidad;
}