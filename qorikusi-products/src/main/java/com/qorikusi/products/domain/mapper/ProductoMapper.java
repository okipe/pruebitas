package com.qorikusi.products.domain.mapper;

import com.qorikusi.products.domain.model.dto.request.ProductoRequest;
import com.qorikusi.products.domain.model.dto.response.CatalogoResponse;
import com.qorikusi.products.domain.model.dto.response.ProductoResponse;
import com.qorikusi.products.domain.model.entity.Categoria;
import com.qorikusi.products.domain.model.entity.Producto;
import com.qorikusi.products.domain.repository.CategoriaRepository;
import com.qorikusi.products.exception.CategoryNotFoundException;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductoMapper {

    @Mapping(source = "categoria.nombre", target = "categoria")
    @Mapping(target = "estado", expression = "java(producto.isEstado() ? \"Activo\" : \"Inactivo\")")
    ProductoResponse toProductoResponse(Producto producto);

    @Mapping(source = "categoria.nombre", target = "categoria")
    CatalogoResponse toCatalogoResponse(Producto producto);

    void updateProductoFromRequest(ProductoRequest request,
                                   @MappingTarget Producto producto,
                                   @Context CategoriaRepository categoriaRepository);

    @Mapping(target = "estado", expression = "java(true)")
    Producto createProductoFromRequest(ProductoRequest request,
                                       @Context CategoriaRepository categoriaRepository);

    default Categoria map(Integer categoriaId, @Context CategoriaRepository categoriaRepository) {
        if (categoriaId == null) return null;
        return categoriaRepository.findById(categoriaId).orElseThrow(CategoryNotFoundException::new);
    }
}