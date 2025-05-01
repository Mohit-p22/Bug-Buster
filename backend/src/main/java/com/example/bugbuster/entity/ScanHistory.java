package com.example.bugbuster.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "scan_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore // Prevent user serialization in history
    private User user;

    private String urlScanned;

    @Enumerated(EnumType.STRING)
    private BugReport.ScanType scanType;

    private LocalDateTime scanTimestamp;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer bugsFoundCount;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (scanTimestamp == null) {
            scanTimestamp = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}