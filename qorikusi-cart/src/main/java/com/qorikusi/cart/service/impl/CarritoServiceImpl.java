package com.qorikusi.cart.service.impl;

import com.qorikusi.cart.domain.mapper.CarritoMapper;
import com.qorikusi.cart.domain.model.dto.request.AgregarProductoRequest;
import com.qorikusi.cart.domain.model.dto.response.CarritoResponse;
import com.qorikusi.cart.domain.model.dto.response.DetalleCarritoResponse;
import com.qorikusi.cart.domain.model.dto.response.ProductoResponse;
import com.qorikusi.cart.domain.model.entity.Carrito;
import com.qorikusi.cart.domain.model.entity.Cliente;
import com.qorikusi.cart.domain.model.entity.DetalleCarrito;
import com.qorikusi.cart.domain.model.entity.Producto;
import com.qorikusi.cart.domain.repository.CarritoRepository;
import com.qorikusi.cart.domain.repository.DetalleCarritoRepository;
import com.qorikusi.cart.exception.CartNotFoundException;
import com.qorikusi.cart.exception.ProductNotFoundInCartException;
import com.qorikusi.cart.exception.UnauthorizedCartAccessException;
import com.qorikusi.cart.service.CarritoService;
import com.qorikusi.cart.service.ClienteService;
import com.qorikusi.cart.service.ProductoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class CarritoServiceImpl implements CarritoService {

    private final CarritoRepository carritoRepository;
    private final DetalleCarritoRepository detalleCarritoRepository;
    private final ClienteService clienteService;
    private final ProductoService productoService;
    private final CarritoMapper carritoMapper;

    @Override
    @Transactional
    public void agregarProductoAlCarrito(String token, UUID uuidCart, AgregarProductoRequest request) {
        Carrito carrito = validarPropietarioCarrito(token, uuidCart);

        Producto producto = productoService.obtenerProductoPorUuid(request.getUuidProducto());
        Optional<DetalleCarrito> existingItem = detalleCarritoRepository.findByCarritoAndProducto(carrito, producto);

        if (existingItem.isPresent()) {
            DetalleCarrito detalle = existingItem.get();
            detalle.setCantidad(detalle.getCantidad() + request.getCantidad());
            detalleCarritoRepository.save(detalle);
        } else {
            DetalleCarrito nuevoDetalle = new DetalleCarrito();
            nuevoDetalle.setCarrito(carrito);
            nuevoDetalle.setProducto(producto);
            nuevoDetalle.setCantidad(request.getCantidad());
            detalleCarritoRepository.save(nuevoDetalle);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CarritoResponse obtenerCarrito(String token, UUID uuidCart) {
        Carrito carrito = validarPropietarioCarrito(token, uuidCart);

        List<DetalleCarritoResponse> detalles = carrito.getDetalles().stream().map(detalle -> {
            ProductoResponse producto = productoService.obtenerProductoResponsePorUuid(detalle.getProducto()
                    .getUuidProducto());
            return DetalleCarritoResponse.builder()
                    .uuidProducto(producto.getUuidProducto())
                    .categoria(producto.getCategoria())
                    .nombre(producto.getNombre())
                    .precio(producto.getPrecio())
                    .cantidad(detalle.getCantidad())
                    .subtotal(producto.getPrecio().multiply(BigDecimal.valueOf(detalle.getCantidad())))
                    .imagen(producto.getImagen())  // Agregado para imagen de producto en el cart
                    .build();
        }).toList();

        BigDecimal total = detalles.stream().map(
                detalle -> detalle.getPrecio().multiply(BigDecimal.valueOf(detalle.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return carritoMapper.toCarritoResponse(carrito, detalles, total);
    }

    @Override
    @Transactional
    public void actualizarCantidadProducto(String token, UUID uuidCart, UUID uuidProducto, Integer cantidad) {
        Carrito carrito = validarPropietarioCarrito(token, uuidCart);
        Producto producto = productoService.obtenerProductoPorUuid(uuidProducto);

        DetalleCarrito detalle = detalleCarritoRepository.findByCarritoAndProducto(carrito, producto)
                .orElseThrow(ProductNotFoundInCartException::new);

        if (cantidad <= 0) {
            detalleCarritoRepository.delete(detalle);
        } else {
            detalle.setCantidad(cantidad);
            detalleCarritoRepository.save(detalle);
        }
    }

    @Override
    @Transactional
    public void eliminarProductoDelCarrito(String token, UUID uuidCart, UUID uuidProducto) {
        Carrito carrito = validarPropietarioCarrito(token, uuidCart);
        Producto producto = productoService.obtenerProductoPorUuid(uuidProducto);

        DetalleCarrito detalle = detalleCarritoRepository.findByCarritoAndProducto(carrito, producto)
                .orElseThrow(ProductNotFoundInCartException::new);

        detalleCarritoRepository.delete(detalle);
    }

    @Override
    @Transactional
    public void vaciarCarrito(String token, UUID uuidCart) {
        Carrito carrito = validarPropietarioCarrito(token, uuidCart);
        detalleCarritoRepository.deleteAllByCarrito(carrito);
    }

    @Override
    @Transactional
    public CarritoResponse buscarOCrearCarrito(String token) {
        Carrito carrito;
        if (token != null) {
            carrito = obtenerOCrearCarritoPorCliente(token);
        } else {
            carrito = crearNuevoCarrito(UUID.randomUUID(), null);
        }
        return CarritoResponse.builder().uuidCarrito(carrito.getUuidCarrito()).build();
    }

    @Override
    @Transactional
    public void fusionarCarrito(String token, UUID uuidCart) {
        log.info("Iniciando fusión de carrito para el cliente.");
        Carrito carritoCliente = obtenerOCrearCarritoPorCliente(token);
        Carrito carritoAnonimo = buscarCarritoPorUuid(uuidCart);

        if (carritoCliente.equals(carritoAnonimo)) {
            log.warn("Intento de fusionar un carrito consigo mismo. Abortando.");
            return;
        }

        for (DetalleCarrito detalleAnonimo : carritoAnonimo.getDetalles()) {
            Optional<DetalleCarrito> detalleClienteOpt = carritoCliente.getDetalles().stream()
                    .filter(d -> d.getProducto().equals(detalleAnonimo.getProducto())).findFirst();

            if (detalleClienteOpt.isPresent()) {
                DetalleCarrito detalleCliente = detalleClienteOpt.get();
                detalleCliente.setCantidad(detalleCliente.getCantidad() + detalleAnonimo.getCantidad());
            } else {
                detalleAnonimo.setCarrito(carritoCliente);
                carritoCliente.getDetalles().add(detalleAnonimo);
            }
        }

        carritoRepository.save(carritoCliente);
        detalleCarritoRepository.deleteAll(carritoAnonimo.getDetalles());
        carritoRepository.delete(carritoAnonimo);

        log.info("Fusión completada!");
    }

    private Carrito crearNuevoCarrito(UUID cartId, Cliente cliente) {
        Carrito nuevoCarrito = new Carrito();
        nuevoCarrito.setUuidCarrito(cartId);
        nuevoCarrito.setCliente(cliente);
        nuevoCarrito.setFechaCreacion(LocalDateTime.now());
        return carritoRepository.save(nuevoCarrito);
    }

    private Carrito obtenerOCrearCarritoPorCliente(String token) {
        Cliente cliente = clienteService.obtenerDatos(token);
        return carritoRepository.findByCliente_IdCliente(cliente.getIdCliente())
                .orElseGet(() -> crearNuevoCarrito(UUID.randomUUID(), cliente));
    }

    private Carrito buscarCarritoPorUuid(UUID uuid) {
        return carritoRepository.findByUuidCarrito(uuid).orElseThrow(CartNotFoundException::new);
    }

    private Carrito validarPropietarioCarrito(String token, UUID uuidCart) {
        Carrito carrito = buscarCarritoPorUuid(uuidCart);
        if (token != null) {
            Cliente cliente = clienteService.obtenerDatos(token);
            if (carrito.getCliente() == null || !carrito.getCliente().getIdCliente().equals(cliente.getIdCliente())) {
                log.error("El cliente no es propietario de este carrito.");
                throw new UnauthorizedCartAccessException();
            }
        } else {
            if (carrito.getCliente() != null) {
                log.error("Este carrito pertenece a un cliente registrado.");
                throw new UnauthorizedCartAccessException();
            }
        }
        return carrito;
    }
}