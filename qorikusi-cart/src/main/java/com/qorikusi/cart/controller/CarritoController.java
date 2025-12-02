package com.qorikusi.cart.controller;

import com.qorikusi.cart.domain.model.dto.request.AgregarProductoRequest;
import com.qorikusi.cart.domain.model.dto.request.ActualizarProductoRequest;
import com.qorikusi.cart.domain.model.dto.response.CarritoResponse;
import com.qorikusi.cart.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;

    @PostMapping
    public ResponseEntity<CarritoResponse> buscarOCrearCarrito(
            @RequestHeader(value = "Authorization", required = false) String token) {
        CarritoResponse carrito = carritoService.buscarOCrearCarrito(token);
        return ResponseEntity.ok(carrito);
    }

    @PostMapping("/{uuidCart}/items")
    public ResponseEntity<Void> agregarProducto(@RequestHeader(value = "Authorization", required = false) String token,
                                                @PathVariable UUID uuidCart,
                                                @RequestBody AgregarProductoRequest request) {
        carritoService.agregarProductoAlCarrito(token, uuidCart, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{uuidCart}/merge")
    public ResponseEntity<Void> fusionarCarrito(@RequestHeader("Authorization") String token,
                                                @PathVariable UUID uuidCart) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        carritoService.fusionarCarrito(token, uuidCart);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{uuidCart}")
    public ResponseEntity<CarritoResponse> obtenerCarrito(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable UUID uuidCart) {
        CarritoResponse carrito = carritoService.obtenerCarrito(token, uuidCart);
        return ResponseEntity.ok(carrito);
    }

    @PutMapping("/{uuidCart}/items/{uuidProducto}")
    public ResponseEntity<Void> actualizarCantidadProducto(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable UUID uuidCart,
            @PathVariable UUID uuidProducto,
            @RequestBody ActualizarProductoRequest request) {
        carritoService.actualizarCantidadProducto(token, uuidCart, uuidProducto, request.getCantidad());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{uuidCart}/items/{uuidProducto}")
    public ResponseEntity<Void> eliminarProductoDelCarrito(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable UUID uuidCart,
            @PathVariable UUID uuidProducto) {
        carritoService.eliminarProductoDelCarrito(token, uuidCart, uuidProducto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{uuidCart}")
    public ResponseEntity<Void> vaciarCarrito(@RequestHeader(value = "Authorization", required = false) String token,
                                              @PathVariable UUID uuidCart) {
        carritoService.vaciarCarrito(token, uuidCart);
        return ResponseEntity.noContent().build();
    }
}