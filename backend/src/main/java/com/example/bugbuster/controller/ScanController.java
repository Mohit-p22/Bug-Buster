package com.example.bugbuster.controller;

import com.example.bugbuster.dto.request.ScanRequest;
import com.example.bugbuster.dto.response.ApiResponse;
import com.example.bugbuster.dto.response.ScanResponse;
import com.example.bugbuster.entity.User;
import com.example.bugbuster.exception.ResourceNotFoundException;
import com.example.bugbuster.repository.UserRepository;
import com.example.bugbuster.service.ScanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/scan")
@RequiredArgsConstructor
public class ScanController {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final ScanService scanService;

    @PostMapping("/full")
    public ResponseEntity<ScanResponse> performFullScan(@Valid @RequestBody ScanRequest request) {
        return ResponseEntity.ok(scanService.performFullScan(request));
    }

    @PostMapping("/form")
    public ResponseEntity<ScanResponse> performFormScan(@Valid @RequestBody ScanRequest request) {
        return ResponseEntity.ok(scanService.performFormScan(request));
    }

    @PostMapping("/layout")
    public ResponseEntity<ScanResponse> performLayoutScan(@Valid @RequestBody ScanRequest request) {
        return ResponseEntity.ok(scanService.performLayoutScan(request));
    }

    @PostMapping("/network")
    public ResponseEntity<ScanResponse> performNetworkScan(@Valid @RequestBody ScanRequest request) {
        return ResponseEntity.ok(scanService.performNetworkScan(request));
    }

    @PostMapping("/security")
    public ResponseEntity<ScanResponse> performSecurityScan(@Valid @RequestBody ScanRequest request) {
        return ResponseEntity.ok(scanService.performSecurityScan(request));
    }

    @PostMapping("/links")
    public ResponseEntity<ScanResponse> performLinkScan(@Valid @RequestBody ScanRequest request) {
        return ResponseEntity.ok(scanService.performLinkScan(request));
    }

    @GetMapping("/limit")
    public ResponseEntity<ApiResponse> getScanLimit(@RequestParam String email) {
        try {
            // 1. Validate email input
            if (email == null || email.isEmpty() || !email.contains("@")) {
                System.out.println("Invalid email format: " + email);
                return ResponseEntity.badRequest().body(
                        ApiResponse.builder()
                                .success(false)
                                .message("Invalid email format")
                                .build());
            }

            // 2. Fetch user from database
            System.out.println("Fetching user with email: " + email);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
            System.out.println("Fetched user: " + user);

            // 3. Get scan limit from user entity
            Integer scanLimit = user.getScanLimit();
            System.out.println("Scan limit for user: " + scanLimit);

            // 4. Return response with scan limit
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .success(true)
                            .message("Scan limit retrieved successfully")
                            .data(scanLimit)
                            .build());

        } catch (ResourceNotFoundException ex) {
            System.out.println("Error: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.builder()
                            .success(false)
                            .message(ex.getMessage())
                            .build());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.builder()
                            .success(false)
                            .message("Error retrieving scan limit: " + ex.getMessage())
                            .build());
        }
    }
}