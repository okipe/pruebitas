package com.qorikusi.cart.service.impl;

import com.qorikusi.cart.domain.mapper.ProductoMapper;
import com.qorikusi.cart.domain.model.dto.response.ProductoResponse;
import com.qorikusi.cart.domain.model.entity.Producto;
import com.qorikusi.cart.domain.repository.ProductoRepository;
import com.qorikusi.cart.exception.ProductNotFoundException;
import com.qorikusi.cart.exception.ServiceCommunicationException;
import com.qorikusi.cart.proxy.ProductoServiceProxy;
import com.qorikusi.cart.service.ProductoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoMapper productoMapper;
    private final ProductoServiceProxy productoServiceProxy;

    @Override
    public Producto obtenerProductoPorUuid(UUID uuidProducto) {
        Producto producto;
        try {
            ProductoResponse productoResponse = productoServiceProxy.getProductByUuid(uuidProducto)
                    .orElseThrow(ProductNotFoundException::new);
            Integer idProducto = productoRepository.retrieveProductId(uuidProducto);
            producto = productoMapper.toProducto(productoResponse, idProducto);
        } catch (RuntimeException e) {
            log.error("Error de comunicación con el servicio de productos al buscar por UUID {}", uuidProducto, e);
            throw new ServiceCommunicationException();
        }
        return producto;
    }

    @Override
    public ProductoResponse obtenerProductoResponsePorUuid(UUID uuidProducto) {
        Optional<ProductoResponse> productoResponse;
        try {
            productoResponse = productoServiceProxy.getProductByUuid(uuidProducto);
        } catch (RuntimeException e) {
            log.error("Error de comunicación con el servicio de productos al buscar por UUID {}", uuidProducto, e);
            throw new ServiceCommunicationException();
        }
        return productoResponse.orElseThrow(ProductNotFoundException::new);
    }
}