package com.example.bugbuster.repository;

import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.LinkBug;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface LinkBugRepository extends JpaRepository<LinkBug, Long> {
    Page<LinkBug> findByReport_ReportId(Long reportId, Pageable pageable);
    List<LinkBug> findByReport(BugReport report);
    List<LinkBug> findByReportAndSeverityLevel(BugReport report, String severityLevel);
    List<LinkBug> findByHttpStatus(Integer httpStatus);
}