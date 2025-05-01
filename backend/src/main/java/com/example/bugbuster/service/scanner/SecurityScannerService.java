package com.example.bugbuster.service.scanner;

import com.example.bugbuster.entity.SecurityBug;
import com.example.bugbuster.entity.SecurityBug.SeverityLevel;
import org.openqa.selenium.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@Service
public class SecurityScannerService {

    private static final int TIMEOUT_SECONDS = 5;
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$");

    public List<SecurityBug> scan(WebDriver driver) {
        List<SecurityBug> securityBugs = new ArrayList<>();
        long startTime = System.currentTimeMillis();

        try {
            driver.manage().timeouts().implicitlyWait(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            // A1: Weak Authentication
            checkAuthenticationSecurity(driver, securityBugs);

            // A2: Session Management
            checkSessionManagement(driver, securityBugs);

            // A3: Token Management
            checkTokenManagement(driver, securityBugs);



            // C2: Data at Rest
            checkDataAtRest(driver, securityBugs);

            // D1: Cross-Site Scripting (XSS)
            checkXSSVulnerabilities(driver, securityBugs);

            // D2: SQL Injection
            checkSQLInjectionVulnerabilities(driver, securityBugs);

            // D3: Command Injection
            checkCommandInjectionVulnerabilities(driver, securityBugs);

        } catch (Exception e) {
            // Log error but continue
        }

        return securityBugs;
    }

    // A1: Weak Authentication
    private void checkAuthenticationSecurity(WebDriver driver, List<SecurityBug> bugs) {
        try {
            // Check password complexity
            WebElement passwordInput = driver.findElement(By.cssSelector("input[type='password']"));
            String pattern = passwordInput.getAttribute("pattern");

            if (pattern == null || !PASSWORD_PATTERN.matcher(pattern).matches()) {
                addBug(bugs, passwordInput, "A1",
                        "Weak password complexity rules", "HIGH");
            }

            // Check brute-force protection
            Object loginAttemptsLimited = ((JavascriptExecutor) driver).executeScript(
                    "return window.loginAttemptsLimited || false");

            if (!(Boolean) loginAttemptsLimited) {
                addBug(bugs, driver.findElement(By.cssSelector("form")), "A1",
                        "No limit on login attempts (brute-force possible)", "HIGH");
            }
        } catch (NoSuchElementException e) {
            // Password input not found - skip
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // A2: Session Management
    private void checkSessionManagement(WebDriver driver, List<SecurityBug> bugs) {
        try {
            // Check session expiration after logout
            Object sessionExpiresOnLogout = ((JavascriptExecutor) driver).executeScript(
                    "return window.sessionExpiresOnLogout || false");

            if (!(Boolean) sessionExpiresOnLogout) {
                addBug(bugs, driver.findElement(By.tagName("body")), "A2",
                        "Sessions not expiring after logout", "HIGH");
            }

            // Check session fixation
            Object sessionChangesAfterLogin = ((JavascriptExecutor) driver).executeScript(
                    "return window.sessionChangesAfterLogin || false");

            if (!(Boolean) sessionChangesAfterLogin) {
                addBug(bugs, driver.findElement(By.tagName("body")), "A2",
                        "Session fixation possible (session ID remains after login)", "HIGH");
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // A3: Token Management
    private void checkTokenManagement(WebDriver driver, List<SecurityBug> bugs) {
        try {
            // Check token expiration
            Object tokensExpire = ((JavascriptExecutor) driver).executeScript(
                    "return window.tokensExpire || false");

            if (!(Boolean) tokensExpire) {
                addBug(bugs, driver.findElement(By.tagName("body")), "A3",
                        "Access tokens not expiring", "HIGH");
            }

            // Check token exposure
            Object tokensInURL = ((JavascriptExecutor) driver).executeScript(
                    "return window.location.href.indexOf('token=') > -1 || " +
                            "window.location.href.indexOf('access_token=') > -1");

            Object tokensInStorage = ((JavascriptExecutor) driver).executeScript(
                    "return localStorage.getItem('token') !== null || " +
                            "sessionStorage.getItem('token') !== null");

            if ((Boolean) tokensInURL || (Boolean) tokensInStorage) {
                addBug(bugs, driver.findElement(By.tagName("body")), "A3",
                        "Tokens exposed in URLs or insecure storage", "CRITICAL");
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // C1: Data in Transit
    private void checkDataInTransit(WebDriver driver, List<SecurityBug> bugs) {
        try {
            // Check for HTTP usage
            Object usingHTTPS = ((JavascriptExecutor) driver).executeScript(
                    "return window.location.protocol === 'https:'");

            if (!(Boolean) usingHTTPS) {
                addBug(bugs, driver.findElement(By.tagName("body")), "C1",
                        "Data sent over HTTP instead of HTTPS", "CRITICAL");
            }

            // Check for sensitive data in network requests
            Object sensitiveDataExposed = ((JavascriptExecutor) driver).executeScript(
                    "return window.sensitiveDataInRequests || false");

            if ((Boolean) sensitiveDataExposed) {
                addBug(bugs, driver.findElement(By.tagName("body")), "C1",
                        "Sensitive data visible in network requests", "HIGH");
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // C2: Data at Rest
    private void checkDataAtRest(WebDriver driver, List<SecurityBug> bugs) {
        try {
            // Check for passwords without encryption
            Object passwordsEncrypted = ((JavascriptExecutor) driver).executeScript(
                    "return window.passwordsEncryptedAtRest || false");

            if (!(Boolean) passwordsEncrypted) {
                addBug(bugs, driver.findElement(By.tagName("body")), "C2",
                        "Passwords stored without encryption", "CRITICAL");
            }

            // Check for sensitive data in client-side code
            List<WebElement> scripts = driver.findElements(By.tagName("script"));
            for (WebElement script : scripts) {
                String content = script.getAttribute("innerHTML");
                if (content != null &&
                        (content.contains("apiKey") ||
                                content.contains("secret") ||
                                content.contains("password"))) {
                    addBug(bugs, script, "C2",
                            "Sensitive data visible in client-side code", "HIGH");
                    break;
                }
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // D1: Cross-Site Scripting (XSS)
    private void checkXSSVulnerabilities(WebDriver driver, List<SecurityBug> bugs) {
        try {
            // Check for unsanitized input rendering
            List<WebElement> inputs = driver.findElements(By.cssSelector(
                    "input[type='text'], textarea"));

            for (WebElement input : inputs) {
                if (!hasOutputEncoding(input)) {
                    addBug(bugs, input, "D1",
                            "Potential XSS vulnerability - unsanitized input rendered", "CRITICAL");
                    break;
                }
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // D2: SQL Injection
    private void checkSQLInjectionVulnerabilities(WebDriver driver, List<SecurityBug> bugs) {
        try {
            // Check for SQL injection patterns
            List<WebElement> inputs = driver.findElements(By.cssSelector(
                    "input[type='text'], textarea"));

            for (WebElement input : inputs) {
                if (!hasParameterizedQueries(input)) {
                    addBug(bugs, input, "D2",
                            "Potential SQL injection vulnerability", "CRITICAL");
                    break;
                }
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // D3: Command Injection
    private void checkCommandInjectionVulnerabilities(WebDriver driver, List<SecurityBug> bugs) {
        try {
            // Check for command injection patterns
            List<WebElement> inputs = driver.findElements(By.cssSelector(
                    "input[type='text'], textarea"));

            for (WebElement input : inputs) {
                if (!hasInputSanitization(input)) {
                    addBug(bugs, input, "D3",
                            "Potential command injection vulnerability", "CRITICAL");
                    break;
                }
            }
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // Helper methods
    private boolean hasOutputEncoding(WebElement element) {
        try {
            String onInput = element.getAttribute("oninput");
            String onChange = element.getAttribute("onchange");
            return (onInput != null && onInput.contains("encodeURI")) ||
                    (onChange != null && onChange.contains("encodeURI"));
        } catch (Exception e) {
            return false;
        }
    }

    private boolean hasParameterizedQueries(WebElement element) {
        try {
            String formAction = element.findElement(By.xpath("./ancestor::form")).getAttribute("action");
            return formAction != null && !formAction.contains("?");
        } catch (Exception e) {
            return false;
        }
    }

    private boolean hasInputSanitization(WebElement element) {
        try {
            String pattern = element.getAttribute("pattern");
            return pattern != null && !pattern.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    private void addBug(List<SecurityBug> bugs, WebElement element, String category,
                        String description, String severity) {
        bugs.add(SecurityBug.builder()
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