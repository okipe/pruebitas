package com.qorikusi.products.service;

import com.qorikusi.products.domain.model.dto.response.CategoriaResponse;

import java.util.List;

public interface CategoriaService {
    List<CategoriaResponse> listarCategorias();
}