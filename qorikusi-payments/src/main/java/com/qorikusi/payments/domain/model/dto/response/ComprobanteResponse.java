package com.qorikusi.payments.domain.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ComprobanteResponse(
    // Campos de Boleta
    UUID uuidBoleta,
    String dni,
    String nombre,
    // Campos de Factura
    UUID uuidFactura,
    String ruc,
    String razonSocial,
    // Campos comunes
    LocalDateTime fechaEmision,
    BigDecimal montoTotal,
    String serie,
    String numero,
    PagoResponse pago
) {}