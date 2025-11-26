package com.qorikusi.products.domain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
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

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column(length = 150, nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 50)
    private String energiaLunar;

    @Column(length = 250)
    private String imagen;

    @Column(nullable = false)
    private boolean estado;


    @PrePersist
    public void prePersist() {
        if (uuidProducto == null) {
            uuidProducto = UUID.randomUUID();
        }
    }
}