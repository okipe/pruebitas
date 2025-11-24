package com.qorikusi.authidentity.domain.repository;

import com.qorikusi.authidentity.domain.model.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    Optional<Administrador> findByUsuario(String usuario);
}