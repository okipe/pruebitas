package com.qorikusi.orders.service;

import com.qorikusi.orders.domain.model.entity.Cliente;

public interface ClienteService {
    Cliente obtenerDatos(String token);
}