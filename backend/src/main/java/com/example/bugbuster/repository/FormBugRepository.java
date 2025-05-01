package com.example.bugbuster.repository;

import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.FormBug;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormBugRepository extends JpaRepository<FormBug, Long> {
    List<FormBug> findByReport(BugReport report);
    List<FormBug> findByReportAndSeverityLevel(BugReport report, String severityLevel);

    Page<FormBug> findByReport_ReportId(Long reportId, Pageable pageable);
}