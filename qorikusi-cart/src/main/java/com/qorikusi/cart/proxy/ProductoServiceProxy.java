package com.qorikusi.cart.proxy;

import com.qorikusi.cart.domain.model.dto.response.ProductoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;
import java.util.UUID;

@FeignClient(name = "producto-service", url = "${http.client.product.url}")
public interface ProductoServiceProxy {
    @GetMapping("products/{uuidProducto}")
    Optional<ProductoResponse> getProductByUuid(@PathVariable("uuidProducto") UUID uuidProducto);
}