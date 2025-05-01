package com.example.bugbuster.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BugReportDTO {
    private Long reportId;
    private String url;
    private String scanType;
    private Integer totalBugs;
    private LocalDateTime timestamp;
}


