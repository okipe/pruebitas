package com.qorikusi.orders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class QorikusiOrdersApplication {

    public static void main(String[] args) {
        SpringApplication.run(QorikusiOrdersApplication.class, args);
    }

}