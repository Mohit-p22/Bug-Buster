package com.example.bugbuster.service;

import com.example.bugbuster.dto.response.AdminStatsResponse;
import com.example.bugbuster.entity.Admin;
import java.util.List;

public interface AdminService {
    AdminStatsResponse getSystemStats();
    List<Admin> getAllAdmins();
    void createAdmin(Admin admin);
    void toggleUserStatus(Long userId);
    void verifyUserAccount(Long userId);
}