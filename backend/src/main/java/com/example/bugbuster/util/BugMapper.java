package com.example.bugbuster.util;

import com.example.bugbuster.dto.*;
import com.example.bugbuster.entity.*;

public class BugMapper {
    public static BugReportDTO toReportDTO(BugReport report) {
        return BugReportDTO.builder()
                .reportId(report.getReportId())
                .url(report.getUrlScanned())
                .scanType(report.getScanType().toString())
                .totalBugs(report.getTotalBugsFound())
                .timestamp(report.getScanTimestamp())
                .build();
    }

    public static FormBugDTO toFormBugDTO(FormBug bug) {
        return FormBugDTO.builder()
                .formBugId(bug.getFormBugId())
                .description(bug.getDescription())
                .elementType(bug.getElementType())
                .severityLevel(String.valueOf(bug.getSeverityLevel()))
                .build();
    }
    public static LayoutBugDTO toLayoutBugDTO(LayoutBug bug) {
        return LayoutBugDTO.builder()
                .layoutBugId(bug.getLayoutBugId())
                .description(bug.getDescription())
                .elementType(bug.getElementType())
                .severityLevel(String.valueOf(bug.getSeverityLevel()))
                .build();
    }
    public static LinkBugDTO toLinkBugDTO(LinkBug bug) {
        return LinkBugDTO.builder()
                .linkBugId(bug.getLinkBugId())
                .description(bug.getDescription())
                .elementType(bug.getElementType())
                .severityLevel(String.valueOf(bug.getSeverityLevel()))
                .build();
    }
    public static SecurityBugDTO toSecurityBugDTO(SecurityBug bug) {
        return SecurityBugDTO.builder()
                .securityBugId(bug.getSecurityBugId())
                .description(bug.getDescription())
                .elementType(bug.getElementType())
                .severityLevel(String.valueOf(bug.getSeverityLevel()))
                .build();
    }
    public static NetworkBugDTO toNetworkBugDTO(NetworkBug bug) {
        return NetworkBugDTO.builder()
                .networkBugId(bug.getNetworkBugId())
                .description(bug.getDescription())
                .elementType(bug.getElementType())
                .severityLevel(String.valueOf(bug.getSeverityLevel()))
                .build();
    }


}
