package com.example.bugbuster.dto.response;

import com.example.bugbuster.dto.*;
import com.example.bugbuster.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanResponse {
    private BugReportDTO report;
    private List<FormBugDTO> formBugs;
    private List<LayoutBugDTO> layoutBugs;
    private List<NetworkBugDTO> networkBugs;
    private List<SecurityBugDTO> securityBugs;
    private List<LinkBugDTO> linkBugs;
}