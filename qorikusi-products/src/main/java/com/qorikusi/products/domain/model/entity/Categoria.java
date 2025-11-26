package com.qorikusi.products.domain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria;

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidCategoria;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "categoria", targetEntity = Producto.class)
    private List<Producto> productos;

    @PrePersist
    public void prePersist() {
        if (uuidCategoria == null) {
            uuidCategoria = UUID.randomUUID();
        }
    }
}