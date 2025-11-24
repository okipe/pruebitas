package com.qorikusi.authidentity.domain.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "id_cliente")
public class Cliente extends Persona {

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidCliente = UUID.randomUUID();

    @Column(length = 150, nullable = false)
    private String correo;

    @Column(length = 150, nullable = false)
    private String contrasenia;

    @Column(nullable = false)
    private LocalDate fechaRegistro;

    @Column(nullable = false)
    private boolean estado;

}