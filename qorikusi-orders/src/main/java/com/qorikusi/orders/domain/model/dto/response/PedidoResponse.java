package com.qorikusi.orders.domain.model.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PedidoResponse(
    UUID uuidPedido,
    String codigoPedido,
    String estado,
    BigDecimal total,
    String tipoEnvio,
    LocalDateTime fechaPedido,
    ClienteResponse cliente,
    List<DetallePedidoResponse> productos
) {
    public record DetallePedidoResponse(
            UUID uuidProducto,
            String categoria,
            String nombre,
            BigDecimal precio,
            Integer cantidad,
            BigDecimal subtotal
    ) {}
}