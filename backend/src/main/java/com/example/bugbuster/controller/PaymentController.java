package com.example.bugbuster.controller;

import com.example.bugbuster.dto.request.PaymentRequest;
import com.example.bugbuster.dto.response.ApiResponse;
import com.example.bugbuster.entity.Payment;
import com.example.bugbuster.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class PaymentController {

    @Autowired
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> processPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyPayment(@RequestParam String transactionId) {
        boolean verified = paymentService.verifyPayment(transactionId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(verified)
                .message(verified ? "Payment verified" : "Payment verification failed")
                .build());
    }

    @GetMapping("/user")
    public ResponseEntity<List<Payment>> getUserPayments(@RequestParam String email) {
        return ResponseEntity.ok(paymentService.getUserPayments(email));
    }
}
