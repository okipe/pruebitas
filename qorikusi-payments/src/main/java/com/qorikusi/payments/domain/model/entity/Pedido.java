package com.qorikusi.payments.domain.model.entity;

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
public class Pedido {
    @Id
    private Integer idPedido;

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidPedido;
}