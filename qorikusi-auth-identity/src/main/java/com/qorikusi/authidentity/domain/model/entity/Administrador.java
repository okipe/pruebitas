package com.qorikusi.authidentity.domain.model.entity;


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
@PrimaryKeyJoinColumn(name = "id_administrador")
public class Administrador extends Persona {

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidAdministrador;

    @Column(length = 50, nullable = false)
    private String usuario;

    @Column(length = 150, nullable = false)
    private String contrasenia;

    @Column(nullable = false)
    private boolean estado;

    @PrePersist
    public void prePersist() {
        if (uuidAdministrador == null) {
            uuidAdministrador = UUID.randomUUID();
        }
    }
}