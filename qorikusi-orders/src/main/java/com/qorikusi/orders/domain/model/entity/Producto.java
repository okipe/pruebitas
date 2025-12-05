package com.qorikusi.orders.domain.model.entity;

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
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProducto;

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidProducto;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private boolean estado;
}