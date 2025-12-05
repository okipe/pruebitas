package com.qorikusi.orders.controller;

import com.qorikusi.orders.domain.model.dto.request.ActualizarPedidoRequest;
import com.qorikusi.orders.domain.model.dto.response.ResumenPedidoResponse;
import com.qorikusi.orders.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminPedidoController {

    private final PedidoService pedidoService;

    @GetMapping()
    public ResponseEntity<List<ResumenPedidoResponse>> listarPedidos() {
        List<ResumenPedidoResponse> listaPedidos = pedidoService.listarPedidosAdmin();
        return ResponseEntity.ok(listaPedidos);
    }
    
    @PatchMapping("/{uuidPedido}")
    public ResponseEntity<ResumenPedidoResponse> actualizarPedido(@PathVariable String uuidPedido,
                                                                  @RequestBody ActualizarPedidoRequest request) {
        ResumenPedidoResponse pedidoActualizado = pedidoService.actualizarPedido(uuidPedido, request);
        return ResponseEntity.ok(pedidoActualizado);
    }

}