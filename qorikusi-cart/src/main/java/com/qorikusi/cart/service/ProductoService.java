package com.qorikusi.cart.service;

import com.qorikusi.cart.domain.model.dto.response.ProductoResponse;
import com.qorikusi.cart.domain.model.entity.Producto;

import java.util.UUID;

public interface ProductoService {
    Producto obtenerProductoPorUuid(UUID uuidProducto);
    ProductoResponse obtenerProductoResponsePorUuid (UUID uuidProducto);
}