package com.qorikusi.cart.domain.mapper;

import com.qorikusi.cart.domain.model.dto.response.DetalleCarritoResponse;
import com.qorikusi.cart.domain.model.entity.DetalleCarrito;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface DetalleCarritoMapper {

    @Mapping(source = "producto.uuidProducto", target = "uuidProducto")
    DetalleCarritoResponse toDetalleCarritoResponse(DetalleCarrito detalleCarrito);
}