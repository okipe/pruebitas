package com.qorikusi.customers.domain.mapper;

import com.qorikusi.customers.domain.model.dto.request.UpdateClientDataRequest;
import com.qorikusi.customers.domain.model.dto.response.RetrieveClientDataResponse;
import com.qorikusi.customers.domain.model.dto.response.UpdateClientDataResponse;
import com.qorikusi.customers.domain.model.entity.Cliente;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ClienteMapper {

    @Mapping(source = "puntos", target = "puntosFidelidad")
    void updateClienteFromRequest(UpdateClientDataRequest request, @MappingTarget Cliente cliente);

    @Mapping(source = "puntosFidelidad", target = "puntos")
    UpdateClientDataResponse toUpdateClientDataResponse(Cliente cliente);

    @Mapping(source = "puntosFidelidad", target = "puntos")
    RetrieveClientDataResponse toRetrieveClientDataResponse(Cliente cliente);
}