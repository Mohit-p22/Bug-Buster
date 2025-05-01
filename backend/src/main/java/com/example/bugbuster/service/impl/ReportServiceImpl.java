package com.example.bugbuster.service.impl;

import com.example.bugbuster.dto.BugReportDTO;
import com.example.bugbuster.dto.response.ReportResponse;
import com.example.bugbuster.entity.*;
import com.example.bugbuster.exception.ResourceNotFoundException;
import com.example.bugbuster.repository.*;
import com.example.bugbuster.service.ReportService;
import com.example.bugbuster.util.PDFGenerator;
import com.example.bugbuster.util.ReportShareUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    @Autowired
    private final BugReportRepository bugReportRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final SavedReportRepository savedReportRepository;
    @Autowired
    private final PDFGenerator pdfGenerator;
    @Autowired
    private final ReportShareUtil reportShareUtil;

    @Override
    public ReportResponse getReportSummary(Long reportId) {
        BugReport report = bugReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        return ReportResponse.builder()
                .reportId(report.getReportId())
                .url(report.getUrlScanned())
                .scanType(report.getScanType().toString())
                .totalBugs(report.getTotalBugsFound())
                .scanDate(report.getScanTimestamp())
                .build();
    }


    @Override
    public Page<BugReportDTO> getReportByUser(String email, int page, int size) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Create page request with sorting
        Pageable pageable = PageRequest.of(page, size, Sort.by("scanTimestamp").descending());

        // Get paginated reports
        Page<BugReport> bugReports = bugReportRepository.findByUser(user, pageable);

        // Convert to DTO page
        return bugReports.map(this::convertToDto);
    }

    private BugReportDTO convertToDto(BugReport report) {
        return BugReportDTO.builder()
                .reportId(report.getReportId())
                .url(report.getUrlScanned())
                .scanType(report.getScanType().toString())
                .totalBugs(report.getTotalBugsFound())
                .timestamp(report.getScanTimestamp())
                .build();
    }

    @Override
    public String generatePdfReport(Long reportId) {
        BugReport report = bugReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return pdfGenerator.generateReportPDF(report);
    }

    @Override
    public String shareReport(Long reportId) {
        BugReport report = bugReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return reportShareUtil.generateShareableLink(report);
    }

    @Override
    @Transactional
    public void saveReport(Long reportId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        BugReport report = bugReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        if (savedReportRepository.existsByUserAndReport(user, report)) {
            throw new IllegalStateException("Report already saved");
        }

        SavedReport savedReport = new SavedReport();
        savedReport.setUser(user);
        savedReport.setReport(report);
        savedReport.getCreatedAt(LocalDateTime.now());
        savedReport.setReportName("Scan Report - " + report.getUrlScanned());

        savedReportRepository.save(savedReport);
    }

    @Override
    public Page<BugReportDTO> getUserReports(String email, int page, int size) {
        return null;
    }


}
