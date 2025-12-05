package com.qorikusi.payments.domain.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MetodoPago {
    TARJETA ("Tarjeta"),
    BILLETERA ("Billetera"),
    TRANSFERENCIA ("Transferencia");
    private final String value;

    MetodoPago(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static MetodoPago fromValue(String value) {
        for (MetodoPago estado : values()) {
            if (estado.value.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException();
    }
}