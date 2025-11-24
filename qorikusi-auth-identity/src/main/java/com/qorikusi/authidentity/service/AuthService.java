package com.qorikusi.authidentity.service;

import com.qorikusi.authidentity.domain.model.dto.request.*;
import com.qorikusi.authidentity.domain.model.dto.response.LoginResponse;

public interface AuthService {
    void registrarAdministrador(RegisterAdminRequest request);

    void registrarCliente(RegisterClientRequest request);

    LoginResponse iniciarSesion(LoginRequest request);

    void recuperarContrasenia(ForgotPasswordRequest request);

    void cambiarContrasenia(String token, ResetPasswordRequest request);
}