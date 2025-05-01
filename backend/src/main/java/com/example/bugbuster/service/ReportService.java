package com.example.bugbuster.service;

import com.example.bugbuster.dto.BugReportDTO;
import com.example.bugbuster.dto.response.ReportResponse;
import com.example.bugbuster.entity.BugReport;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ReportService {
    ReportResponse getReportSummary(Long reportId);

    Page<BugReportDTO> getReportByUser(String email, int page, int size);

    String generatePdfReport(Long reportId);
    String shareReport(Long reportId);
    void saveReport(Long reportId, String email);
    Page<BugReportDTO> getUserReports(String email, int page, int size);
}
