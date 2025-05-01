package com.example.bugbuster.repository;

import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.SecurityBug;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface SecurityBugRepository extends JpaRepository<SecurityBug, Long> {
    Page<SecurityBug> findByReport_ReportId(Long reportId, Pageable pageable);
    List<SecurityBug> findByReport(BugReport report);
    List<SecurityBug> findByReportAndSeverityLevel(BugReport report, String severityLevel);
    List<SecurityBug> findByVulnerabilityType(String vulnerabilityType);
}