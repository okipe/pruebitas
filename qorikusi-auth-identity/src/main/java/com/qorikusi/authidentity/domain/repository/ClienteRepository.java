package com.qorikusi.authidentity.domain.repository;

import com.qorikusi.authidentity.domain.model.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByCorreo(String correo);

    Optional<Cliente> findByUuidCliente(UUID uuidCliente);
}