package com.qorikusi.payments.controller;

import com.qorikusi.payments.domain.model.dto.request.PagoRequest;
import com.qorikusi.payments.domain.model.dto.response.ComprobanteResponse;
import com.qorikusi.payments.domain.model.dto.response.PagoResponse;
import com.qorikusi.payments.service.ComprobanteService;
import com.qorikusi.payments.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client/payments")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;
    private final ComprobanteService comprobanteService;

    @PostMapping
    public ResponseEntity<ComprobanteResponse> registrarPago(@Valid @RequestBody PagoRequest pagoRequest) {
        PagoResponse pagoProcesado = pagoService.procesarPago(pagoRequest);
        ComprobanteResponse comprobanteResponse = comprobanteService.generarComprobante(pagoProcesado, pagoRequest);
        return ResponseEntity.ok(comprobanteResponse);
    }
}