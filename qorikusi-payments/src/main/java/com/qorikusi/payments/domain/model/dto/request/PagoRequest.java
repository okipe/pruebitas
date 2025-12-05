package com.qorikusi.payments.domain.model.dto.request;

import com.qorikusi.payments.domain.model.enums.MetodoPago;
import com.qorikusi.payments.domain.model.enums.TipoComprobante;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record PagoRequest(
    @NotNull UUID uuidPedido,
    @NotNull BigDecimal monto,
    @NotNull MetodoPago metodoPago,
    @NotNull TipoComprobante tipoComprobante,
    @NotNull String clienteDocumento,
    @NotNull String clienteNombre
) {}