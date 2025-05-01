package com.example.bugbuster.controller;


import com.example.bugbuster.dto.*;
import com.example.bugbuster.dto.response.ApiResponse;
import com.example.bugbuster.dto.response.ReportResponse;
import com.example.bugbuster.dto.response.ScanResponse;
import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.*;
import com.example.bugbuster.exception.ResourceNotFoundException;
import com.example.bugbuster.repository.*;
import com.example.bugbuster.service.ReportService;
import com.example.bugbuster.util.BugMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    @Autowired
    private final ReportService reportService;

    @Autowired
    private final BugReportRepository bugReportRepository;

    @Autowired
    private final FormBugRepository formBugRepository;
    @Autowired
    private final LayoutBugRepository layoutBugRepository;
    @Autowired
    private final NetworkBugRepository networkBugRepository;
    @Autowired
    private final LinkBugRepository linkBugRepository;
    @Autowired
    private final SecurityBugRepository securityBugRepository;


    @GetMapping("/{reportId}")
    public ResponseEntity<ScanResponse> getReport(@PathVariable Long reportId) {
        BugReport report = bugReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        return ResponseEntity.ok(ScanResponse.builder()
                .report(BugMapper.toReportDTO(report))
                .formBugs(formBugRepository.findByReport(report)
                        .stream()
                        .map(BugMapper::toFormBugDTO)
                        .toList())
                .layoutBugs(layoutBugRepository.findByReport(report)
                        .stream()
                        .map(BugMapper::toLayoutBugDTO)
                        .toList())
                .linkBugs(linkBugRepository.findByReport(report)
                        .stream()
                        .map(BugMapper::toLinkBugDTO)
                        .toList())
                .securityBugs(securityBugRepository.findByReport(report)
                        .stream()
                        .map(BugMapper::toSecurityBugDTO)
                        .toList())
                .networkBugs(networkBugRepository.findByReport(report)
                        .stream()
                        .map(BugMapper::toNetworkBugDTO)
                        .toList())
                .build());
    }

    private ScanResponse buildResponse(BugReportDTO report,
                                       List<FormBugDTO> formBugs,
                                       List<LayoutBugDTO> layoutBugs,
                                       List<NetworkBugDTO> networkBugs,
                                       List<SecurityBugDTO> securityBugs,
                                       List<LinkBugDTO> linkBugs) {
        return ScanResponse.builder()
                .report(report)
//                .url(report.getUrlScanned())
//                .scanType(report.getScanType().toString())
//                .totalBugs(report.getTotalBugsFound())
//                .timestamp(report.getScanTimestamp())
                .formBugs(formBugs)
                .layoutBugs(layoutBugs)
                .networkBugs(networkBugs)
                .securityBugs(securityBugs)
                .linkBugs(linkBugs)
                .build();
    }

    @GetMapping("/{reportId}/form-bugs")
    public ResponseEntity<Page<FormBug>> getFormBugs(
            @PathVariable Long reportId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                formBugRepository.findByReport_ReportId(reportId, pageable)
        );
    }

    @GetMapping("/{reportId}/layout-bugs")
    public ResponseEntity<Page<LayoutBug>> getLayoutBugs(
            @PathVariable Long reportId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                layoutBugRepository.findByReport_ReportId(reportId, pageable)
        );
    }
    @GetMapping("/{reportId}/link-bugs")
    public ResponseEntity<Page<LinkBug>> getLinkBugs(
            @PathVariable Long reportId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                linkBugRepository.findByReport_ReportId(reportId, pageable)
        );
    }
    @GetMapping("/{reportId}/security-bugs")
    public ResponseEntity<Page<SecurityBug>> getSecurityBugs(
            @PathVariable Long reportId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                securityBugRepository.findByReport_ReportId(reportId, pageable)
        );
    }
    @GetMapping("/{reportId}/network-bugs")
    public ResponseEntity<Page<NetworkBug>> getNetworkBugs(
            @PathVariable Long reportId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                networkBugRepository.findByReport_ReportId(reportId, pageable)
        );
    }

    @GetMapping("/user")
    public ResponseEntity<Page<BugReportDTO>> getUserReports(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reportService.getUserReports(email, page, size));
    }

    @GetMapping("/{reportId}/download")
    public ResponseEntity<ApiResponse> downloadReport(@PathVariable Long reportId) {
        String filePath = reportService.generatePdfReport(reportId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("PDF report generated")
                .data(filePath)
                .build());
    }

    @PostMapping("/{reportId}/share")
    public ResponseEntity<ApiResponse> shareReport(@PathVariable Long reportId) {
        String shareLink = reportService.shareReport(reportId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Shareable link created")
                .data(shareLink)
                .build());
    }

    @PostMapping("/{reportId}/save")
    public ResponseEntity<ApiResponse> saveReport(
            @PathVariable Long reportId,
            @RequestParam String email) {
        reportService.saveReport(reportId, email);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Report saved successfully")
                .build());
    }
}
