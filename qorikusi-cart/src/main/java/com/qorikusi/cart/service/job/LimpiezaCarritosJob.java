package com.qorikusi.cart.service.job;

import com.qorikusi.cart.domain.repository.CarritoRepository;
import com.qorikusi.cart.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class LimpiezaCarritosJob {

    private final CarritoRepository carritoRepository;

    /**
     * Tarea programada para limpiar carritos anónimos y antiguos.
     * La expresión CRON se configura en application.yml.
     */
    @Scheduled(cron = "${jobs.limpieza-carritos.cron}")
    @Transactional
    public void limpiarCarritosHuerfanos() {
        log.info("Iniciando tarea de limpieza de carritos huérfanos...");

        LocalDateTime fechaLimite = LocalDateTime.now().minusDays(Constants.DIAS_ANTIGUEDAD_PARA_BORRADO);

        int carritosEliminados = carritoRepository.deleteByClienteIsNullAndFechaCreacionBefore(fechaLimite);

        if (carritosEliminados > 0) {
            log.info("Se eliminaron {} carritos huérfanos.", carritosEliminados);
        } else {
            log.info("No se encontraron carritos huérfanos para eliminar.");
        }
    }
}