package com.qorikusi.orders.util;

import lombok.experimental.UtilityClass;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@UtilityClass
public class Utility {

    public String generarCodigoPedido(LocalDateTime fechaPedido) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
        String timestampPart = fechaPedido.format(formatter);
        int randomPart = ThreadLocalRandom.current().nextInt(1000, 10000);
        return String.format("%s-%s-%d", Constants.QORIKUSI_PREFIX, timestampPart, randomPart);
    }
}