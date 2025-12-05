package com.qorikusi.payments.service;

import com.qorikusi.payments.domain.model.dto.request.PagoRequest;
import com.qorikusi.payments.domain.model.dto.response.PagoResponse;

public interface PagoService {
    PagoResponse procesarPago(PagoRequest pagoRequest);
}