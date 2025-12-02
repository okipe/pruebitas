package com.qorikusi.cart.domain.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Representación mínima de la entidad Producto, necesaria para establecer
 * la relación de clave foránea desde DetalleCarrito.
 * Esta entidad asume que la tabla 'producto' tiene una clave primaria 'idProducto'
 * y una columna 'uuidProducto' para la identificación pública.
 */
@Entity
@Getter
@Setter
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProducto;

    @Column(columnDefinition = "BINARY(16)", unique = true, nullable = false)
    private UUID uuidProducto;
}