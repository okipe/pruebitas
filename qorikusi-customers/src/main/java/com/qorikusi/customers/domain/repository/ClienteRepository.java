package com.qorikusi.customers.domain.repository;

import com.qorikusi.customers.domain.model.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByCorreoAndUuidCliente(String correo, UUID uuidCliente);

    Optional<Cliente> findByUuidCliente(UUID uuidCliente);
}