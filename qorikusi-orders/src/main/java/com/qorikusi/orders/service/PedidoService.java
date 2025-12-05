package com.qorikusi.orders.service;

import com.qorikusi.orders.domain.model.dto.request.ActualizarPedidoRequest;
import com.qorikusi.orders.domain.model.dto.response.PedidoResponse;
import com.qorikusi.orders.domain.model.dto.response.ResumenPedidoResponse;

import java.util.List;
import java.util.UUID;

public interface PedidoService {
    ResumenPedidoResponse crearPedido(String token, UUID uuidCart);
    List<PedidoResponse> listarPedidos(String token);
    List<ResumenPedidoResponse> listarPedidosAdmin();
    PedidoResponse obtenerPedido(String token, UUID uuidPedido);
    ResumenPedidoResponse actualizarPedido(String uuidPedido, ActualizarPedidoRequest request);
}