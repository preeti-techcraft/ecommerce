package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.security.CustomUserDetails;
import com.ecommerce.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCartByUserId(userDetails.getUser().getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addProductToCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.addProductToCart(userDetails.getUser().getId(), productId, quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeProductFromCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeProductFromCart(userDetails.getUser().getId(), productId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        cartService.clearCart(userDetails.getUser().getId());
        return ResponseEntity.noContent().build();
    }
}
