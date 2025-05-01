package com.example.bugbuster.repository;

import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.NetworkBug;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface NetworkBugRepository extends JpaRepository<NetworkBug, Long> {
    Page<NetworkBug> findByReport_ReportId(Long reportId, Pageable pageable);
    List<NetworkBug> findByReport(BugReport report);
    List<NetworkBug> findByReportAndSeverityLevel(BugReport report, String severityLevel);
    List<NetworkBug> findByHttpStatus(Integer httpStatus);


}