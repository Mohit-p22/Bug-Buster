package com.example.bugbuster.service;

import com.example.bugbuster.dto.request.PaymentRequest;
import com.example.bugbuster.entity.Payment;

import java.util.List;

public interface PaymentService {
    Payment processPayment(PaymentRequest request);
    boolean verifyPayment(String transactionId);
    List<Payment> getUserPayments(String email);
}