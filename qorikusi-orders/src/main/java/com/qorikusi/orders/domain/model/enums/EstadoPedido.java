package com.qorikusi.orders.domain.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoPedido {
    PENDIENTE("Pendiente"),
    CANCELADO("Cancelado"),
    RECHAZADO("Rechazado");

    private final String value;

    EstadoPedido(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static EstadoPedido fromValue(String value) {
        for (EstadoPedido estado : values()) {
            if (estado.value.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException();
    }
}