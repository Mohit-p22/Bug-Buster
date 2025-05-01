package com.example.bugbuster.repository;

import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BugReportRepository extends JpaRepository<BugReport, Long> {
    Page<BugReport> findByUser(User user, Pageable pageable);
    List<BugReport> findByUrlScanned(String url);
    boolean existsByUrlScannedAndUser(String url, User user);
    long countByScanTimestampAfter(LocalDateTime date);
}