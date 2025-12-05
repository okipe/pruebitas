package com.qorikusi.orders.domain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDetallePedido;

    @Column(columnDefinition = "BINARY(16)", unique = true, nullable = false)
    private UUID uuidDetallePedido;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @PrePersist
    public void prePersist() {
        if (uuidDetallePedido == null) {
            uuidDetallePedido = UUID.randomUUID();
        }
    }
}