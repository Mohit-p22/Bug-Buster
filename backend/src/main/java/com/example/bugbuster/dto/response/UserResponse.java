package com.example.bugbuster.dto.response;


import com.example.bugbuster.dto.FormBugDTO;
import com.example.bugbuster.dto.LayoutBugDTO;
import com.example.bugbuster.dto.ScanHistoryDTO;
import com.example.bugbuster.dto.UserProfileDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UserProfileDTO user;
    private List<ScanHistoryDTO> history;
}
