package com.example.bugbuster.controller;

import com.example.bugbuster.dto.response.AdminStatsResponse;
import com.example.bugbuster.dto.response.ApiResponse;
import com.example.bugbuster.entity.Admin;
import com.example.bugbuster.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    @Autowired
    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createAdmin(@RequestBody Admin admin) {
        adminService.createAdmin(admin);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Admin created successfully")
                .build());
    }

    @PutMapping("/toggle-user/{userId}")
    public ResponseEntity<ApiResponse> toggleUserStatus(@PathVariable Long userId) {
        adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User status updated")
                .build());
    }

    @PutMapping("/verify-user/{userId}")
    public ResponseEntity<ApiResponse> verifyUserAccount(@PathVariable Long userId) {
        adminService.verifyUserAccount(userId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User account verified")
                .build());
    }
}
