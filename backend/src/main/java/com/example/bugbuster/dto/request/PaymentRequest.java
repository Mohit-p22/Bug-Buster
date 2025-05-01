package com.example.bugbuster.dto.request;

import com.example.bugbuster.entity.Payment;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentRequest {
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Plan type is required")
    private Payment.PlanType planType;

    @Positive(message = "Amount must be positive")
    private double amount;
}
