package com.example.bugbuster.dto;

import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.ScanHistory;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Builder
@Getter
@Setter
public class ScanHistoryDTO {
    private Long historyID;
    private BugReport.ScanType scanType;
    private String urlScanned;
    private Integer bugFoundCount;
    private LocalDateTime timestamp;

    public static ScanHistoryDTO fromScanHistory(ScanHistory history) {
        return new ScanHistoryDTO(
                history.getHistoryId(),
                history.getScanType(),
                history.getUrlScanned(),
                history.getBugsFoundCount(),
                history.getScanTimestamp()
        );
    }
    // Add other fields you want to expose
}