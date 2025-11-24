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
public class Ubigeo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUbigeo;

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidUbigeo;

    @Column(length = 6, nullable = false)
    private String codigoUbigeo;

    @Column(length = 50, nullable = false)
    private String departamento;

    @Column(length = 50, nullable = false)
    private String provincia;

    @Column(length = 50, nullable = false)
    private String distrito;

    @PrePersist
    public void prePersist() {
        if (uuidUbigeo == null) {
            uuidUbigeo = UUID.randomUUID();
        }
    }
}