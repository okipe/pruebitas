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
@PrimaryKeyJoinColumn(name = "id_boleta")
public class Boleta extends Comprobante {

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidBoleta;

    @Column(length = 8, nullable = false)
    private String dni;

    @Column(length = 250, nullable = false)
    private String nombre;

    @PrePersist
    public void prePersist() {
        if (uuidBoleta == null) {
            uuidBoleta = UUID.randomUUID();
        }
    }
}