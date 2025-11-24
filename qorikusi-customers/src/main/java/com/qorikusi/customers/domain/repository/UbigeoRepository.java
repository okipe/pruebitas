package com.qorikusi.customers.domain.repository;

import com.qorikusi.customers.domain.model.entity.Ubigeo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UbigeoRepository extends JpaRepository<Ubigeo, Long> {
    Optional<Ubigeo> findByCodigoUbigeo(String codigoUbigeo);
}