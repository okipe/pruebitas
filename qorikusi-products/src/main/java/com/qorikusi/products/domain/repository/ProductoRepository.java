package com.qorikusi.products.domain.repository;

import com.qorikusi.products.domain.model.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    Page<Producto> findByEstado(boolean estado, Pageable pageable);

    Page<Producto> findByEstadoAndCategoria_Nombre(boolean estado, String nombre, Pageable pageable);

    Optional<Producto> findByUuidProducto(UUID uuidProducto);

    Optional<Producto> findByUuidProductoAndEstado(UUID uuidProducto, boolean estado);
}