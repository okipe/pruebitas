package com.qorikusi.products.controller;

import com.qorikusi.products.domain.model.dto.response.CatalogoResponse;
import com.qorikusi.products.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/catalog/products")
@RequiredArgsConstructor
public class CatalogoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<Page<CatalogoResponse>> listarCatalogo(@RequestParam(required = false) String categoria,
                                                                 Pageable pageable) {
        return ResponseEntity.ok(productoService.listarCatalogo(categoria, pageable));
    }

    @GetMapping("/{uuidProducto}")
    public ResponseEntity<CatalogoResponse> obtenerProductoDelCatalogo(@PathVariable UUID uuidProducto) {
        return ResponseEntity.ok(productoService.obtenerProductoDelCatalogo(uuidProducto));
    }
}