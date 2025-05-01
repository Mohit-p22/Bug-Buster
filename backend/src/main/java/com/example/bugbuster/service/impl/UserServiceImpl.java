package com.example.bugbuster.service.impl;

import com.example.bugbuster.dto.ScanHistoryDTO;
import com.example.bugbuster.dto.UserProfileDTO;
import com.example.bugbuster.dto.response.UserResponse;
import com.example.bugbuster.entity.BugReport;
import com.example.bugbuster.entity.ScanHistory;
import com.example.bugbuster.entity.User;
import com.example.bugbuster.exception.ResourceNotFoundException;
import com.example.bugbuster.repository.BugReportRepository;
import com.example.bugbuster.repository.SavedReportRepository;
import com.example.bugbuster.repository.ScanHistoryRepository;
import com.example.bugbuster.repository.UserRepository;
import com.example.bugbuster.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final BugReportRepository bugReportRepository;
    @Autowired
    private final SavedReportRepository savedReportRepository;
    @Autowired
    private final ScanHistoryRepository scanHistoryRepository;


    @Override
    public UserResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserResponse.builder()
                .user(mapToUserProfileDTO(user))
                .history(mapToScanHistoryDTOs(user.getScanHistories()))
                .build();
    }

    private UserProfileDTO mapToUserProfileDTO(User user) {
        return UserProfileDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .scanLimit(user.getScanLimit())
                .build();
    }

    private List<ScanHistoryDTO> mapToScanHistoryDTOs(List<ScanHistory> histories) {
        return histories.stream()
                .sorted(Comparator.comparing(ScanHistory::getScanTimestamp).reversed())
                .map(this::mapToScanHistoryDTO)
                .collect(Collectors.toList());
    }

    private ScanHistoryDTO mapToScanHistoryDTO(ScanHistory history) {
        return ScanHistoryDTO.builder()
                .historyID(history.getHistoryId())
                .urlScanned(history.getUrlScanned())
                .scanType(BugReport.ScanType.valueOf(history.getScanType().toString()))
                .bugFoundCount(history.getBugsFoundCount())
                .timestamp(history.getScanTimestamp())
                .build();
    }

    @Override
    public int getScanLimit(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " not found"));
        return user.getScanLimit();
    }




    @Override
    public void updateScanLimit(String email, int newLimit) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setScanLimit(newLimit);
        userRepository.save(user);
    }

    @Override
    public void deleteUserAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }
}
