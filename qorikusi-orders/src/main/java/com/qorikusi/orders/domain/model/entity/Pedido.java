package com.qorikusi.orders.domain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPedido;

    @Column(columnDefinition = "BINARY(16)", unique = true, nullable = false)
    private UUID uuidPedido;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(nullable = false)
    private LocalDateTime fechaPedido;

    @Column(length = 15, nullable = false)
    private String estado;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal total;

    @Column(length = 50, nullable = false)
    private String tipoEnvio;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, targetEntity = DetallePedido.class)
    private List<DetallePedido> detalles;

    @PrePersist
    public void prePersist() {
        if (uuidPedido == null) {
            uuidPedido = UUID.randomUUID();
        }
    }
}