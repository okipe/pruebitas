package com.qorikusi.cart.domain.repository;

import com.qorikusi.cart.domain.model.entity.Carrito;
import com.qorikusi.cart.domain.model.entity.DetalleCarrito;
import com.qorikusi.cart.domain.model.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DetalleCarritoRepository extends JpaRepository<DetalleCarrito, Integer> {

    Optional<DetalleCarrito> findByCarritoAndProducto(Carrito carrito, Producto producto);

    void deleteAllByCarrito(Carrito carrito);
}