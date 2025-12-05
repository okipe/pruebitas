package com.qorikusi.payments.domain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPago;

    @Column(columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private UUID uuidPago;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal monto;

    @Column(length = 15, nullable = false)
    private String metodoPago;

    @Column(length = 15, nullable = false)
    private String estadoPago;

    @Column(nullable = false)
    private LocalDateTime fechaPago;

    @Column(length = 50)
    private String numeroOperacion;

    @PrePersist
    public void prePersist() {
        if (uuidPago == null) {
            uuidPago = UUID.randomUUID();
        }
    }
}