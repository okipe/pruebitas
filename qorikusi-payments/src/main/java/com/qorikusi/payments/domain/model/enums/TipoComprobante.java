package com.qorikusi.payments.domain.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoComprobante {
    BOLETA ("Boleta"),
    FACTURA ("Factura");

    private final String value;

    TipoComprobante(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static TipoComprobante fromValue(String value) {
        for (TipoComprobante estado : values()) {
            if (estado.value.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException();
    }
}