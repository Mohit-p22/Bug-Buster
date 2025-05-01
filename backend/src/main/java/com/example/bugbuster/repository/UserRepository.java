package com.example.bugbuster.repository;


import com.example.bugbuster.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = {"scanHistories"})
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    long countByIsVerified(boolean isVerified);
    long countByIsPremium(boolean isPremium);
    @Modifying
    @Query("UPDATE User u SET u.scanLimit = 5 WHERE u.scanLimit IS NULL")
    void initializeNullScanLimits();
}