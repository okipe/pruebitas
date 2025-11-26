package com.qorikusi.products.domain.repository;

import com.qorikusi.products.domain.model.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}