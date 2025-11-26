package com.qorikusi.products.service.impl;

import com.qorikusi.products.domain.mapper.CategoriaMapper;
import com.qorikusi.products.domain.model.dto.response.CategoriaResponse;
import com.qorikusi.products.domain.repository.CategoriaRepository;
import com.qorikusi.products.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    @Override
    public List<CategoriaResponse> listarCategorias() {
        return categoriaMapper.toCategoriaResponse(categoriaRepository.findAll());
    }
}