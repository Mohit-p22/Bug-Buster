package com.example.bugbuster.dto;


import com.example.bugbuster.entity.ScanHistory;
import com.example.bugbuster.entity.User;
import com.example.bugbuster.entity.User.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {

    private Long userId;
    private String username;
    private String email;
    private UserRole role;
    private Integer scanLimit;


    // Paginated collections
    private List<BugReportSummaryDTO> bugReports;

    private List<ScanHistoryDTO> scanHistories;

    // Pagination metadata
    private int currentPage;
    private int totalPages;
    private long totalItems;

    public UserProfileDTO(Long userId, String username, String email, Integer scanLimit, List<BugReportSummaryDTO> list, List<ScanHistoryDTO> list1) {
    }


    public static UserProfileDTO fromUser(User user) {
        return new UserProfileDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getScanLimit(),
                user.getBugReports().stream().map(BugReportSummaryDTO::fromBugReport).toList(),
                user.getScanHistories().stream().map(ScanHistoryDTO::fromScanHistory).toList()
        );
    }



}