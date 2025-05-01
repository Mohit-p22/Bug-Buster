package com.example.bugbuster.service;

import com.example.bugbuster.dto.request.ScanRequest;
import com.example.bugbuster.dto.response.ScanResponse;
import com.example.bugbuster.entity.BugReport;

public interface ScanService {
    ScanResponse performFullScan(ScanRequest request);
    ScanResponse performFormScan(ScanRequest request);
    ScanResponse performLayoutScan(ScanRequest request);
    ScanResponse performNetworkScan(ScanRequest request);
    ScanResponse performSecurityScan(ScanRequest request);
    ScanResponse performLinkScan(ScanRequest request);

}