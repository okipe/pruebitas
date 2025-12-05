package com.qorikusi.orders.domain.repository;

import com.qorikusi.orders.domain.model.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByUuidProductoIn(Collection<UUID> uuids);
}