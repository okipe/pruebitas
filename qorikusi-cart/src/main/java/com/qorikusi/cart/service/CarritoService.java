package com.qorikusi.cart.service;

import com.qorikusi.cart.domain.model.dto.request.AgregarProductoRequest;
import com.qorikusi.cart.domain.model.dto.response.CarritoResponse;

import java.util.UUID;

public interface CarritoService {

    void agregarProductoAlCarrito(String token, UUID uuidCart, AgregarProductoRequest request);

    CarritoResponse buscarOCrearCarrito(String token);

    void fusionarCarrito(String token, UUID uuidCart);

    CarritoResponse obtenerCarrito(String token, UUID uuidCart);

    void actualizarCantidadProducto(String token, UUID uuidCart, UUID uuidProducto, Integer cantidad);

    void eliminarProductoDelCarrito(String token, UUID uuidCart, UUID uuidProducto);

    void vaciarCarrito(String token, UUID uuidCart);
}