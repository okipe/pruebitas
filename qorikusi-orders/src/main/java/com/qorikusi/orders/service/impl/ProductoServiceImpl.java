package com.qorikusi.orders.service.impl;

import com.qorikusi.orders.domain.model.dto.response.CarritoResponse;
import com.qorikusi.orders.domain.model.dto.response.ProductoResponse;
import com.qorikusi.orders.domain.model.entity.Producto;
import com.qorikusi.orders.domain.repository.ProductRepository;
import com.qorikusi.orders.exception.ProductNotFoundException;
import com.qorikusi.orders.exception.ServiceCommunicationException;
import com.qorikusi.orders.proxy.ProductoServiceProxy;
import com.qorikusi.orders.service.ProductoService;
import com.qorikusi.orders.exception.InsufficientStockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductRepository productRepository;
    private final ProductoServiceProxy productoServiceProxy;

    @Override
    public Map<UUID, Producto> buscarYValidarProductos(List<CarritoResponse.DetalleCarritoResponse> cartDetails) {
        List<UUID> productUuids = cartDetails.stream().map(CarritoResponse.DetalleCarritoResponse::uuidProducto).toList();
        
        Map<UUID, Producto> productos = productRepository.findByUuidProductoIn(productUuids).stream()
                .collect(Collectors.toMap(Producto::getUuidProducto, Function.identity()));

        for (CarritoResponse.DetalleCarritoResponse item : cartDetails) {
            Producto product = productos.get(item.uuidProducto());

            if (product == null || !product.isEstado()) {
                log.error("Producto no encontrado o inactivo: {}", item.nombre());
                throw new ProductNotFoundException();
            }

            if (product.getStock() < item.cantidad()) {
                log.error("Stock insuficiente para el producto: {}. Solicitado: {}, Disponible: {}",
                        product.getUuidProducto(), item.cantidad(), product.getStock());
                throw new InsufficientStockException();
            }
        }

        return productos;
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