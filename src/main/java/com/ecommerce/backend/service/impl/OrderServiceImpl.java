package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.model.OrderItem;
import com.ecommerce.backend.model.OrderStatus;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.service.CartService;
import com.ecommerce.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public Order checkoutCart(Long userId) {
        Cart cart = cartService.getCartByUserId(userId);

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = Order.builder()
                .user(cart.getUser())
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .build();

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            
            // Check stock
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalStateException("Not enough stock for product: " + product.getName());
            }
            
            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        // Calculate total
        BigDecimal total = orderItems.stream()
                .map(item -> item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // Clear the cart
        cartService.clearCart(userId);

        return savedOrder;
    }

    @Override
    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findByUser_Id(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
