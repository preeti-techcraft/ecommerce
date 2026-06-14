package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.security.CustomUserDetails;
import com.ecommerce.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.checkoutCart(userDetails.getUser().getId()));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrderHistory(userDetails.getUser().getId()));
    }
}
