package com.example.bugbuster.util;

import com.example.bugbuster.entity.BugReport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class ReportShareUtil {

    private final String baseUrl;

    // Use constructor injection with default value
    public ReportShareUtil(
            @Value("${app.base-url:http://localhost:8080}") String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String generateShareableLink(BugReport report) {
        String shareToken = UUID.randomUUID().toString();
        return baseUrl + "/shared/report/" + report.getReportId() + "?token=" + shareToken;
    }
}