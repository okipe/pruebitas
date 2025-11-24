package com.qorikusi.customers.service;

import com.qorikusi.customers.domain.model.dto.request.ResetEmailRequest;
import com.qorikusi.customers.domain.model.dto.request.ResetPasswordRequest;
import com.qorikusi.customers.domain.model.dto.request.UpdateClientDataRequest;
import com.qorikusi.customers.domain.model.dto.response.RetrieveClientDataResponse;
import com.qorikusi.customers.domain.model.dto.response.UpdateClientDataResponse;

public interface ClienteService {
    void cambiarContrasenia(String token, ResetPasswordRequest request);

    void cambiarCorreo(String token, ResetEmailRequest request);

    UpdateClientDataResponse actualizarCliente(String token, UpdateClientDataRequest request);

    RetrieveClientDataResponse mostrarDatosCliente(String token);
}