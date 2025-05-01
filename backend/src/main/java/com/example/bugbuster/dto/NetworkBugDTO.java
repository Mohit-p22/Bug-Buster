package com.example.bugbuster.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
public class NetworkBugDTO {
    private Long networkBugId;
    private String description;
    private String elementType;
    private String severityLevel;
    // Add other fields you want to expose
}
