package com.qorikusi.payments.domain.model.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PagoResponse(
    UUID uuidPago,
    UUID uuidPedido,
    BigDecimal monto,
    String metodoPago,
    String estadoPago,
    LocalDateTime fechaPago,
    String numeroOperacion
) {}