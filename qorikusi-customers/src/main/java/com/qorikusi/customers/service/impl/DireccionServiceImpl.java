package com.qorikusi.customers.service.impl;

import com.qorikusi.customers.domain.model.dto.request.DireccionRequest;
import com.qorikusi.customers.domain.model.dto.response.DireccionResponse;
import com.qorikusi.customers.domain.model.entity.Cliente;
import com.qorikusi.customers.domain.model.entity.Direccion;
import com.qorikusi.customers.domain.model.entity.Ubigeo;
import com.qorikusi.customers.domain.repository.ClienteRepository;
import com.qorikusi.customers.domain.repository.DireccionRepository;
import com.qorikusi.customers.domain.repository.UbigeoRepository;
import com.qorikusi.customers.exception.ClientNotFoundException;
import com.qorikusi.customers.exception.DireccionNotFoundException;
import com.qorikusi.customers.exception.UbigeoNotFoundException;
import com.qorikusi.customers.domain.mapper.DireccionMapper;
import com.qorikusi.customers.security.service.JwtService;
import com.qorikusi.customers.service.DireccionService;
import com.qorikusi.customers.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class DireccionServiceImpl implements DireccionService {

    private final DireccionRepository direccionRepository;
    private final ClienteRepository clienteRepository;
    private final UbigeoRepository ubigeoRepository;
    private final JwtService jwtService;
    private final DireccionMapper direccionMapper;

    private static ClientNotFoundException clientNotFoundException() {
        log.error(Constants.CLIENT_NOT_FOUND_ERROR_DESCRIPTION);
        return new ClientNotFoundException();
    }

    private static DireccionNotFoundException direccionNotFoundException() {
        log.error(Constants.DIRECTION_NOT_FOUND_ERROR_DESCRIPTION);
        return new DireccionNotFoundException();
    }

    private static UbigeoNotFoundException ubigeoNotFoundException() {
        log.error(Constants.UBIGEO_NOT_FOUND_ERROR_DESCRIPTION);
        return new UbigeoNotFoundException();
    }

    @Override
    public DireccionResponse crearDireccion(String token, DireccionRequest request) {
        Cliente cliente = getClienteFromToken(token);
        Ubigeo ubigeo = getUbigeoFromDatabase(request.getCodigoUbigeo());

        Direccion direccion = new Direccion();
        direccion.setCliente(cliente);
        direccion.setUbigeo(ubigeo);
        Direccion direccionSave = direccionMapper.createDireccionFromRequest(request, direccion);
        return direccionMapper.toDireccionResponse(direccionRepository.save(direccionSave));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DireccionResponse> listarDireccionesPorCliente(String token) {
        Cliente cliente = getClienteFromToken(token);

        return direccionRepository.findByCliente(cliente)
                .stream()
                .map(direccionMapper::toDireccionResponse)
                .toList();
    }

    @Override
    public DireccionResponse listarDireccionPorId(String token, UUID uuidDireccion) {
        Cliente cliente = getClienteFromToken(token);
        Direccion direccion = getDireccionFromDatabase(cliente, uuidDireccion);
        return direccionMapper.toDireccionResponse(direccion);
    }

    @Override
    public DireccionResponse actualizarDireccion(String token, UUID uuidDireccion, DireccionRequest request) {
        Cliente cliente = getClienteFromToken(token);
        Direccion direccion = getDireccionFromDatabase(cliente, uuidDireccion);
        Ubigeo ubigeo = getUbigeoFromDatabase(request.getCodigoUbigeo());
        direccion.setUbigeo(ubigeo);
        direccionMapper.updateDireccionFromRequest(request, direccion);

        return direccionMapper.toDireccionResponse(direccionRepository.save(direccion));
    }

    @Override
    public void eliminarDireccion(String token, UUID uuidDireccion) {
        Cliente cliente = getClienteFromToken(token);
        Direccion direccion = getDireccionFromDatabase(cliente, uuidDireccion);
        direccionRepository.delete(direccion);
    }

    private Cliente getClienteFromToken(String token) {
        UUID uuidCliente = jwtService.getUuidFromToken(token);
        return clienteRepository.findByUuidCliente(uuidCliente)
                .orElseThrow(DireccionServiceImpl::clientNotFoundException);
    }

    private Direccion getDireccionFromDatabase(Cliente cliente, UUID direccionUuid) {
        return direccionRepository.findByClienteAndUuidDireccion(cliente, direccionUuid)
                .orElseThrow(DireccionServiceImpl::direccionNotFoundException);
    }

    private Ubigeo getUbigeoFromDatabase(String codigoUbigeo) {
        return ubigeoRepository.findByCodigoUbigeo(codigoUbigeo)
                .orElseThrow(DireccionServiceImpl::ubigeoNotFoundException);
    }

}