package com.qorikusi.payments.domain.repository;

import com.qorikusi.payments.domain.model.entity.Comprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComprobanteRepository extends JpaRepository<Comprobante, Long> {
}
