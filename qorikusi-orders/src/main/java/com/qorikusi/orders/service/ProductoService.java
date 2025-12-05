package com.qorikusi.orders.service;

import com.qorikusi.orders.domain.model.dto.response.CarritoResponse;
import com.qorikusi.orders.domain.model.dto.response.ProductoResponse;
import com.qorikusi.orders.domain.model.entity.Producto;
import com.qorikusi.orders.exception.InsufficientStockException;
import com.qorikusi.orders.exception.ProductNotFoundException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ProductoService {
    /**
     * Finds and validates products based on the items in a cart.
     * Checks for existence, active state, and sufficient stock.
     *
     * @param cartDetails The list of items from the cart.
     * @return A map of Product UUID to Product entity for valid products.
     * @throws ProductNotFoundException if a product is not found or is inactive.
     * @throws InsufficientStockException if stock is not sufficient for any product.
     */
    Map<UUID, Producto> buscarYValidarProductos(List<CarritoResponse.DetalleCarritoResponse> cartDetails);

    ProductoResponse obtenerProductoResponsePorUuid (UUID uuidProducto);
}