package com.qorikusi.customers.controller;

import com.qorikusi.customers.domain.model.dto.request.DireccionRequest;
import com.qorikusi.customers.domain.model.dto.response.DireccionResponse;
import com.qorikusi.customers.service.DireccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client/addresses")
@RequiredArgsConstructor
public class DireccionController {
    private final DireccionService direccionService;

    @PostMapping
    public ResponseEntity<DireccionResponse> crearDireccion(@RequestHeader("Authorization") String token,
                                                            @Valid @RequestBody DireccionRequest request) {
        DireccionResponse resp = direccionService.crearDireccion(token, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping
    public ResponseEntity<List<DireccionResponse>> listarPorCliente(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(direccionService.listarDireccionesPorCliente(token));
    }

    @GetMapping("/{uuidDireccion}")
    public ResponseEntity<DireccionResponse> listarPorId(@RequestHeader("Authorization") String token,
                                                         @PathVariable String uuidDireccion) {
        UUID uuidDireccionFormat = UUID.fromString(uuidDireccion);
        return ResponseEntity.ok(direccionService.listarDireccionPorId(token, uuidDireccionFormat));
    }

    @PutMapping("/{uuidDireccion}")
    public ResponseEntity<DireccionResponse> actualizarDireccion(@RequestHeader("Authorization") String token,
                                                                 @PathVariable String uuidDireccion,
                                                                 @Valid @RequestBody DireccionRequest request) {
        UUID uuidDireccionFormat = UUID.fromString(uuidDireccion);
        DireccionResponse resp = direccionService.actualizarDireccion(token, uuidDireccionFormat, request);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{uuidDireccion}")
    public ResponseEntity<Void> eliminarDireccion(@RequestHeader("Authorization") String token,
                                                  @PathVariable String uuidDireccion) {
        UUID uuidDireccionFormat = UUID.fromString(uuidDireccion);
        direccionService.eliminarDireccion(token, uuidDireccionFormat);
        return ResponseEntity.noContent().build();
    }
}