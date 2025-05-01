package com.example.bugbuster.service.impl;

import com.example.bugbuster.dto.*;
import com.example.bugbuster.dto.request.ScanRequest;
import com.example.bugbuster.dto.response.ScanResponse;
import com.example.bugbuster.entity.*;
import com.example.bugbuster.exception.CustomException;
import com.example.bugbuster.repository.*;
import com.example.bugbuster.service.ScanService;
import com.example.bugbuster.service.scanner.*;
import com.example.bugbuster.util.BugMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScanServiceImpl implements ScanService {

    @Autowired
    private final WebDriver webDriver;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final BugReportRepository bugReportRepository;
    @Autowired
    private final FormBugRepository formBugRepository;
    @Autowired
    private final LayoutBugRepository layoutBugRepository;
    @Autowired
    private final NetworkBugRepository networkBugRepository;
    @Autowired
    private final SecurityBugRepository securityBugRepository;
    @Autowired
    private final LinkBugRepository linkBugRepository;
    @Autowired
    private final ScanHistoryRepository scanHistoryRepository;
    @Autowired
    private final FormScannerService formScannerService;
    @Autowired
    private final LayoutScannerService layoutScannerService;
    @Autowired
    private final NetworkScannerService networkScannerService;
    @Autowired
    private final SecurityScannerService securityScannerService;
    @Autowired
    private final LinkScannerService linkScannerService;

    @Override
    @Transactional
    public ScanResponse performFullScan(ScanRequest request) {
        try {
            log.info("Starting full scan for URL: {}", request.getUrl());

            User user = getAuthenticatedUser(request.getEmail());
            checkScanLimit(user);

            webDriver.get(request.getUrl());
            BugReport report = createReport(request.getUrl(), user, BugReport.ScanType.FULL_SCAN);

            List<FormBug> formBugs = formScannerService.scan(webDriver);
            List<LayoutBug> layoutBugs = layoutScannerService.scan(webDriver);
            List<NetworkBug> networkBugs = networkScannerService.scan(webDriver);
            List<SecurityBug> securityBugs = securityScannerService.scan(webDriver);
            List<LinkBug> linkBugs = linkScannerService.scan(webDriver);

            saveBugs(report, formBugs, layoutBugs, networkBugs, securityBugs, linkBugs);
            int totalBugs = formBugs.size() + layoutBugs.size() + networkBugs.size() +
                    securityBugs.size() + linkBugs.size();

            updateReportAndUser(report, totalBugs);


            return ScanResponse.builder()
                    .report(BugMapper.toReportDTO(report))
                    .formBugs(formBugs.stream().map(BugMapper::toFormBugDTO).toList())
                    .layoutBugs(layoutBugs.stream().map(BugMapper::toLayoutBugDTO).toList())
                    .linkBugs(linkBugs.stream().map(BugMapper::toLinkBugDTO).toList())
                    .networkBugs(networkBugs.stream().map(BugMapper::toNetworkBugDTO).toList())
                    .securityBugs(securityBugs.stream().map(BugMapper::toSecurityBugDTO).toList())
                    .build();

        } catch (Exception e) {
            log.error("Full scan failed for URL: " + request.getUrl(), e);
            throw new CustomException("Full scan failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ScanResponse performFormScan(ScanRequest request) {
        try {
            log.info("Starting form scan for URL: {}", request.getUrl());

            User user = getAuthenticatedUser(request.getEmail());
            checkScanLimit(user);

            webDriver.get(request.getUrl());
            BugReport report = createReport(request.getUrl(), user, BugReport.ScanType.FORM);

            List<FormBug> formBugs = formScannerService.scan(webDriver);
            formBugs.forEach(bug -> bug.setReport(report));
            formBugRepository.saveAll(formBugs);

            updateReportAndUser(report, formBugs.size());

            return ScanResponse.builder()
                    .report(BugMapper.toReportDTO(report))
                    .formBugs(formBugs.stream().map(BugMapper::toFormBugDTO).toList())
                    .build();

        } catch (Exception e) {
            log.error("Form scan failed for URL: " + request.getUrl(), e);
            throw new CustomException("Form scan failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ScanResponse performLayoutScan(ScanRequest request) {
        try {
            log.info("Starting layout scan for URL: {}", request.getUrl());

            User user = getAuthenticatedUser(request.getEmail());
            checkScanLimit(user);

            webDriver.get(request.getUrl());
            BugReport report = createReport(request.getUrl(), user, BugReport.ScanType.LAYOUT);

            List<LayoutBug> layoutBugs = layoutScannerService.scan(webDriver);
            layoutBugs.forEach(bug -> bug.setReport(report));
            layoutBugRepository.saveAll(layoutBugs);

            updateReportAndUser(report, layoutBugs.size());

            return ScanResponse.builder()
                    .report(BugMapper.toReportDTO(report))
                    .layoutBugs(layoutBugs.stream().map(BugMapper::toLayoutBugDTO).toList())
                    .build();

        } catch (Exception e) {
            log.error("Layout scan failed for URL: " + request.getUrl(), e);
            throw new CustomException("Layout scan failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ScanResponse performNetworkScan(ScanRequest request) {
        try {
            log.info("Starting network scan for URL: {}", request.getUrl());

            User user = getAuthenticatedUser(request.getEmail());
            checkScanLimit(user);

            webDriver.get(request.getUrl());
            BugReport report = createReport(request.getUrl(), user, BugReport.ScanType.NETWORK);

            List<NetworkBug> networkBugs = networkScannerService.scan(webDriver);
            networkBugs.forEach(bug -> bug.setReport(report));
            networkBugRepository.saveAll(networkBugs);

            updateReportAndUser(report, networkBugs.size());

            return ScanResponse.builder()
                    .report(BugMapper.toReportDTO(report))
                    .networkBugs(networkBugs.stream().map(BugMapper::toNetworkBugDTO).toList())
                    .build();

        } catch (Exception e) {
            log.error("Network scan failed for URL: " + request.getUrl(), e);
            throw new CustomException("Network scan failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ScanResponse performSecurityScan(ScanRequest request) {
        try {
            log.info("Starting security scan for URL: {}", request.getUrl());

            User user = getAuthenticatedUser(request.getEmail());
            checkScanLimit(user);

            webDriver.get(request.getUrl());
            BugReport report = createReport(request.getUrl(), user, BugReport.ScanType.SECURITY);

            List<SecurityBug> securityBugs = securityScannerService.scan(webDriver);
            securityBugs.forEach(bug -> bug.setReport(report));
            securityBugRepository.saveAll(securityBugs);

            updateReportAndUser(report, securityBugs.size());

            return ScanResponse.builder()
                    .report(BugMapper.toReportDTO(report))
                    .securityBugs(securityBugs.stream().map(BugMapper::toSecurityBugDTO).toList())
                    .build();

        } catch (Exception e) {
            log.error("Security scan failed for URL: " + request.getUrl(), e);
            throw new CustomException("Security scan failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ScanResponse performLinkScan(ScanRequest request) {
        try {
            log.info("Starting link scan for URL: {}", request.getUrl());

            User user = getAuthenticatedUser(request.getEmail());
            checkScanLimit(user);

            webDriver.get(request.getUrl());
            BugReport report = createReport(request.getUrl(), user, BugReport.ScanType.LINKS);

            List<LinkBug> linkBugs = linkScannerService.scan(webDriver);
            linkBugs.forEach(bug -> bug.setReport(report));
            linkBugRepository.saveAll(linkBugs);

            updateReportAndUser(report, linkBugs.size());

            return ScanResponse.builder()
                    .report(BugMapper.toReportDTO(report))
                    .linkBugs(linkBugs.stream().map(BugMapper::toLinkBugDTO).toList())
                    .build();

        } catch (Exception e) {
            log.error("Link scan failed for URL: " + request.getUrl(), e);
            throw new CustomException("Link scan failed: " + e.getMessage());
        }
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found"));
    }

    private void checkScanLimit(User user) {
        Integer scanLimit = user.getScanLimit() != null ? user.getScanLimit() : 5;
        if (!user.isPremium() && scanLimit <= 0) {
            throw new CustomException("Scan limit reached. Please upgrade to premium.");
        }
    }

    private BugReport createReport(String url, User user, BugReport.ScanType scanType) {
        BugReport report = new BugReport();
        report.setUrlScanned(url);
        report.setUser(user);
        report.setScanType(scanType);
        report.setScanTimestamp(LocalDateTime.now());
        return bugReportRepository.save(report);
    }

    private void saveBugs(BugReport report, List<FormBug> formBugs, List<LayoutBug> layoutBugs,
                          List<NetworkBug> networkBugs, List<SecurityBug> securityBugs,
                          List<LinkBug> linkBugs) {
        formBugs.forEach(bug -> bug.setReport(report));
        layoutBugs.forEach(bug -> bug.setReport(report));
        networkBugs.forEach(bug -> bug.setReport(report));
        securityBugs.forEach(bug -> bug.setReport(report));
        linkBugs.forEach(bug -> bug.setReport(report));

        formBugRepository.saveAll(formBugs);
        layoutBugRepository.saveAll(layoutBugs);
        networkBugRepository.saveAll(networkBugs);
        securityBugRepository.saveAll(securityBugs);
        linkBugRepository.saveAll(linkBugs);
    }

    private void updateReportAndUser(BugReport report, int totalBugs) {
        report.setTotalBugsFound(totalBugs);
        bugReportRepository.save(report);

        User user = report.getUser();
        if (!user.isPremium()) {
            user.setScanLimit(user.getScanLimit() - 1);
            userRepository.save(user);
        }

        saveScanHistory(user, report.getUrlScanned(), report.getScanType(), totalBugs);
    }

    private void saveScanHistory(User user, String url, BugReport.ScanType scanType, int bugsFound) {
        ScanHistory history = new ScanHistory();
        history.setUser(user);
        history.setUrlScanned(url);
        history.setScanType(scanType);
        history.setBugsFoundCount(bugsFound);
        history.setScanTimestamp(LocalDateTime.now());
        scanHistoryRepository.save(history);
    }

    // Response builders for all scan types
    private ScanResponse buildFullResponse(BugReportDTO report,
                                           List<FormBugDTO> formBugs,
                                           List<LayoutBugDTO> layoutBugs,
                                           List<NetworkBugDTO> networkBugs,
                                           List<SecurityBugDTO> securityBugs,
                                           List<LinkBugDTO> linkBugs) {
        return ScanResponse.builder()
                .report(report)
//                .url(report.getUrlScanned())
//                .scanType(report.getScanType().toString())
//                .totalBugs(report.getTotalBugsFound())
//                .timestamp(report.getScanTimestamp())
                .formBugs(formBugs)
                .layoutBugs(layoutBugs)
                .networkBugs(networkBugs)
                .securityBugs(securityBugs)
                .linkBugs(linkBugs)
                .build();
    }

    private ScanResponse buildFormResponse(BugReportDTO report, List<FormBugDTO> formBugs) {
        return ScanResponse.builder()
                .report(report)
                .formBugs(formBugs)
                .build();
    }

    private ScanResponse buildLayoutResponse(BugReportDTO report, List<LayoutBugDTO> layoutBugs) {
        return ScanResponse.builder()
                .report(report)
                .layoutBugs(layoutBugs)
                .build();
    }

    private ScanResponse buildNetworkResponse(BugReportDTO report, List<NetworkBugDTO> networkBugs) {
        return ScanResponse.builder()
                .report(report)
                .networkBugs(networkBugs)
                .build();
    }

    private ScanResponse buildSecurityResponse(BugReportDTO report, List<SecurityBugDTO> securityBugs) {
        return ScanResponse.builder()
                .report(report)
                .securityBugs(securityBugs)
                .build();
    }

    private ScanResponse buildLinkResponse(BugReportDTO report, List<LinkBugDTO> linkBugs) {
        return ScanResponse.builder()
                .report(report)
                .linkBugs(linkBugs)
                .build();
    }
}