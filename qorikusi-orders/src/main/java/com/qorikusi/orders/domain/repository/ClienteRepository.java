package com.qorikusi.orders.domain.repository;

import com.qorikusi.orders.domain.model.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByUuidCliente(UUID uuid);
}