package com.example.bugbuster.entity;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long savedReportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private BugReport report;


    private String reportName;

    @Column(updatable = false)
    private LocalDateTime createdAt; // Add this if you want createdAt

    private LocalDateTime updatedAt;

    public void getCreatedAt(LocalDateTime now) {
    }
}