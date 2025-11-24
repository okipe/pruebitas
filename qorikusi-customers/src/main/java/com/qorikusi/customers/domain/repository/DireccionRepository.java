package com.qorikusi.customers.domain.repository;

import com.qorikusi.customers.domain.model.entity.Cliente;
import com.qorikusi.customers.domain.model.entity.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DireccionRepository extends JpaRepository<Direccion, Integer> {
    List<Direccion> findByCliente(Cliente cliente);
    Optional<Direccion> findByClienteAndUuidDireccion(Cliente cliente, UUID uuid);
}