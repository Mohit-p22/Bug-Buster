package com.example.bugbuster.repository;

import com.example.bugbuster.entity.ScanHistory;
import com.example.bugbuster.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanHistoryRepository extends JpaRepository<ScanHistory, Long> {
    Page<ScanHistory> findByUser(User user, Pageable pageable);

    @Query("SELECT sh FROM ScanHistory sh WHERE sh.user.email = :email ORDER BY sh.scanTimestamp DESC")
    List<ScanHistory> findByUserEmailOrderByScanTimestampDesc(@Param("email") String email);
}