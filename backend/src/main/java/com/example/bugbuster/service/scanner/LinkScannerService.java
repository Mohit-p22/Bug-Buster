package com.example.bugbuster.service.scanner;

import com.example.bugbuster.entity.LinkBug;
import com.example.bugbuster.entity.LinkBug.SeverityLevel;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class LinkScannerService {

    WebDriver driver = null;
    private static final int MAX_LINKS_TO_SCAN = 50;
    private static final int TIMEOUT_SECONDS = 5;

    public List<LinkBug> scan(WebDriver driver) {
        List<LinkBug> linkBugs = new ArrayList<>();
        long startTime = System.currentTimeMillis();

        try {
            driver.manage().timeouts().implicitlyWait(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            List<WebElement> links = driver.findElements(By.tagName("a"));

            // Limit number of links to scan
            int linksToCheck = Math.min(links.size(), MAX_LINKS_TO_SCAN);

            for (int i = 0; i < linksToCheck; i++) {
                WebElement link = links.get(i);

                // A1: Broken Links
                checkBrokenLinks(link, linkBugs);

                // A2: Incorrect Link Behavior
                checkLinkBehavior(link, linkBugs);

                // A3: Accessibility in Links
                checkLinkAccessibility(link, linkBugs);

                // Early exit if taking too long
                if (System.currentTimeMillis() - startTime > TimeUnit.SECONDS.toMillis(10)) {
                    break;
                }
            }
        } catch (Exception e) {
            // Log error but continue
        }

        return linkBugs;
    }

    // A1: Broken Links
    private void checkBrokenLinks(WebElement link, List<LinkBug> bugs) {
        String href = link.getAttribute("href");
        if (href == null || href.isEmpty()) return;

        try {
            // Check if link is reachable (simplified - would need HTTP client in real implementation)
            String currentUrl = ((JavascriptExecutor) driver).executeScript(
                    "var xhr = new XMLHttpRequest();" +
                            "xhr.open('HEAD', arguments[0], false);" +
                            "xhr.send();" +
                            "return xhr.status;", href).toString();

            if (currentUrl.equals("404")) {
                addBug(bugs, link, "A1", "Link leads to 404 page", "HIGH");
            }
        } catch (Exception e) {
            addBug(bugs, link, "A1", "Link may be broken - error checking", "MEDIUM");
        }
    }

    // A2: Incorrect Link Behavior
    private void checkLinkBehavior(WebElement link, List<LinkBug> bugs) {
        // Check target attribute
        String target = link.getAttribute("target");
        if (target == null || !target.equals("_blank")) {
            // Check if this is an external link that should open in new tab
            String href = link.getAttribute("href");
            if (href != null && href.startsWith("http") && !href.contains(driver.getCurrentUrl())) {
                addBug(bugs, link, "A2", "External link should open in new tab", "MEDIUM");
            }
        }

        // Check hover effect
        if (!hasHoverEffect(link)) {
            addBug(bugs, link, "A2", "Link missing hover effect", "LOW");
        }
    }

    // A3: Accessibility in Links
    private void checkLinkAccessibility(WebElement link, List<LinkBug> bugs) {
        // Check descriptive text
        String text = link.getText().trim();
        if (text.isEmpty() || text.equalsIgnoreCase("click here") || text.equalsIgnoreCase("read more")) {
            addBug(bugs, link, "A3", "Link text not descriptive", "MEDIUM");
        }

        // Check keyboard accessibility
        if (!isKeyboardAccessible(link)) {
            addBug(bugs, link, "A3", "Link not accessible via keyboard", "HIGH");
        }

        // Check ARIA label
        if (link.getAttribute("aria-label") == null) {
            addBug(bugs, link, "A3", "Link missing ARIA label for screen readers", "MEDIUM");
        }
    }

    // Helper methods
    private boolean hasHoverEffect(WebElement link) {
        String beforeHover = link.getCssValue("text-decoration");

        new Actions(driver).moveToElement(link).perform();
        String afterHover = link.getCssValue("text-decoration");
        return !beforeHover.equals(afterHover);
    }

    private boolean isKeyboardAccessible(WebElement link) {
        try {
            link.sendKeys(Keys.TAB);
            return link.equals(driver.switchTo().activeElement());
        } catch (Exception e) {
            return false;
        }
    }

    private void addBug(List<LinkBug> bugs, WebElement element, String category,
                        String description, String severity) {
        bugs.add(LinkBug.builder()
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