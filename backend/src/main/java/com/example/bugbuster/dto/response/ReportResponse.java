package com.example.bugbuster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long reportId;
    private String url;
    private String scanType;
    private Integer totalBugs;
    private LocalDateTime scanDate;
}