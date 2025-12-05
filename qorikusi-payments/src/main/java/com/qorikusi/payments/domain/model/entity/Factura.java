package com.qorikusi.payments.domain.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "id_factura")
public class Factura extends Comprobante {

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidFactura;

    @Column(length = 11, nullable = false)
    private String ruc;

    @Column(length = 250, nullable = false)
    private String razonSocial;

    @PrePersist
    public void prePersist() {
        if (uuidFactura == null) {
            uuidFactura = UUID.randomUUID();
        }
    }
}