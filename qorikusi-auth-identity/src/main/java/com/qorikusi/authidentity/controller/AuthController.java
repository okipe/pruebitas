package com.qorikusi.authidentity.controller;

import com.qorikusi.authidentity.domain.model.dto.request.*;
import com.qorikusi.authidentity.domain.model.dto.response.LoginResponse;
import com.qorikusi.authidentity.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Endpoint que permite registrar administradores.", description = "Endpoint que registra administradores.")
    @PostMapping("/register/admin")
    public ResponseEntity<Void> registerAdmin(@Valid @RequestBody RegisterAdminRequest request) {
        authService.registrarAdministrador(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Endpoint que permite registrar clientes.", description = "Endpoint que registra clientes.")
    @PostMapping("/register/client")
    public ResponseEntity<Void> registerClient(@Valid @RequestBody RegisterClientRequest request) {
        authService.registrarCliente(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Endpoint que permite iniciar sesión.", description = "Endpoint para iniciar sesión.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.iniciarSesion(request));
    }

    @Operation(summary = "Endpoint que permite recuperar la contraseña.", description = "Endpoint que recupera la contraseña.")
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.recuperarContrasenia(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Endpoint que permite cambiar la contraseña.", description = "Endpoint que cambia la contraseña.")
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestParam String token, @Valid @RequestBody ResetPasswordRequest request) {
        authService.cambiarContrasenia(token, request);
        return ResponseEntity.noContent().build();
    }
}