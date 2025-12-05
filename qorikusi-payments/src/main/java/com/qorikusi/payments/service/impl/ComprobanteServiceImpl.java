package com.qorikusi.payments.service.impl;

import com.qorikusi.payments.domain.mapper.ComprobanteMapper;
import com.qorikusi.payments.domain.model.dto.request.PagoRequest;
import com.qorikusi.payments.domain.model.dto.response.ComprobanteResponse;
import com.qorikusi.payments.domain.model.dto.response.PagoResponse;
import com.qorikusi.payments.domain.model.entity.Boleta;
import com.qorikusi.payments.domain.model.entity.Comprobante;
import com.qorikusi.payments.domain.model.entity.Factura;
import com.qorikusi.payments.domain.model.entity.Pago;
import com.qorikusi.payments.domain.model.enums.TipoComprobante;
import com.qorikusi.payments.domain.repository.ComprobanteRepository;
import com.qorikusi.payments.domain.repository.PagoRepository;
import com.qorikusi.payments.exception.PaymentNotFoundException;
import com.qorikusi.payments.service.ComprobanteService;
import com.qorikusi.payments.util.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class ComprobanteServiceImpl implements ComprobanteService {

    private final ComprobanteMapper comprobanteMapper;
    private final ComprobanteRepository comprobanteRepository;
    private final PagoRepository pagoRepository;

    @Override
    public ComprobanteResponse generarComprobante(PagoResponse pagoProcesado, PagoRequest pagoRequest) {
        Pago pago = pagoRepository.findByUuidPago(pagoProcesado.uuidPago())
                .orElseThrow(PaymentNotFoundException::new);

        Comprobante comprobante = crearComprobante(pagoRequest);
        comprobante.setPago(pago);
        comprobante.setFechaEmision(LocalDateTime.now());
        comprobante.setMontoTotal(pagoRequest.monto());
        comprobante.setSerie(Utility.generarSerie());
        comprobante.setNumero(Utility.generarNumero());

        comprobante = comprobanteRepository.save(comprobante);
        
        return comprobanteMapper.toComprobanteResponse(comprobante);
    }

    private Comprobante crearComprobante(PagoRequest pagoRequest) {
        if (TipoComprobante.FACTURA.equals(pagoRequest.tipoComprobante())) {
            Factura factura = new Factura();
            factura.setRuc(pagoRequest.clienteDocumento());
            factura.setRazonSocial(pagoRequest.clienteNombre());
            return factura;
        } else {
            Boleta boleta = new Boleta();
            boleta.setDni(pagoRequest.clienteDocumento());
            boleta.setNombre(pagoRequest.clienteNombre());
            return boleta;
        }
    }
}