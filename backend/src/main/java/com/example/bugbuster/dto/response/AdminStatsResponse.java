package com.example.bugbuster.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private Long totalUsers;
    private Long activeUsers;
    private Long premiumUsers;
    private Long totalReports;
    private Long scansToday;
    private Long totalPayments;
    private Double totalRevenue;
}
