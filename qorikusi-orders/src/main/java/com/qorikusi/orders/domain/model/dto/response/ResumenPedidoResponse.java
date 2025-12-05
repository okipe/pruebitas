package com.qorikusi.orders.domain.model.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ResumenPedidoResponse(
    UUID uuidPedido,
    String codigoPedido,
    String estado,
    BigDecimal total,
    String tipoEnvio,
    LocalDateTime fechaPedido
) {}