package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Cart;

public interface CartService {
    Cart getCartByUserId(Long userId);
    Cart addProductToCart(Long userId, Long productId, Integer quantity);
    Cart removeProductFromCart(Long userId, Long productId);
    void clearCart(Long userId);
}
