package com.example.bugbuster.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScanRequest {
    @NotBlank(message = "URL is required")
    private String url;

    @NotNull(message = "User email is required")
    private String email;
}