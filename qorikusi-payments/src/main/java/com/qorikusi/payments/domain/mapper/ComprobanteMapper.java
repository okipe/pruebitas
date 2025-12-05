package com.qorikusi.payments.domain.mapper;

import com.qorikusi.payments.domain.model.dto.response.ComprobanteResponse;
import com.qorikusi.payments.domain.model.entity.Boleta;
import com.qorikusi.payments.domain.model.entity.Comprobante;
import com.qorikusi.payments.domain.model.entity.Factura;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.SubclassMapping;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = PagoMapper.class)
public interface ComprobanteMapper {

    @SubclassMapping(source = Factura.class, target = ComprobanteResponse.class)
    @SubclassMapping(source = Boleta.class, target = ComprobanteResponse.class)
    ComprobanteResponse toComprobanteResponse(Comprobante comprobante);

}