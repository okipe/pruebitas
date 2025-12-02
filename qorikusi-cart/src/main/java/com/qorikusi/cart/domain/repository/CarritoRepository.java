package com.qorikusi.cart.domain.repository;

import com.qorikusi.cart.domain.model.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {
    Optional<Carrito> findByUuidCarrito(UUID uuidCarrito);
    Optional<Carrito> findByCliente_IdCliente(Integer idCliente);
    int deleteByClienteIsNullAndFechaCreacionBefore(LocalDateTime fechaLimite);
}