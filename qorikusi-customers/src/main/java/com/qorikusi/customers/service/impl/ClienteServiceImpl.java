package com.qorikusi.customers.service.impl;

import com.qorikusi.customers.domain.model.dto.request.ResetEmailRequest;
import com.qorikusi.customers.domain.model.dto.request.ResetPasswordRequest;
import com.qorikusi.customers.domain.model.dto.request.UpdateClientDataRequest;
import com.qorikusi.customers.domain.model.dto.response.RetrieveClientDataResponse;
import com.qorikusi.customers.domain.model.dto.response.UpdateClientDataResponse;
import com.qorikusi.customers.domain.model.entity.Cliente;
import com.qorikusi.customers.domain.repository.ClienteRepository;
import com.qorikusi.customers.exception.ClientNotFoundException;
import com.qorikusi.customers.exception.InvalidCredentialsException;
import com.qorikusi.customers.domain.mapper.ClienteMapper;
import com.qorikusi.customers.security.service.JwtService;
import com.qorikusi.customers.service.ClienteService;
import com.qorikusi.customers.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ClienteMapper clienteMapper;

    private static ClientNotFoundException clientNotFoundException() {
        log.error(Constants.CLIENT_NOT_FOUND_ERROR_DESCRIPTION);
        return new ClientNotFoundException();
    }

    private static InvalidCredentialsException invalidCredentialsException() {
        log.error(Constants.INVALID_CREDENTIALS_ERROR_DESCRIPTION);
        return new InvalidCredentialsException();
    }

    @Override
    public void cambiarContrasenia(String token, ResetPasswordRequest request) {
        UUID uuid = extraerUuidDelToken(token);
        Cliente cliente = buscarClientePorContrasenia(request.getActualContrasenia(), uuid);
        cliente.setContrasenia(passwordEncoder.encode(request.getNuevaContrasenia()));
        clienteRepository.save(cliente);
    }

    @Override
    public void cambiarCorreo(String token, ResetEmailRequest request) {
        UUID uuid = extraerUuidDelToken(token);
        Cliente cliente = buscarClientePorCorreo(request.getActualCorreo(), uuid);
        cliente.setCorreo(request.getNuevoCorreo());
        clienteRepository.save(cliente);
    }

    @Override
    public UpdateClientDataResponse actualizarCliente(String token, UpdateClientDataRequest request) {
        UUID uuid = extraerUuidDelToken(token);
        Cliente cliente = buscarClientePorUuid(uuid);
        clienteMapper.updateClienteFromRequest(request, cliente);
        clienteRepository.save(cliente);

        return clienteMapper.toUpdateClientDataResponse(cliente);
    }

    @Override
    public RetrieveClientDataResponse mostrarDatosCliente(String token) {
        UUID uuid = extraerUuidDelToken(token);
        Cliente cliente = buscarClientePorUuid(uuid);
        return clienteMapper.toRetrieveClientDataResponse(cliente);
    }

    private Cliente buscarClientePorUuid(UUID uuid) {
        return clienteRepository.findByUuidCliente(uuid)
                .orElseThrow(ClienteServiceImpl::clientNotFoundException);
    }

    private Cliente buscarClientePorCorreo(String correo, UUID uuid) {
        return clienteRepository.findByCorreoAndUuidCliente(correo, uuid)
                .orElseThrow(ClienteServiceImpl::invalidCredentialsException);
    }

    private Cliente buscarClientePorContrasenia(String contrasenia, UUID uuid) {
        Cliente cliente = buscarClientePorUuid(uuid);
        if (!passwordEncoder.matches(contrasenia, cliente.getContrasenia())) {
            throw invalidCredentialsException();
        }

        return cliente;
    }

    private UUID extraerUuidDelToken(String token) {
        return jwtService.getUuidFromToken(token);
    }
}