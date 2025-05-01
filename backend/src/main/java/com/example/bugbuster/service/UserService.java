package com.example.bugbuster.service;


import com.example.bugbuster.dto.request.UserRequest;
import com.example.bugbuster.dto.response.UserResponse;
import jakarta.validation.constraints.NotNull;

public interface UserService {
     UserResponse getUserProfile(@NotNull(message = "User email is required") String request);

    void updateScanLimit(String email, int newLimit);
    void deleteUserAccount(String email);

     int getScanLimit(String email);
}
