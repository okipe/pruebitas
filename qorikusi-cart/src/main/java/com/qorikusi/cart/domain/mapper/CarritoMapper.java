package com.qorikusi.cart.domain.mapper;

import com.qorikusi.cart.domain.model.dto.response.CarritoResponse;
import com.qorikusi.cart.domain.model.dto.response.DetalleCarritoResponse;
import com.qorikusi.cart.domain.model.entity.Carrito;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.math.BigDecimal;
import java.util.List;

@Mapper(uses = DetalleCarritoMapper.class, componentModel = MappingConstants.ComponentModel.SPRING)
public interface CarritoMapper {
    @Mapping(target = "detalles", source = "detalles")
    CarritoResponse toCarritoResponse(Carrito carrito, List<DetalleCarritoResponse> detalles, BigDecimal total);
}