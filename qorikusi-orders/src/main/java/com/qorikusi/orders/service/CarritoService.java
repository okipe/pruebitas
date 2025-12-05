package com.qorikusi.orders.service;

import com.qorikusi.orders.domain.model.dto.response.CarritoResponse;
import java.util.UUID;

public interface CarritoService {
    CarritoResponse getCartById(UUID cartId);
}