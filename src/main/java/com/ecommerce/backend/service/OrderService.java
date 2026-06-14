package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Order;
import java.util.List;

public interface OrderService {
    Order checkoutCart(Long userId);
    List<Order> getOrderHistory(Long userId);
    List<Order> getAllOrders();
    Order updateOrderStatus(Long orderId, com.ecommerce.backend.model.OrderStatus status);
}
