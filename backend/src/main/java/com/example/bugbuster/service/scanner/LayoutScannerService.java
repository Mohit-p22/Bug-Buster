package com.example.bugbuster.service.scanner;

import com.example.bugbuster.entity.LayoutBug;
import com.example.bugbuster.entity.LayoutBug.SeverityLevel;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.Point;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class LayoutScannerService {

    // Configuration constants
    private static final int MAX_ELEMENTS_TO_SCAN = 50;
    private static final int MAX_SCREENSHOT_WIDTH = 1920;
    private static final int MAX_SCREENSHOT_HEIGHT = 1080;
    private static final int TIMEOUT_SECONDS = 5;
    WebDriver driver = null;

    public List<LayoutBug> scan(WebDriver driver) {
        List<LayoutBug> layoutBugs = new ArrayList<>();
        long startTime = System.currentTimeMillis();

        try {
            driver.manage().timeouts().implicitlyWait(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            // A1: Text Alignment
            checkTextAlignment(driver, layoutBugs);

            // A2: Component Alignment
            checkComponentAlignment(driver, layoutBugs);

            // B: Responsiveness
            checkResponsiveness(driver, layoutBugs);

            // C1: Image Scaling
            checkImageScaling(driver, layoutBugs);

            // C2: Font Scaling
            checkFontScaling(driver, layoutBugs);

            // C3: Component Sizing
            checkComponentSizing(driver, layoutBugs);

            // D1: Theme/Style Issues
            checkThemeConsistency(driver, layoutBugs);

            // D2: Spacing Issues
            checkSpacingIssues(driver, layoutBugs);

        } catch (Exception e) {
            // Log error but continue
        }

        return layoutBugs;
    }

    // A1: Text Alignment
    private void checkTextAlignment(WebDriver driver, List<LayoutBug> bugs) {
        // Check label-input alignment
        List<WebElement> labels = driver.findElements(By.cssSelector("label"));
        int elementsChecked = 0;

        for (WebElement label : labels) {
            if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

            try {
                String forId = label.getAttribute("for");
                if (forId != null && !forId.isEmpty()) {
                    WebElement input = driver.findElement(By.id(forId));
                    if (!isVerticallyAligned(label, input)) {
                        addBug(bugs, label, "A1", "Label not vertically aligned with input", "MEDIUM");
                    }
                }
            } catch (NoSuchElementException e) {
                // Input not found - skip
            }
        }

        // Check heading centering
        List<WebElement> headings = driver.findElements(By.cssSelector("h1, h2, h3, h4, h5, h6"));
        for (WebElement heading : headings) {
            if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

            if (!isCentered(heading)) {
                addBug(bugs, heading, "A1", "Heading not centered as expected", "LOW");
            }
        }
    }

    // A2: Component Alignment
    private void checkComponentAlignment(WebDriver driver, List<LayoutBug> bugs) {
        // Check button alignment in sections
        List<WebElement> sections = driver.findElements(By.cssSelector("section, .section, [role='region']"));
        int elementsChecked = 0;

        for (WebElement section : sections) {
            if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

            List<WebElement> buttons = section.findElements(By.cssSelector("button, input[type='button'], input[type='submit']"));
            if (!buttons.isEmpty() && !areElementsAligned(buttons)) {
                addBug(bugs, section, "A2", "Buttons misaligned within section", "MEDIUM");
            }
        }

        // Check icon centering
        List<WebElement> icons = driver.findElements(By.cssSelector(".icon, [class*='icon-'], svg"));
        for (WebElement icon : icons) {
            if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

            if (!isCentered(icon)) {
                addBug(bugs, icon, "A2", "Icon not properly centered", "LOW");
            }
        }
    }

    // B: Responsiveness
    private void checkResponsiveness(WebDriver driver, List<LayoutBug> bugs) {
        // Check grid layouts at different resolutions
        try {
            Dimension originalSize = driver.manage().window().getSize();

            // Test mobile size
            driver.manage().window().setSize(new Dimension(375, 667));
            List<WebElement> grids = driver.findElements(By.cssSelector(".grid, [class*='grid-']"));
            for (WebElement grid : grids) {
                if (isLayoutBroken(grid)) {
                    addBug(bugs, grid, "B", "Grid layout breaks on mobile resolution", "HIGH");
                }
            }

            // Reset to original size
            driver.manage().window().setSize(originalSize);
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // C1: Image Scaling
    private void checkImageScaling(WebDriver driver, List<LayoutBug> bugs) {
        List<WebElement> images = driver.findElements(By.cssSelector("img"));
        int elementsChecked = 0;

        for (WebElement img : images) {
            if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

            // Check proportional scaling
            String naturalWidth = img.getAttribute("naturalWidth");
            String naturalHeight = img.getAttribute("naturalHeight");
            String displayWidth = img.getCssValue("width");
            String displayHeight = img.getCssValue("height");

            if (naturalWidth != null && naturalHeight != null &&
                    displayWidth != null && displayHeight != null) {
                double originalRatio = Double.parseDouble(naturalWidth) / Double.parseDouble(naturalHeight);
                double displayRatio = parseCssDimension(displayWidth) / parseCssDimension(displayHeight);

                if (Math.abs(originalRatio - displayRatio) > 0.1) {
                    addBug(bugs, img, "C1", "Image not scaling proportionally", "MEDIUM");
                }
            }
        }
    }

    // C2: Font Scaling
    private void checkFontScaling(WebDriver driver, List<LayoutBug> bugs) {
        // Simulate zoom by changing font size
        try {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("document.body.style.zoom = '150%'");

            // Check for text overlap
            List<WebElement> textContainers = driver.findElements(By.cssSelector("p, span, div, h1, h2, h3, h4, h5, h6"));
            int elementsChecked = 0;

            for (WebElement container : textContainers) {
                if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

                if (isTextOverflowing(container)) {
                    addBug(bugs, container, "C2", "Text overlapping when zoomed", "MEDIUM");
                }
            }

            // Reset zoom
            js.executeScript("document.body.style.zoom = '100%'");
        } catch (Exception e) {
            // Log error but continue
        }
    }

    // C3: Component Sizing
    private void checkComponentSizing(WebDriver driver, List<LayoutBug> bugs) {
        // Check button sizes
        List<WebElement> buttons = driver.findElements(By.cssSelector("button, input[type='button'], input[type='submit']"));
        int elementsChecked = 0;

        for (WebElement button : buttons) {
            if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

            Dimension size = button.getSize();
            if (size.getWidth() < 40 || size.getHeight() < 24) {
                addBug(bugs, button, "C3", "Button too small", "LOW");
            } else if (size.getWidth() > 300 || size.getHeight() > 60) {
                addBug(bugs, button, "C3", "Button too large", "LOW");
            }
        }

        // Check input field sizing
        List<WebElement> inputs = driver.findElements(By.cssSelector("input[type='text'], input[type='email'], textarea"));
        for (WebElement input : inputs) {
            if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

            if (isElementResizingImproperly(input)) {
                addBug(bugs, input, "C3", "Input field resizing improperly", "MEDIUM");
            }
        }
    }

    // D1: Theme/Style Issues
    private void checkThemeConsistency(WebDriver driver, List<LayoutBug> bugs) {
        // Check button color consistency
        List<WebElement> buttons = driver.findElements(By.cssSelector("button, input[type='button']"));
        String primaryButtonColor = buttons.isEmpty() ? null : buttons.get(0).getCssValue("background-color");

        for (WebElement button : buttons) {
            String currentColor = button.getCssValue("background-color");
            if (primaryButtonColor != null && !primaryButtonColor.equals(currentColor)) {
                addBug(bugs, button, "D1", "Inconsistent button colors", "LOW");
                break;
            }
        }

        // Check border radius consistency
        List<WebElement> roundedElements = driver.findElements(By.cssSelector("[class*='rounded'], [style*='border-radius']"));
        String primaryBorderRadius = roundedElements.isEmpty() ? null : roundedElements.get(0).getCssValue("border-radius");

        for (WebElement element : roundedElements) {
            String currentRadius = element.getCssValue("border-radius");
            if (primaryBorderRadius != null && !primaryBorderRadius.equals(currentRadius)) {
                addBug(bugs, element, "D1", "Inconsistent border radius", "LOW");
                break;
            }
        }
    }

    // D2: Spacing Issues
    private void checkSpacingIssues(WebDriver driver, List<LayoutBug> bugs) {
        // Check spacing between elements in containers
        List<WebElement> containers = driver.findElements(By.cssSelector("div, section, article, main"));
        int elementsChecked = 0;

        for (WebElement container : containers) {
            if (elementsChecked++ >= MAX_ELEMENTS_TO_SCAN) break;

            if (hasUnevenSpacing(container)) {
                addBug(bugs, container, "D2", "Uneven spacing between elements", "LOW");
            }
        }

        // Check page edge whitespace
        WebElement body = driver.findElement(By.tagName("body"));
        if (hasExcessiveWhitespace(body)) {
            addBug(bugs, body, "D2", "Excessive whitespace at page edges", "LOW");
        }
    }

    // Helper methods with complete implementations
    private boolean isVerticallyAligned(WebElement element1, WebElement element2) {
        try {
            Point location1 = element1.getLocation();
            Point location2 = element2.getLocation();
            Dimension size1 = element1.getSize();
            Dimension size2 = element2.getSize();

            // Check if elements are vertically aligned within 5px tolerance
            int centerY1 = location1.getY() + size1.getHeight() / 2;
            int centerY2 = location2.getY() + size2.getHeight() / 2;

            return Math.abs(centerY1 - centerY2) <= 5;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isCentered(WebElement element) {
        try {
            WebElement parent = (WebElement) ((JavascriptExecutor) driver).executeScript(
                    "return arguments[0].parentNode;", element);

            Dimension parentSize = parent.getSize();
            Point parentLocation = parent.getLocation();
            Dimension elementSize = element.getSize();
            Point elementLocation = element.getLocation();

            // Calculate expected centered position
            int expectedX = parentLocation.getX() + (parentSize.getWidth() - elementSize.getWidth()) / 2;

            // Check if horizontally centered within 5px tolerance
            return Math.abs(elementLocation.getX() - expectedX) <= 5;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean areElementsAligned(List<WebElement> elements) {
        if (elements.isEmpty()) return true;

        try {
            // Get the Y position of the first element as reference
            int referenceY = elements.get(0).getLocation().getY();

            // Check if all elements are within 5px vertically
            for (WebElement element : elements) {
                if (Math.abs(element.getLocation().getY() - referenceY) > 5) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isLayoutBroken(WebElement element) {
        try {
            // Check if any child elements are overlapping or out of bounds
            List<WebElement> children = element.findElements(By.cssSelector("*"));
            Rectangle parentRect = new Rectangle(
                    element.getLocation().getX(),
                    element.getLocation().getY(),
                    element.getSize().getWidth(),
                    element.getSize().getHeight()
            );

            for (int i = 0; i < children.size(); i++) {
                WebElement child1 = children.get(i);
                Rectangle rect1 = new Rectangle(
                        child1.getLocation().getX(),
                        child1.getLocation().getY(),
                        child1.getSize().getWidth(),
                        child1.getSize().getHeight()
                );



                // Check for overlapping with other children
                for (int j = i + 1; j < children.size(); j++) {
                    WebElement child2 = children.get(j);
                    Rectangle rect2 = new Rectangle(
                            child2.getLocation().getX(),
                            child2.getLocation().getY(),
                            child2.getSize().getWidth(),
                            child2.getSize().getHeight()
                    );


                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private double parseCssDimension(String dimension) {
        if (dimension == null || dimension.isEmpty()) return 0;

        try {
            // Remove non-numeric characters (px, em, rem, etc.)
            String numericValue = dimension.replaceAll("[^0-9.]", "");
            if (numericValue.isEmpty()) return 0;

            return Double.parseDouble(numericValue);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private boolean isTextOverflowing(WebElement element) {
        try {
            // Compare scroll dimensions with visible dimensions
            JavascriptExecutor js = (JavascriptExecutor) driver;
            long scrollWidth = (Long) js.executeScript(
                    "return arguments[0].scrollWidth;", element);
            long clientWidth = (Long) js.executeScript(
                    "return arguments[0].clientWidth;", element);

            long scrollHeight = (Long) js.executeScript(
                    "return arguments[0].scrollHeight;", element);
            long clientHeight = (Long) js.executeScript(
                    "return arguments[0].clientHeight;", element);

            // If scroll dimensions are larger than visible dimensions, text is overflowing
            return scrollWidth > clientWidth || scrollHeight > clientHeight;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isElementResizingImproperly(WebElement element) {
        try {
            // Get original dimensions
            Dimension originalSize = element.getSize();

            // Change viewport size

            driver.manage().window().setSize(new Dimension(originalSize.getWidth() / 2, originalSize.getHeight()));

            // Get new dimensions
            Dimension newSize = element.getSize();

            // Restore original viewport size
            driver.manage().window().setSize(new Dimension(originalSize.getWidth() * 2, originalSize.getHeight()));

            // Check if element resized proportionally
            double widthRatio = (double) newSize.getWidth() / originalSize.getWidth();
            double heightRatio = (double) newSize.getHeight() / originalSize.getHeight();

            // Allow 10% tolerance in ratio difference
            return Math.abs(widthRatio - heightRatio) > 0.1;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean hasUnevenSpacing(WebElement container) {
        try {
            List<WebElement> children = container.findElements(By.cssSelector("> *"));
            if (children.size() < 3) return false;

            // Get spacing between first two elements as reference
            int referenceSpacing = children.get(1).getLocation().getY() -
                    (children.get(0).getLocation().getY() + children.get(0).getSize().getHeight());

            // Check spacing between all consecutive elements
            for (int i = 2; i < children.size(); i++) {
                int currentSpacing = children.get(i).getLocation().getY() -
                        (children.get(i-1).getLocation().getY() + children.get(i-1).getSize().getHeight());

                // Allow 5px tolerance in spacing difference
                if (Math.abs(currentSpacing - referenceSpacing) > 5) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean hasExcessiveWhitespace(WebElement element) {
        try {
            // Calculate the ratio of empty space to content space
            Dimension size = element.getSize();
            List<WebElement> children = element.findElements(By.cssSelector("*"));

            if (children.isEmpty()) return false;

            // Get combined area of all children
            double childrenArea = 0;
            for (WebElement child : children) {
                Dimension childSize = child.getSize();
                childrenArea += childSize.getWidth() * childSize.getHeight();
            }

            // Calculate parent area
            double parentArea = size.getWidth() * size.getHeight();

            // If more than 50% is whitespace, consider it excessive
            return (parentArea - childrenArea) / parentArea > 0.5;
        } catch (Exception e) {
            return false;
        }
    }

    private void addBug(List<LayoutBug> bugs, WebElement element, String category,
                        String description, String severity) {
        bugs.add(LayoutBug.builder()
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