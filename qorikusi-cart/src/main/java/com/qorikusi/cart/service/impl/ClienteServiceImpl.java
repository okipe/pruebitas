package com.qorikusi.cart.service.impl;

import com.qorikusi.cart.domain.model.entity.Cliente;
import com.qorikusi.cart.domain.repository.ClienteRepository;
import com.qorikusi.cart.exception.ClientNotFoundException;
import com.qorikusi.cart.security.service.JwtService;
import com.qorikusi.cart.service.ClienteService;
import com.qorikusi.cart.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final JwtService jwtService;

    private static ClientNotFoundException clientNotFoundException() {
        log.error(Constants.CLIENT_NOT_FOUND_ERROR_DESCRIPTION);
        return new ClientNotFoundException();
    }

    @Override
    public Cliente obtenerDatos(String token) {
        UUID uuid = extraerUuidDelToken(token);
        return buscarClientePorUuid(uuid);
    }

    private Cliente buscarClientePorUuid(UUID uuid) {
        return clienteRepository.findByUuidCliente(uuid)
                .orElseThrow(ClienteServiceImpl::clientNotFoundException);
    }

    private UUID extraerUuidDelToken(String token) {
        return jwtService.getUuidFromToken(token);
    }
}