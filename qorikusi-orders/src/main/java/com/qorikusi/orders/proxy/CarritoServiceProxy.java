package com.qorikusi.orders.proxy;

import com.qorikusi.orders.domain.model.dto.response.CarritoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;
import java.util.UUID;

@FeignClient(name = "cart-service", url = "${http.client.cart.url}")
public interface CarritoServiceProxy {
    @GetMapping("/{uuidCart}")
    Optional<CarritoResponse> obtenerCarrito(@PathVariable("uuidCart") UUID uuidCart);
}