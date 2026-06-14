package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.AuthRequest;
import com.ecommerce.backend.dto.AuthResponse;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.security.CustomUserDetails;
import com.ecommerce.backend.security.JwtUtils;
import com.ecommerce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest registerRequest) {
        com.ecommerce.backend.model.Role userRole = com.ecommerce.backend.model.Role.USER;
        if ("ADMIN".equalsIgnoreCase(registerRequest.getRole())) {
            userRole = com.ecommerce.backend.model.Role.ADMIN;
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(userRole)
                .build();

        return ResponseEntity.ok(userService.registerUser(user));
    }
}
