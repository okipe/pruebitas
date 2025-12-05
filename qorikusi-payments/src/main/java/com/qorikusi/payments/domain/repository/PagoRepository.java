package com.qorikusi.payments.domain.repository;

import com.qorikusi.payments.domain.model.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
     Optional<Pago> findByUuidPago(UUID uuid);
}