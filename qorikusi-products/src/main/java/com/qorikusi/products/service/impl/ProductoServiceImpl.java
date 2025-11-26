package com.qorikusi.products.service.impl;

import com.qorikusi.products.domain.mapper.ProductoMapper;
import com.qorikusi.products.domain.model.dto.request.ProductoRequest;
import com.qorikusi.products.domain.model.dto.response.CatalogoResponse;
import com.qorikusi.products.domain.model.dto.response.ProductoResponse;
import com.qorikusi.products.domain.model.entity.Producto;
import com.qorikusi.products.domain.repository.CategoriaRepository;
import com.qorikusi.products.domain.repository.ProductoRepository;
import com.qorikusi.products.exception.ProductNotFoundException;
import com.qorikusi.products.service.ProductoService;
import com.qorikusi.products.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoMapper productoMapper;

    private static ProductNotFoundException productNotFoundException() {
        log.error(Constants.PRODUCT_NOT_FOUND_ERROR_DESCRIPTION);
        throw new ProductNotFoundException();
    }

    @Override
    public ProductoResponse crearProducto(ProductoRequest request) {
        Producto productoSave = productoMapper.createProductoFromRequest(request, categoriaRepository);
        return productoMapper.toProductoResponse(productoRepository.save(productoSave));
    }

    @Override
    public Page<ProductoResponse> listarProductos(Boolean estado, Pageable pageable) {
        return Optional.ofNullable(estado)
                .map(s -> productoRepository.findByEstado(s, pageable))
                .orElseGet(() -> productoRepository.findAll(pageable))
                .map(productoMapper::toProductoResponse);
    }

    @Override
    public Page<CatalogoResponse> listarCatalogo(String category, Pageable pageable) {
        return Optional.ofNullable(category)
                .map(c -> productoRepository.findByEstadoAndCategoria_Nombre(true, c, pageable))
                .orElseGet(() -> productoRepository.findByEstado(true, pageable))
                .map(productoMapper::toCatalogoResponse);
    }

    @Override
    public CatalogoResponse obtenerProductoDelCatalogo(UUID uuid) {
        return productoMapper.toCatalogoResponse(productoRepository.findByUuidProductoAndEstado(uuid, true)
                .orElseThrow(ProductoServiceImpl::productNotFoundException));
    }

    @Override
    public ProductoResponse obtenerProductoPorUuid(UUID uuidProducto) {
        return productoMapper.toProductoResponse(productoRepository.findByUuidProducto(uuidProducto)
                .orElseThrow(ProductoServiceImpl::productNotFoundException));
    }

    @Override
    public ProductoResponse actualizarProducto(UUID uuidProducto, ProductoRequest request) {
        Producto producto = productoRepository.findByUuidProducto(uuidProducto)
                .orElseThrow(ProductoServiceImpl::productNotFoundException);
        productoMapper.updateProductoFromRequest(request, producto, categoriaRepository);
        return productoMapper.toProductoResponse(productoRepository.save(producto));
    }

    @Override
    public void eliminarProducto(UUID uuidProducto) {
        Producto producto = productoRepository.findByUuidProducto(uuidProducto)
                .orElseThrow(ProductoServiceImpl::productNotFoundException);
        producto.setEstado(false);
        productoRepository.save(producto);
    }
}