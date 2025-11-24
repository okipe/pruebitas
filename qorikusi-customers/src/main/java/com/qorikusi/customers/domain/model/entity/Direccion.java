package com.qorikusi.customers.domain.model.entity;

import jakarta.persistence.*;
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
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDireccion;

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidDireccion;

    @Column(length = 250, nullable = false)
    private String calle;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_ubigeo", nullable = false)
    private Ubigeo ubigeo;

    @PrePersist
    public void prePersist() {
        if (uuidDireccion == null) {
            uuidDireccion = UUID.randomUUID();
        }
    }
}