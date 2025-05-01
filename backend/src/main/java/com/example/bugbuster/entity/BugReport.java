package com.example.bugbuster.entity;


import com.example.bugbuster.dto.BugReportDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bug_reports")
@Data
public class BugReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")  // Explicit column name
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-bugreports")
    private User user;

    @Column(nullable = false)
    private String urlScanned;

    private LocalDateTime scanTimestamp;

    private Integer totalBugsFound;

    @Enumerated(EnumType.STRING)
    private ScanType scanType;

    @Column(updatable = false)
    private LocalDateTime createdAt; // Add this if you want createdAt

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<FormBug> formBugs;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<LayoutBug> layoutBugs;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<NetworkBug> networkBugs;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<SecurityBug> securityBugs;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<LinkBug> linkBugs;

    public enum ScanType {
        FULL_SCAN, FORM, LAYOUT, NETWORK, SECURITY, LINKS
    }
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        scanTimestamp = LocalDateTime.now(); // Or set separately
    }

}
