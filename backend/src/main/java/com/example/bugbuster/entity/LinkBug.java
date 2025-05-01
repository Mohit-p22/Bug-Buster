package com.example.bugbuster.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.dockerjava.api.model.Link;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "link_bugs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkBug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long linkBugId;

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

    @Column(name = "http_status")
    private Integer httpStatus;

    @Column(length = 1000, nullable = false)
    @Builder.Default
    private String description = "No description provided";

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
    public static LinkBugBuilder builder() {
        return new CustomLinkBugBuilder();
    }

    private static class CustomLinkBugBuilder extends LinkBugBuilder {
        @Override
        public LinkBug build() {
            LinkBug linkBug = super.build();

            // Ensure required fields have values
            if (linkBug.getElementType() == null) {
                linkBug.setElementType("unknown");
            }
            if (linkBug.getDescription() == null) {
                linkBug.setDescription("No description provided");
            }
            if (linkBug.getSeverityLevel() == null) {
                linkBug.setSeverityLevel(SeverityLevel.MEDIUM);
            }
            if (linkBug.getHtmlSnippet() == null) {
                linkBug.setHtmlSnippet("No HTML snippet available");
            }
            if (linkBug.getIsActive() == null) {
                linkBug.setIsActive(true);
            }

            return linkBug;
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
        if (severityLevel == null) severityLevel = LinkBug.SeverityLevel.MEDIUM;
        if (htmlSnippet == null) htmlSnippet = "No HTML snippet available";
        if (isActive == null) isActive = true;
    }
}