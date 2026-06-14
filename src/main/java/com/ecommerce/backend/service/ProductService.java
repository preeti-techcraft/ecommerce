package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductService {
    Page<Product> getProducts(String name, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    Product getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
}
