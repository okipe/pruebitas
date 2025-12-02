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
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public ProductoResponse crearProducto(ProductoRequest request) {
        Producto productoSave = productoMapper.createProductoFromRequest(request, categoriaRepository);
        Producto productoGuardado = productoRepository.save(productoSave);
        log.info("Producto creado con UUID: {} y estado: {}", productoGuardado.getUuidProducto(), productoGuardado.isEstado());
        return productoMapper.toProductoResponse(productoGuardado);
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
    @Transactional
    public ProductoResponse actualizarProducto(UUID uuidProducto, ProductoRequest request) {
        Producto producto = productoRepository.findByUuidProducto(uuidProducto)
                .orElseThrow(ProductoServiceImpl::productNotFoundException);

        log.info("Actualizando producto UUID: {} - Estado actual: {}", uuidProducto, producto.isEstado());

        productoMapper.updateProductoFromRequest(request, producto, categoriaRepository);
        Producto productoActualizado = productoRepository.save(producto);

        log.info("Producto actualizado UUID: {} - Nuevo estado: {}", uuidProducto, productoActualizado.isEstado());

        return productoMapper.toProductoResponse(productoActualizado);
    }

    @Override
    @Transactional
    public void eliminarProducto(UUID uuidProducto) {
        Producto producto = productoRepository.findByUuidProducto(uuidProducto)
                .orElseThrow(ProductoServiceImpl::productNotFoundException);

        log.info("Eliminando (desactivando) producto UUID: {} - Estado actual: {}", uuidProducto, producto.isEstado());

        producto.setEstado(false);
        Producto productoGuardado = productoRepository.save(producto);

        log.info("Producto desactivado UUID: {} - Nuevo estado: {}", uuidProducto, productoGuardado.isEstado());

        // Verificar que el cambio se haya guardado
        Producto productoVerificado = productoRepository.findByUuidProducto(uuidProducto)
                .orElseThrow(ProductoServiceImpl::productNotFoundException);

        log.info("Verificación post-eliminación UUID: {} - Estado en BD: {}", uuidProducto, productoVerificado.isEstado());
    }

    /**
     * NUEVO: Activar un producto (cambiar estado a true)
     */
    @Override
    @Transactional
    public ProductoResponse activarProducto(UUID uuidProducto) {
        Producto producto = productoRepository.findByUuidProducto(uuidProducto)
                .orElseThrow(ProductoServiceImpl::productNotFoundException);

        log.info("Activando producto UUID: {} - Estado actual: {}", uuidProducto, producto.isEstado());

        producto.setEstado(true);
        Producto productoGuardado = productoRepository.save(producto);

        log.info("Producto activado UUID: {} - Nuevo estado: {}", uuidProducto, productoGuardado.isEstado());

        // Verificar que el cambio se haya guardado
        Producto productoVerificado = productoRepository.findByUuidProducto(uuidProducto)
                .orElseThrow(ProductoServiceImpl::productNotFoundException);

        log.info("Verificación post-activación UUID: {} - Estado en BD: {}", uuidProducto, productoVerificado.isEstado());

        return productoMapper.toProductoResponse(productoVerificado);
    }
}