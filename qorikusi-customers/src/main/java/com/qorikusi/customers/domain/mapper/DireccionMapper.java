package com.qorikusi.customers.domain.mapper;

import com.qorikusi.customers.domain.model.dto.request.DireccionRequest;
import com.qorikusi.customers.domain.model.dto.response.DireccionResponse;
import com.qorikusi.customers.domain.model.entity.Direccion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DireccionMapper {

    Direccion createDireccionFromRequest(DireccionRequest request, @MappingTarget Direccion direccion);

    void updateDireccionFromRequest(DireccionRequest request,
                                    @MappingTarget Direccion direccion);

    @Mapping(expression = "java(direccion.getCliente().getNombres() + \" \" + direccion.getCliente().getApellidos())",
            target = "cliente")
    @Mapping(source = "ubigeo.codigoUbigeo", target = "codigoUbigeo")
    @Mapping(source = "ubigeo.departamento", target = "departamento")
    @Mapping(source = "ubigeo.provincia", target = "provincia")
    @Mapping(source = "ubigeo.distrito", target = "distrito")
    DireccionResponse toDireccionResponse(Direccion direccion);

}