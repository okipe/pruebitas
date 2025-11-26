package com.qorikusi.products.domain.mapper;

import com.qorikusi.products.domain.model.dto.response.CategoriaResponse;
import com.qorikusi.products.domain.model.entity.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoriaMapper {
    List<CategoriaResponse> toCategoriaResponse(List<Categoria> categoria);
}