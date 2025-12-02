package com.qorikusi.cart.service;

import com.qorikusi.cart.domain.model.entity.Cliente;

public interface ClienteService {
    Cliente obtenerDatos(String token);
}