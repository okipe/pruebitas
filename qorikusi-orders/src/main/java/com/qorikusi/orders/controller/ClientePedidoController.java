package com.qorikusi.orders.controller;

import com.qorikusi.orders.domain.model.dto.request.CrearPedidoRequest;
import com.qorikusi.orders.domain.model.dto.response.PedidoResponse;
import com.qorikusi.orders.domain.model.dto.response.ResumenPedidoResponse;
import com.qorikusi.orders.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client/orders")
@RequiredArgsConstructor
public class ClientePedidoController {

    private final PedidoService pedidoService;

    @GetMapping()
    public ResponseEntity<List<PedidoResponse>> listarPedidos(@RequestHeader("Authorization") String token) {
        List<PedidoResponse> listaPedidos = pedidoService.listarPedidos(token);
        return ResponseEntity.ok(listaPedidos);
    }

    @PostMapping()
    public ResponseEntity<ResumenPedidoResponse> crearPedido(@RequestHeader("Authorization") String token,
                                                             @Valid @RequestBody CrearPedidoRequest request) {
        ResumenPedidoResponse createdOrder = pedidoService.crearPedido(token, request.uuidCart());
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/{uuidPedido}")
    public ResponseEntity<PedidoResponse> obtenerPedido(@RequestHeader("Authorization") String token,
                                                        @PathVariable UUID uuidPedido) {
        PedidoResponse orderDetails = pedidoService.obtenerPedido(token, uuidPedido);
        return ResponseEntity.ok(orderDetails);
    }

}