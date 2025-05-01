package com.example.bugbuster.dto;


import com.example.bugbuster.entity.SavedReport;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@AllArgsConstructor
@Data
@NoArgsConstructor
public class SavedReportSummaryDTO {
    private Long savedReportId;
    private String reportName;
    private LocalDateTime savedAt;


    public static SavedReportSummaryDTO fromSavedReport(SavedReport report) {
        return new SavedReportSummaryDTO(
                report.getSavedReportId(),
                report.getReportName(),
                report.getCreatedAt()
        );
    }
}
