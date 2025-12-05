package com.qorikusi.payments.domain.mapper;

import com.qorikusi.payments.domain.model.dto.request.PagoRequest;
import com.qorikusi.payments.domain.model.dto.response.PagoResponse;
import com.qorikusi.payments.domain.model.entity.Pago;
import com.qorikusi.payments.domain.model.entity.Pedido;
import com.qorikusi.payments.domain.model.enums.EstadoPago;
import com.qorikusi.payments.domain.model.enums.MetodoPago;
import com.qorikusi.payments.util.Utility;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        imports = {EstadoPago.class, MetodoPago.class, Utility.class})
public interface PagoMapper {

    @Mapping(target = "metodoPago", source = "pagoRequest.metodoPago.value")
    @Mapping(target = "estadoPago", expression = "java(EstadoPago.PENDIENTE.getValue())")
    @Mapping(target = "fechaPago", expression = "java(LocalDateTime.now())")
    @Mapping(target = "numeroOperacion", expression = "java(Utility.generarNumeroOperacion())")
    Pago toPago(PagoRequest pagoRequest, Pedido pedido);

    @Mapping(source = "pedido.uuidPedido", target = "uuidPedido")
    PagoResponse toPagoResponse(Pago pago);
}