package com.example.bugbuster.dto;

import com.example.bugbuster.entity.BugReport;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class BugReportSummaryDTO {
    private Long reportId;
    private String urlScanned;
    private LocalDateTime scanTimestamp;
    private Integer totalBugsFound;



    public static BugReportSummaryDTO fromBugReport(BugReport report) {
        return new BugReportSummaryDTO(
                report.getReportId(),
                report.getUrlScanned(),
                report.getScanTimestamp(),
                report.getTotalBugsFound()
        );
    }
}
