package com.qorikusi.payments.service.impl;

import com.qorikusi.payments.domain.mapper.PagoMapper;
import com.qorikusi.payments.domain.model.dto.request.PagoRequest;
import com.qorikusi.payments.domain.model.dto.response.PagoResponse;
import com.qorikusi.payments.domain.model.entity.Pago;
import com.qorikusi.payments.domain.model.entity.Pedido;
import com.qorikusi.payments.domain.model.enums.EstadoPago;
import com.qorikusi.payments.domain.repository.PagoRepository;
import com.qorikusi.payments.domain.repository.PedidoRepository;
import com.qorikusi.payments.exception.OrderNotFoundException;
import com.qorikusi.payments.service.PagoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class PagoServiceImpl implements PagoService {

    private final PagoMapper pagoMapper;
    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;

    private final Random random = new Random();

    @Override
    public PagoResponse procesarPago(PagoRequest pagoRequest) {
        log.info("Registrando pago inicial con estado PENDIENTE para el pedido: {}", pagoRequest.uuidPedido());

        Pedido pedido = pedidoRepository.findByUuidPedido(pagoRequest.uuidPedido())
                .orElseThrow(OrderNotFoundException::new);
        Pago pago = pagoRepository.save(pagoMapper.toPago(pagoRequest, pedido));

        log.info("Procesando pago con la pasarela externa para el pago con UUID: {}", pago.getUuidPago());
        boolean pagoExitoso = simularPasarelaDePagos();

        if (pagoExitoso) {
            log.info("El pago fue exitoso. Actualizando estado a COMPLETADO.");
            pago.setEstadoPago(EstadoPago.COMPLETADO.getValue());
        } else {
            log.info("El pago falló. Actualizando estado a FALLIDO.");
            pago.setEstadoPago(EstadoPago.FALLIDO.getValue());
        }

        pago = pagoRepository.save(pago);
        log.info("Estado final del pago guardado: {}", pago.getEstadoPago());

        return pagoMapper.toPagoResponse(pago);
    }

    /**
     * Simula una llamada a un servicio de pasarela de pagos externo.
     * En un caso real, aquí iría la lógica para conectar con Visa, PayPal, etc.
     * @return true si el pago es exitoso, false en caso contrario.
     */
    private boolean simularPasarelaDePagos() {
        // Simula que el 90% de los pagos son exitosos.
        return random.nextInt(10) != 0;
    }
}