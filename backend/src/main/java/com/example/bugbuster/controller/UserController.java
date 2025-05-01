package com.example.bugbuster.controller;

import com.example.bugbuster.dto.UserProfileDTO;
import com.example.bugbuster.dto.request.UserRequest;
import com.example.bugbuster.dto.response.ApiResponse;
import com.example.bugbuster.dto.response.UserResponse;
import com.example.bugbuster.entity.ScanHistory;
import com.example.bugbuster.entity.User;
import com.example.bugbuster.exception.ResourceNotFoundException;
import com.example.bugbuster.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;


    @GetMapping("/scan-limit")
    public ResponseEntity<ApiResponse> getScanLimit(
            @RequestParam @Email(message = "Invalid email format") String email) {
        try {
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email is required")
                );
            }

            int scanLimit = userService.getScanLimit(email);
            return ResponseEntity.ok(
                    ApiResponse.success("Scan limit retrieved successfully", scanLimit)
            );

        } catch (ResourceNotFoundException ex) {
            log.warn("User not found for email: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error("User with email " + email + " not found")
            );
        } catch (Exception ex) {
            log.error("Error fetching scan limit for {}: {}", email, ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("An error occurred while fetching scan limit")
            );
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getUserProfile(@Valid UserRequest request) {
        UserResponse profile = userService.getUserProfile(request.getEmail());
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("User profile retrieved successfully")
                        .data(profile)
                        .build()
        );
    }



    @PutMapping("/scan-limit")
    public ResponseEntity<ApiResponse> updateScanLimit(
            @RequestParam @Email(message = "Invalid email format") String email,
            @RequestParam @Min(0) int newLimit) {
        try {
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email is required")
                );
            }

            userService.updateScanLimit(email, newLimit);
            return ResponseEntity.ok(
                    ApiResponse.success("Scan limit updated successfully", null)
            );

        } catch (ResourceNotFoundException ex) {
            log.warn("User not found: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error("User with email " + email + " not found")
            );
        } catch (Exception ex) {
            log.error("Error updating scan limit for {}: {}", email, ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("An error occurred while updating scan limit")
            );
        }
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteAccount(
            @RequestParam @Email(message = "Invalid email format") String email) {
        try {
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email is required")
                );
            }

            userService.deleteUserAccount(email);
            return ResponseEntity.ok(
                    ApiResponse.success("Account deleted successfully", null)
            );

        } catch (ResourceNotFoundException ex) {
            log.warn("User not found: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error("User with email " + email + " not found")
            );
        } catch (Exception ex) {
            log.error("Error deleting account for {}: {}", email, ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("An error occurred while deleting account")
            );
        }
    }
}