package com.qorikusi.customers.domain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "id_cliente")
public class Cliente extends Persona {

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidCliente;

    @Column(length = 150, nullable = false)
    private String correo;

    @Column(length = 150, nullable = false)
    private String contrasenia;

    private LocalDate fechaRegistro;

    private Integer puntosFidelidad;

    @Column(length = 20)
    private String signoZodiacal;

    @Column(length = 30)
    private String faseLunarPreferida;

    @Column(nullable = false)
    private boolean estado;

    @OneToMany(mappedBy = "cliente", targetEntity = Direccion.class)
    private List<Direccion> direcciones;

    @PrePersist
    public void prePersist() {
        if (uuidCliente == null) {
            uuidCliente = UUID.randomUUID();
        }
    }
}