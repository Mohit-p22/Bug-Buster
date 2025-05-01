package com.example.bugbuster.repository;

import com.example.bugbuster.entity.Payment;
import com.example.bugbuster.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.lang.ScopedValue;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);
    boolean existsByUserAndPlanTypeAndPaymentStatus(User user, Payment.PlanType planType, Payment.PaymentStatus status);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'COMPLETED'")
    Double sumCompletedPayments();

    <T> ScopedValue<T> findByTransactionId(String transactionId);
}
