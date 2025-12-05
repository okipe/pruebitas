package com.qorikusi.orders.domain.model.dto.request;

import com.qorikusi.orders.domain.model.enums.EstadoPedido;

public record ActualizarPedidoRequest(
    EstadoPedido nuevoEstado
) {}