package com.qorikusi.orders.domain.model.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CrearPedidoRequest(
    @NotNull UUID uuidCart,
    String tipoEnvio
) {}