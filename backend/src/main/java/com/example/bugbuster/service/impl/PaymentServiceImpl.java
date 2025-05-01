package com.example.bugbuster.service.impl;

import com.example.bugbuster.dto.request.PaymentRequest;
import com.example.bugbuster.entity.Payment;
import com.example.bugbuster.entity.User;
import com.example.bugbuster.exception.CustomException;
import com.example.bugbuster.exception.ResourceNotFoundException;
import com.example.bugbuster.repository.PaymentRepository;
import com.example.bugbuster.repository.UserRepository;
import com.example.bugbuster.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private final PaymentRepository paymentRepository;
    @Autowired
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Payment processPayment(PaymentRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (paymentRepository.existsByUserAndPlanTypeAndPaymentStatus(
                user, request.getPlanType(), Payment.PaymentStatus.COMPLETED)) {
            throw new CustomException("User already has an active plan");
        }

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setAmount(request.getAmount());
        payment.setPlanType(request.getPlanType());
        payment.setPaymentStatus(Payment.PaymentStatus.PENDING);
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());

        // In production, integrate with payment gateway here
        // For demo, we'll auto-complete the payment
        payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED);
        updateUserPremiumStatus(user, request.getPlanType());

        return paymentRepository.save(payment);
    }

    @Override
    public boolean verifyPayment(String transactionId) {
        Payment payment = (Payment) paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        // In production, verify with payment gateway
        if (payment.getPaymentStatus() != Payment.PaymentStatus.COMPLETED) {
            payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED);
            paymentRepository.save(payment);
            updateUserPremiumStatus(payment.getUser(), payment.getPlanType());
        }

        return true;
    }

    @Override
    public List<Payment> getUserPayments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return paymentRepository.findByUser(user);
    }

    private void updateUserPremiumStatus(User user, Payment.PlanType planType) {
        user.setPremium(true);
        user.setScanLimit(Integer.MAX_VALUE); // Unlimited scans for premium users

        // Set expiry date based on plan type
        switch (planType) {
            case MONTHLY -> user.setPremiumExpiry(LocalDateTime.now().plusMonths(1));
            case QUARTERLY -> user.setPremiumExpiry(LocalDateTime.now().plusMonths(3));
            case YEARLY -> user.setPremiumExpiry(LocalDateTime.now().plusYears(1));
        }

        userRepository.save(user);
    }
}