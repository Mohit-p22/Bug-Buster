package com.example.bugbuster.repository;

import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.LayoutBug;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LayoutBugRepository extends JpaRepository<LayoutBug, Long> {
    Page<LayoutBug> findByReport_ReportId(Long reportId, Pageable pageable);
    List<LayoutBug> findByReport(BugReport report);
    List<LayoutBug> findByReportAndSeverityLevel(BugReport report, String severityLevel);
}