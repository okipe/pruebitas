package com.qorikusi.cart.domain.mapper;

import com.qorikusi.cart.domain.model.dto.response.ProductoResponse;
import com.qorikusi.cart.domain.model.entity.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProductoMapper {

    Producto toProducto(ProductoResponse productoResponse, Integer idProducto);
}