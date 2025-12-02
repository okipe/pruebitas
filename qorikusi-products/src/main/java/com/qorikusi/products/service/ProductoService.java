package com.qorikusi.products.service;

import com.qorikusi.products.domain.model.dto.request.ProductoRequest;
import com.qorikusi.products.domain.model.dto.response.CatalogoResponse;
import com.qorikusi.products.domain.model.dto.response.ProductoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ProductoService {

    ProductoResponse crearProducto(ProductoRequest request);

    Page<ProductoResponse> listarProductos(Boolean estado, Pageable pageable);

    Page<CatalogoResponse> listarCatalogo(String category, Pageable pageable);

    CatalogoResponse obtenerProductoDelCatalogo(UUID uuid);

    ProductoResponse obtenerProductoPorUuid(UUID uuid);

    ProductoResponse actualizarProducto(UUID uuid, ProductoRequest request);

    void eliminarProducto(UUID uuid);

    /**
     * NUEVO: Activar un producto (cambiar estado a true)
     */
    ProductoResponse activarProducto(UUID uuid);
}