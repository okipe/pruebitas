package com.qorikusi.payments.util;

import lombok.experimental.UtilityClass;

import java.util.Random;

@UtilityClass
public class Utility {
    private final Random random = new Random();

    public String generarNumeroOperacion(){
        int numero = random.nextInt(100000000);
        return String.format("%08d", numero);
    }

    public String generarSerie() {
        return "F" + String.format("%03d", random.nextInt(1000));
    }

    public String generarNumero() {
        return String.format("%08d", random.nextInt(100000000));
    }
}
