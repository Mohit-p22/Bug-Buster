package com.example.bugbuster.service;

import com.example.bugbuster.dto.request.LoginRequest;
import com.example.bugbuster.dto.request.RegisterRequest;
import com.example.bugbuster.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

}
