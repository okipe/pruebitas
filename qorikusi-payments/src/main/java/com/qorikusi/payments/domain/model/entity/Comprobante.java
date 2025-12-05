package com.qorikusi.payments.domain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Comprobante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idComprobante;

    @ManyToOne
    @JoinColumn(name = "id_pago", nullable = false)
    private Pago pago;

    @Column(nullable = false)
    private LocalDateTime fechaEmision;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal montoTotal;

    @Column(length = 10, nullable = false)
    private String serie;

    @Column(length = 20, nullable = false)
    private String numero;


}