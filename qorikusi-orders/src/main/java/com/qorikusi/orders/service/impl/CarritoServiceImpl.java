package com.qorikusi.orders.service.impl;

import com.qorikusi.orders.domain.model.dto.response.CarritoResponse;
import com.qorikusi.orders.exception.CartNotFoundException;
import com.qorikusi.orders.exception.ServiceCommunicationException;
import com.qorikusi.orders.proxy.CarritoServiceProxy;
import com.qorikusi.orders.service.CarritoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class CarritoServiceImpl implements CarritoService {

    private final CarritoServiceProxy carritoServiceProxy;

    @Override
    public CarritoResponse getCartById(UUID uuidCart) {
        CarritoResponse carritoResponse;

        try {
            carritoResponse = carritoServiceProxy.obtenerCarrito(uuidCart)
                    .orElseThrow(CartNotFoundException::new);
        } catch (RuntimeException e) {
            log.error("Error de comunicación con el servicio de carritos al buscar por UUID {}", uuidCart, e);
            throw new ServiceCommunicationException();
        }

        return carritoResponse;
    }
}