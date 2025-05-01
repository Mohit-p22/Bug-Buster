package com.example.bugbuster.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "security_bugs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecurityBug {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long securityBugId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    @JsonIgnore
    private BugReport report;

    @Column(name = "element_type", length = 50, nullable = false)
    @Builder.Default
    private String elementType = "unknown";

    @Column(name = "element_identifier", length = 100)
    @Builder.Default
    private String elementIdentifier = "none";

    @Column(length = 1000, nullable = false)
    @Builder.Default
    private String description = "No description provided";

    @Column(name = "vulnerability_type")
    private String vulnerabilityType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SeverityLevel severityLevel = SeverityLevel.MEDIUM;

    @Column(name = "screenshot_path", length = 255)
    private String screenshotPath;

    @Column(name = "html_snippet", length = 2000)
    @Builder.Default
    private String htmlSnippet = "No HTML snippet available";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    public enum SeverityLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    // Custom builder with validation
    public static SecurityBugBuilder builder() {
        return new CustomSecurityBugBuilder();
    }

    private static class CustomSecurityBugBuilder extends SecurityBugBuilder {
        @Override
        public SecurityBug build() {
            SecurityBug securityBug = super.build();

            // Ensure required fields have values
            if (securityBug.getElementType() == null) {
                securityBug.setElementType("unknown");
            }
            if (securityBug.getDescription() == null) {
                securityBug.setDescription("No description provided");
            }
            if (securityBug.getSeverityLevel() == null) {
                securityBug.setSeverityLevel(SeverityLevel.MEDIUM);
            }
            if (securityBug.getHtmlSnippet() == null) {
                securityBug.setHtmlSnippet("No HTML snippet available");
            }
            if (securityBug.getIsActive() == null) {
                securityBug.setIsActive(true);
            }

            return securityBug;
        }
    }

    // Helper method to truncate fields to their max lengths
    public void validateAndTruncateFields() {
        if (elementType != null && elementType.length() > 50) {
            elementType = elementType.substring(0, 50);
        }
        if (elementIdentifier != null && elementIdentifier.length() > 100) {
            elementIdentifier = elementIdentifier.substring(0, 100);
        }
        if (description != null && description.length() > 1000) {
            description = description.substring(0, 1000);
        }
        if (htmlSnippet != null && htmlSnippet.length() > 2000) {
            htmlSnippet = htmlSnippet.substring(0, 2000);
        }
        if (screenshotPath != null && screenshotPath.length() > 255) {
            screenshotPath = screenshotPath.substring(0, 255);
        }
    }

    // Pre-persist and pre-update hooks
    @PrePersist
    @PreUpdate
    private void beforeSave() {
        validateAndTruncateFields();

        // Set defaults if still null (extra protection)
        if (elementType == null) elementType = "unknown";
        if (description == null) description = "No description provided";
        if (severityLevel == null) severityLevel = SecurityBug.SeverityLevel.MEDIUM;
        if (htmlSnippet == null) htmlSnippet = "No HTML snippet available";
        if (isActive == null) isActive = true;
    }


}