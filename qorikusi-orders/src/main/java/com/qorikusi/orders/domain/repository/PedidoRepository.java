package com.qorikusi.orders.domain.repository;

import com.qorikusi.orders.domain.model.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByUuidPedido(UUID uuid);
    Optional<List<Pedido>> findAllByCliente_UuidClienteOrderByFechaPedidoDesc(UUID uuidCliente);
    Optional<List<Pedido>>findByEstadoNotIn(Collection<String> estados);
}