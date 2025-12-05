package com.qorikusi.orders.service.impl;

import com.qorikusi.orders.domain.model.dto.request.ActualizarPedidoRequest;
import com.qorikusi.orders.domain.model.dto.response.*;
import com.qorikusi.orders.domain.model.entity.Cliente;
import com.qorikusi.orders.domain.model.entity.DetallePedido;
import com.qorikusi.orders.domain.model.entity.Pedido;
import com.qorikusi.orders.domain.model.entity.Producto;
import com.qorikusi.orders.domain.repository.PedidoRepository;
import com.qorikusi.orders.exception.AccessDeniedException;
import com.qorikusi.orders.exception.OrderNotFoundException;
import com.qorikusi.orders.service.CarritoService;
import com.qorikusi.orders.service.ClienteService;
import com.qorikusi.orders.service.PedidoService;
import com.qorikusi.orders.service.ProductoService;
import com.qorikusi.orders.util.Constants;
import com.qorikusi.orders.util.Utility;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CarritoService cartServiceClient;
    private final ClienteService clienteService;
    private final ProductoService productoService;

    @Override
    @Transactional
    public ResumenPedidoResponse crearPedido(String token, UUID cartId) {
        // 1. Get User
        Cliente cliente = clienteService.obtenerDatos(token);

        // 2. Call Cart Service
        CarritoResponse cart = cartServiceClient.getCartById(cartId);

        // 3. Validate Products (existence, state, and stock)
        Map<UUID, Producto> productsMap = productoService.buscarYValidarProductos(cart.detalles());

        // 4. Build Order
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setTotal(cart.total());
        pedido.setEstado(Constants.PAGO_PENDIENTE);
        pedido.setFechaPedido(LocalDateTime.now());

        List<DetallePedido> details = cart.detalles().stream().map(cartDetail -> {
            Producto product = productsMap.get(cartDetail.uuidProducto());
            ProductoResponse productoDto = productoService.obtenerProductoResponsePorUuid(cartDetail.uuidProducto());
            DetallePedido detail = new DetallePedido();
            detail.setPedido(pedido);
            detail.setProducto(product);
            detail.setCantidad(cartDetail.cantidad());
            detail.setSubtotal(productoDto.precio().multiply(new java.math.BigDecimal(cartDetail.cantidad())));
            return detail;
        }).toList();
        pedido.setDetalles(details);

        // 5. Save and return
        Pedido savedPedido = pedidoRepository.save(pedido);

        return new ResumenPedidoResponse(
                savedPedido.getUuidPedido(),
                Utility.generarCodigoPedido(savedPedido.getFechaPedido()),
                savedPedido.getEstado(),
                savedPedido.getTotal(),
                savedPedido.getTipoEnvio(),
                savedPedido.getFechaPedido()
        );
    }

    @Override
    public List<PedidoResponse> listarPedidos(String token) {

        Cliente cliente = clienteService.obtenerDatos(token);

        return pedidoRepository.findAllByCliente_UuidClienteOrderByFechaPedidoDesc(cliente.getUuidCliente())
                .orElseThrow(OrderNotFoundException::new).stream()
                .map(pedido -> {
                    Pair<Pair<ClienteResponse, String>, List<PedidoResponse.DetallePedidoResponse>> dto =
                            mapearPedidoDto(pedido);
                    return new PedidoResponse(pedido.getUuidPedido(), dto.getLeft().getRight(), pedido.getEstado(),
                            pedido.getTotal(), pedido.getTipoEnvio(), pedido.getFechaPedido(), dto.getLeft().getLeft(),
                            dto.getRight());
                }).toList();
    }

    @Override
    public List<ResumenPedidoResponse> listarPedidosAdmin() {
        Collection<String> estados = List.of(Constants.PEDIDO_CANCELADO,
                Constants.PEDIDO_RECHAZADO, Constants.PEDIDO_ENTREGADO);
        return pedidoRepository.findByEstadoNotIn(estados)
                .orElseThrow(OrderNotFoundException::new).stream()
                .map(pedido ->
                    new ResumenPedidoResponse(
                            pedido.getUuidPedido(),
                            Utility.generarCodigoPedido(pedido.getFechaPedido()),
                            pedido.getEstado(),
                            pedido.getTotal(),
                            pedido.getTipoEnvio(),
                            pedido.getFechaPedido()
                    )).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoResponse obtenerPedido(String token, UUID uuidPedido) {
        // 1. Get User
        Cliente cliente = clienteService.obtenerDatos(token);

        // 2. Find Order by UUID
        Pedido pedido = pedidoRepository.findByUuidPedido(uuidPedido)
                .orElseThrow(OrderNotFoundException::new);

        // 3. Validate that the user is the owner of the order
        if (!pedido.getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException();
        }

        // 4. Map to DTO
        Pair<Pair<ClienteResponse, String>, List<PedidoResponse.DetallePedidoResponse>> pedidoDto =
                mapearPedidoDto(pedido);
        return new PedidoResponse(pedido.getUuidPedido(), pedidoDto.getLeft().getRight(), pedido.getEstado(),
                pedido.getTotal(), pedido.getTipoEnvio(), pedido.getFechaPedido(), pedidoDto.getLeft().getLeft(),
                pedidoDto.getRight());
    }

    @Override
    @Transactional
    public ResumenPedidoResponse actualizarPedido(String uuidPedido, ActualizarPedidoRequest request) {
        Pedido pedido = pedidoRepository.findByUuidPedido(UUID.fromString(uuidPedido))
                .orElseThrow(OrderNotFoundException::new);

        pedido.setEstado(request.nuevoEstado().getValue());

        Pedido savedPedido = pedidoRepository.save(pedido);

        return new ResumenPedidoResponse(
                savedPedido.getUuidPedido(),
                Utility.generarCodigoPedido(savedPedido.getFechaPedido()),
                savedPedido.getEstado(),
                savedPedido.getTotal(),
                savedPedido.getTipoEnvio(),
                savedPedido.getFechaPedido()
        );
    }
    
    private Pair<Pair<ClienteResponse, String>, List<PedidoResponse.DetallePedidoResponse>> mapearPedidoDto(
            Pedido pedido){
        ClienteResponse clienteResponse = new ClienteResponse(pedido.getCliente().getUuidCliente());
        String codigoPedido = Utility.generarCodigoPedido(pedido.getFechaPedido());
        List<PedidoResponse.DetallePedidoResponse> productos = pedido.getDetalles().stream()
                .map(detalle -> {
                    ProductoResponse producto = productoService
                            .obtenerProductoResponsePorUuid(detalle.getProducto().getUuidProducto());
                    return new PedidoResponse.DetallePedidoResponse(
                            detalle.getProducto().getUuidProducto(),
                            producto.categoria(),
                            producto.nombre(),
                            producto.precio(),
                            detalle.getCantidad(),
                            detalle.getSubtotal());
                }).toList();
        
        return Pair.of(Pair.of(clienteResponse, codigoPedido), productos);
    }
}