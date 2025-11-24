package com.qorikusi.customers.service;

import com.qorikusi.customers.domain.model.dto.request.DireccionRequest;
import com.qorikusi.customers.domain.model.dto.response.DireccionResponse;

import java.util.List;
import java.util.UUID;

public interface DireccionService {
    DireccionResponse crearDireccion(String token, DireccionRequest request);

    List<DireccionResponse> listarDireccionesPorCliente(String token);

    DireccionResponse listarDireccionPorId(String token, UUID direccionUuid);

    DireccionResponse actualizarDireccion(String token, UUID uuidDireccion, DireccionRequest request);

    void eliminarDireccion(String token, UUID direccionUuid);
}