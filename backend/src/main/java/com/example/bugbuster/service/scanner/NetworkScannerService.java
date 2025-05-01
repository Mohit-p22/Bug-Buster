package com.example.bugbuster.service.scanner;


import com.example.bugbuster.entity.NetworkBug;
import com.example.bugbuster.entity.NetworkBug.SeverityLevel;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import com.example.bugbuster.config.AppConfig.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class NetworkScannerService {

    private static final int TIMEOUT_SECONDS = 5;
    private static final int MAX_API_CALLS_TO_CHECK = 10;
    private final RestTemplate restTemplate;

    public NetworkScannerService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<NetworkBug> scan(WebDriver driver) {
        List<NetworkBug> networkBugs = new ArrayList<>();
        long startTime = System.currentTimeMillis();

        try {
            driver.manage().timeouts().implicitlyWait(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            // A1: Connection Failures
            checkConnectionFailures(driver, networkBugs);

            // A2: DNS/Server Issues
            checkDnsServerIssues(driver, networkBugs);

            // A3: Timeout Handling
            checkTimeoutHandling(driver, networkBugs);

            // B1: Request Issues
            checkRequestIssues(driver, networkBugs);

            // B2: Response Handling Issues
            checkResponseHandling(driver, networkBugs);

        } catch (Exception e) {
            // Log error but continue
        }

        return networkBugs;
    }

    // A1: Connection Failures
    private void checkConnectionFailures(WebDriver driver, List<NetworkBug> bugs) {
        try {
            // Simulate offline mode
            ((JavascriptExecutor) driver).executeScript("window.addEventListener('offline', function() { window.isOffline = true; });");
            ((JavascriptExecutor) driver).executeScript("window.dispatchEvent(new Event('offline'));");

            // Check if app handles offline state
            Object offlineHandled = ((JavascriptExecutor) driver).executeScript(
                    "return window.offlineHandlerImplemented || false");

            if (!(Boolean) offlineHandled) {
                addBug(bugs, driver.findElement(By.tagName("body")), "A1",
                        "No internet connection handling implemented", "HIGH");
            }

            // Restore online state
            ((JavascriptExecutor) driver).executeScript("window.dispatchEvent(new Event('online'));");

            // Check retry mechanism
            Object retryImplemented = ((JavascriptExecutor) driver).executeScript(
                    "return window.retryFailedRequests || false");

            if (!(Boolean) retryImplemented) {
                addBug(bugs, driver.findElement(By.tagName("body")), "A1",
                        "API calls not retrying after network recovery", "MEDIUM");
            }
        } catch (Exception e) {
            addBug(bugs, driver.findElement(By.tagName("body")), "A1",
                    "Application crash when network is lost", "CRITICAL");
        }
    }

    // A2: DNS/Server Issues
    private void checkDnsServerIssues(WebDriver driver, List<NetworkBug> bugs) {
        try {
            // Check for hardcoded URLs
            List<WebElement> scripts = driver.findElements(By.tagName("script"));
            for (WebElement script : scripts) {
                String scriptContent = script.getAttribute("innerHTML");
                if (scriptContent != null) {
                    if (scriptContent.contains("staging.api.com") ||
                            scriptContent.contains("localhost") ||
                            scriptContent.contains("127.0.0.1")) {
                        addBug(bugs, script, "A2",
                                "Wrong server URL configured (staging/localhost)", "HIGH");
                        break;
                    }
                }
            }

            // Check DNS resolution
            try {
                restTemplate.getForObject("https://nonexistent-domain-test-123.com", String.class);
            } catch (ResourceAccessException e) {
                // Expected to fail - now check if app handles it
                Object dnsErrorHandled = ((JavascriptExecutor) driver).executeScript(
                        "return window.dnsErrorHandled || false");

                if (!(Boolean) dnsErrorHandled) {
                    addBug(bugs, driver.findElement(By.tagName("body")), "A2",
                            "DNS resolution failure not handled properly", "HIGH");
                }
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // A3: Timeout Handling
    private void checkTimeoutHandling(WebDriver driver, List<NetworkBug> bugs) {
        try {
            // Check for timeout configuration
            Object timeoutConfigured = ((JavascriptExecutor) driver).executeScript(
                    "return window.apiTimeoutConfigured || false");

            if (!(Boolean) timeoutConfigured) {
                addBug(bugs, driver.findElement(By.tagName("body")), "A3",
                        "No timeout for slow API calls", "HIGH");
            }

            // Check timeout error message
            try {
                // Trigger a timeout (mock endpoint that delays response)
                ((JavascriptExecutor) driver).executeScript(
                        "fetch('/api/slow-response').catch(e => window.timeoutError = e)");

                // Wait to see if error is handled
                Thread.sleep(2000);

                Object timeoutErrorHandled = ((JavascriptExecutor) driver).executeScript(
                        "return window.timeoutErrorHandled || false");
                Object timeoutMessageDisplayed = ((JavascriptExecutor) driver).executeScript(
                        "return document.querySelector('.timeout-error') !== null");

                if (!(Boolean) timeoutErrorHandled || !(Boolean) timeoutMessageDisplayed) {
                    addBug(bugs, driver.findElement(By.tagName("body")), "A3",
                            "Timeout error message missing or unclear", "MEDIUM");
                }
            } catch (Exception e) {
                // Log error but continue
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // B1: Request Issues
    private void checkRequestIssues(WebDriver driver, List<NetworkBug> bugs) {
        try {
            // Analyze network requests
            Object requests = ((JavascriptExecutor) driver).executeScript(
                    "return window.performance.getEntriesByType('resource') || []");

            // Check for incorrect HTTP methods
            Object incorrectMethods = ((JavascriptExecutor) driver).executeScript(
                    "return Array.from(window.performance.getEntriesByType('resource'))" +
                            ".filter(r => (r.initiatorType === 'xmlhttprequest' || r.initiatorType === 'fetch') && " +
                            "!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(r.method))");

            if (((List<?>) incorrectMethods).size() > 0) {
                addBug(bugs, driver.findElement(By.tagName("body")), "B1",
                        "Incorrect HTTP methods used in API calls", "HIGH");
            }

            // Check for missing headers
            Object missingHeaders = ((JavascriptExecutor) driver).executeScript(
                    "return Array.from(window.performance.getEntriesByType('resource'))" +
                            ".filter(r => (r.initiatorType === 'xmlhttprequest' || r.initiatorType === 'fetch') && " +
                            "!r.requestHeaders || !r.requestHeaders['Content-Type'])");

            if (((List<?>) missingHeaders).size() > 0) {
                addBug(bugs, driver.findElement(By.tagName("body")), "B1",
                        "Missing required request headers", "MEDIUM");
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // B2: Response Handling Issues
    private void checkResponseHandling(WebDriver driver, List<NetworkBug> bugs) {
        try {
            // Test error responses
            testErrorResponseHandling(driver, bugs, 400, "Bad Request");
            testErrorResponseHandling(driver, bugs, 401, "Unauthorized");
            testErrorResponseHandling(driver, bugs, 403, "Forbidden");
            testErrorResponseHandling(driver, bugs, 404, "Not Found");
            testErrorResponseHandling(driver, bugs, 500, "Internal Server Error");

            // Test malformed responses
            try {
                ((JavascriptExecutor) driver).executeScript(
                        "fetch('/api/malformed-response').then(r => window.malformedResponse = r)");

                Thread.sleep(2000);

                Object malformedResponseHandled = ((JavascriptExecutor) driver).executeScript(
                        "return window.malformedResponseHandled || false");

                if (!(Boolean) malformedResponseHandled) {
                    addBug(bugs, driver.findElement(By.tagName("body")), "B2",
                            "Failure to handle malformed server responses", "HIGH");
                }
            } catch (Exception e) {
                // Log error but continue
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    private void testErrorResponseHandling(WebDriver driver, List<NetworkBug> bugs, int statusCode, String statusText) {
        try {
            ((JavascriptExecutor) driver).executeScript(
                    String.format("fetch('/api/error-response').then(r => { " +
                            "if(!r.ok) { window.lastErrorStatus = %d; } return r; })", statusCode));

            Thread.sleep(1000);

            Object errorHandled = ((JavascriptExecutor) driver).executeScript(
                    String.format("return window.error%dHandled || false", statusCode));
            Object errorMessageDisplayed = ((JavascriptExecutor) driver).executeScript(
                    String.format("return document.querySelector('.error-%d') !== null", statusCode));

            if (!(Boolean) errorHandled || !(Boolean) errorMessageDisplayed) {
                addBug(bugs, driver.findElement(By.tagName("body")), "B2",
                        String.format("Failure to handle HTTP %d (%s) status code", statusCode, statusText),
                        statusCode >= 500 ? "HIGH" : "MEDIUM");
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    private void addBug(List<NetworkBug> bugs, WebElement element, String category,
                        String description, String severity) {
        bugs.add(NetworkBug.builder()
                .elementType(element.getTagName())
                .elementIdentifier(element.getAttribute("id"))
                .description(String.format("[%s] %s", category, description))
                .severityLevel(SeverityLevel.valueOf(severity))
                .htmlSnippet(truncate(element.getAttribute("outerHTML"), 2000))
                .build());
    }

    private String truncate(String value, int maxLength) {
        return value != null && value.length() > maxLength ?
                value.substring(0, maxLength) : value;
    }
}