package com.example.bugbuster.service.impl;

import com.example.bugbuster.dto.response.AdminStatsResponse;
import com.example.bugbuster.entity.Admin;
import com.example.bugbuster.entity.User;
import com.example.bugbuster.exception.CustomException;
import com.example.bugbuster.repository.AdminRepository;
import com.example.bugbuster.repository.BugReportRepository;
import com.example.bugbuster.repository.PaymentRepository;
import com.example.bugbuster.repository.UserRepository;
import com.example.bugbuster.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    @Autowired
    private final AdminRepository adminRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final BugReportRepository bugReportRepository;
    @Autowired
    private final PaymentRepository paymentRepository;


    @Override
    public AdminStatsResponse getSystemStats() {
        long totalUsers = userRepository.count();
        long totalReports = bugReportRepository.count();
        long totalPayments = paymentRepository.count();
        double totalRevenue = paymentRepository.sumCompletedPayments();

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(userRepository.countByIsVerified(true))
                .premiumUsers(userRepository.countByIsPremium(true))
                .totalReports(totalReports)
                .scansToday(bugReportRepository.countByScanTimestampAfter(
                        LocalDateTime.now().minusDays(1)))
                .totalPayments(totalPayments)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public void createAdmin(Admin admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new CustomException("Admin email already exists");
        }
        admin.setPassword(admin.getPassword());
        adminRepository.save(admin);
    }

    @Override
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));
        user.setVerified(!user.isVerified());
        userRepository.save(user);
    }

    @Override
    public void verifyUserAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));
        user.setVerified(true);
        userRepository.save(user);
    }
}