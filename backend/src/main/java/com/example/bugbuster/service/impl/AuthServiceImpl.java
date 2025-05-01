package com.example.bugbuster.service.impl;

import com.example.bugbuster.dto.request.LoginRequest;
import com.example.bugbuster.dto.request.RegisterRequest;
import com.example.bugbuster.dto.response.AuthResponse;
import com.example.bugbuster.entity.User;
import com.example.bugbuster.exception.CustomException;
import com.example.bugbuster.repository.UserRepository;
import com.example.bugbuster.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    // Remove: PasswordEncoder, JwtTokenProvider, AuthenticationManager

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email is already in use");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException("Username is already taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword()) // No more encoding
                .role(User.UserRole.USER)
                .build();

        userRepository.save(user);


        return AuthResponse.builder()
                .email(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("User not found"));

        if(!user.getPassword().equals(request.getPassword())) {
            throw new CustomException("Invalid credentials");
        }

        return AuthResponse.builder()
                .email(user.getEmail())
                .password(user.getPassword())
                .build();
    }




}