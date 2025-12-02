package com.qorikusi.products.controller;

import com.qorikusi.products.domain.model.dto.request.ProductoRequest;
import com.qorikusi.products.domain.model.dto.response.ProductoResponse;
import com.qorikusi.products.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @PostMapping
    public ResponseEntity<ProductoResponse> crearProducto(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse productoResponse = productoService.crearProducto(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoResponse);
    }

    @GetMapping
    public ResponseEntity<Page<ProductoResponse>> listarProductos(@RequestParam(required = false) Boolean estado,
                                                                  Pageable pageable) {
        return ResponseEntity.ok(productoService.listarProductos(estado, pageable));
    }

    @GetMapping("/{uuidProducto}")
    public ResponseEntity<ProductoResponse> listarProductoPorId(@PathVariable UUID uuidProducto) {
        return ResponseEntity.ok(productoService.obtenerProductoPorUuid(uuidProducto));
    }

    @PatchMapping("/{uuidProducto}")
    public ResponseEntity<ProductoResponse> actualizarProducto(@PathVariable UUID uuidProducto,
                                                               @Valid @RequestBody ProductoRequest request) {
        ProductoResponse productoResponse = productoService.actualizarProducto(uuidProducto, request);
        return ResponseEntity.ok(productoResponse);
    }

    /**
     * Eliminar (desactivar) un producto
     * Cambia el estado del producto a false (inactivo)
     */
    @DeleteMapping("/{uuidProducto}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable UUID uuidProducto) {
        productoService.eliminarProducto(uuidProducto);
        return ResponseEntity.noContent().build();
    }

    /**
     * NUEVO: Activar un producto (cambiar estado a true)
     * Este endpoint permite reactivar productos que fueron desactivados
     */
    @PatchMapping("/{uuidProducto}/activate")
    public ResponseEntity<ProductoResponse> activarProducto(@PathVariable UUID uuidProducto) {
        ProductoResponse productoResponse = productoService.activarProducto(uuidProducto);
        return ResponseEntity.ok(productoResponse);
    }
}