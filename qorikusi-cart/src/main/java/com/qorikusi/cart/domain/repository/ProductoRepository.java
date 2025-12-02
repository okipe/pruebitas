package com.qorikusi.cart.domain.repository;

import com.qorikusi.cart.domain.model.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    @Query(nativeQuery = true, value = "SELECT id_producto FROM producto WHERE uuid_producto = :uuidProducto")
    Integer retrieveProductId(@Param("uuidProducto") UUID uuidProducto);
}