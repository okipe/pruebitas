package com.qorikusi.customers.controller;

import com.qorikusi.customers.domain.model.dto.request.ResetEmailRequest;
import com.qorikusi.customers.domain.model.dto.request.ResetPasswordRequest;
import com.qorikusi.customers.domain.model.dto.request.UpdateClientDataRequest;
import com.qorikusi.customers.domain.model.dto.response.RetrieveClientDataResponse;
import com.qorikusi.customers.domain.model.dto.response.UpdateClientDataResponse;
import com.qorikusi.customers.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @Operation(summary = "Endpoint que permite cambiar la contraseña.", description = "Endpoint que cambia la contraseña.")
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestHeader("Authorization") String token, @Valid @RequestBody ResetPasswordRequest request) {
        clienteService.cambiarContrasenia(token, request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Endpoint que permite cambiar el correo.", description = "Endpoint que cambia el correo.")
    @PostMapping("/reset-email")
    public ResponseEntity<Void> resetEmail(@RequestHeader("Authorization") String token, @Valid @RequestBody ResetEmailRequest request) {
        clienteService.cambiarCorreo(token, request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Endpoint que permite actualizar datos del cliente.", description = "Endpoint que actualiza datos del cliente.")
    @PatchMapping
    public ResponseEntity<UpdateClientDataResponse> update(@RequestHeader("Authorization") String token, @Valid @RequestBody UpdateClientDataRequest request) {
        UpdateClientDataResponse response = clienteService.actualizarCliente(token, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Endpoint que permite mostrar los datos del cliente.", description = "Endpoint que muestra los datos del cliente.")
    @GetMapping
    public ResponseEntity<RetrieveClientDataResponse> retrieve(@RequestHeader("Authorization") String token) {
        RetrieveClientDataResponse response = clienteService.mostrarDatosCliente(token);
        return ResponseEntity.ok(response);
    }
}