package com.ecommerce.backend.service;

import com.ecommerce.backend.model.User;

public interface UserService {
    User registerUser(User user);
    User getUserByUsername(String username);
    User getUserById(Long id);
}
