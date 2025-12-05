package com.qorikusi.payments.domain.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoPago {
    PENDIENTE ("Pendiente"),
    COMPLETADO ("Completado"),
    FALLIDO ("Fallido");

    private final String value;

    EstadoPago(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

}