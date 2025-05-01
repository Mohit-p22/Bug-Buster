package com.example.bugbuster.service.scanner;

import com.example.bugbuster.entity.FormBug;
import com.example.bugbuster.entity.SeverityLevel;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@Service
public class FormScannerService {

    // Configuration constants
    private static final int MAX_FORMS_TO_SCAN = 3;
    private static final int MAX_FIELDS_PER_FORM = 20;
    private static final int MAX_HTML_SNIPPET_LENGTH = 2000;
    private static final int TIMEOUT_SECONDS = 5;

    // Regular expressions for validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s./0-9]*$");

    public List<FormBug> scan(WebDriver driver) {
        List<FormBug> formBugs = new ArrayList<>();
        long startTime = System.currentTimeMillis();

        try {
            driver.manage().timeouts().implicitlyWait(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            List<WebElement> forms = driver.findElements(By.cssSelector("form:not([data-skip-scan])"));

            // Limit the number of forms to scan
            int formsToCheck = Math.min(forms.size(), MAX_FORMS_TO_SCAN);

            for (int i = 0; i < formsToCheck; i++) {
                WebElement form = forms.get(i);
                scanForm(form, formBugs);

                // Early exit if taking too long
                if (System.currentTimeMillis() - startTime > TimeUnit.SECONDS.toMillis(10)) {
                    break;
                }
            }
        } catch (Exception e) {
            // Log error but continue
        }

        return formBugs;
    }

    private void scanForm(WebElement form, List<FormBug> formBugs) {
        String formId = getAttribute(form, "id");

        // A1: Required Field Validation
        checkRequiredFields(form, formBugs);

        // A2: Format Validation
        checkFieldFormats(form, formBugs);

        // A3: Character Validation
        checkCharacterValidation(form, formBugs);

        // B1: Display Issues
        checkErrorDisplay(form, formBugs);

        // C1: Field Behavior
        checkFieldBehavior(form, formBugs);

        // C2: Form Controls
        checkFormControls(form, formBugs);

    }

    // A1: Required Field Validation
    private void checkRequiredFields(WebElement form, List<FormBug> formBugs) {
        List<WebElement> requiredInputs = form.findElements(By.cssSelector(
                "input[required], select[required], textarea[required]"
        ));

        for (WebElement input : requiredInputs) {
            // Check if required indicator exists
            String indicator = findRequiredIndicator(input);
            if (indicator == null) {
                addBug(formBugs, input, "A1", "Missing required field indicator", "MEDIUM");
            }

            // Check validation attributes
            if (!hasValidationAttributes(input)) {
                addBug(formBugs, input, "A1", "Required field missing validation", "HIGH");
            }
        }
    }

    // A2: Format Validation
    private void checkFieldFormats(WebElement form, List<FormBug> formBugs) {
        // Email validation
        form.findElements(By.cssSelector("input[type='email']")).forEach(input -> {
            if (!hasProperPattern(input, EMAIL_PATTERN)) {
                addBug(formBugs, input, "A2", "Incorrect email validation", "HIGH");
            }
        });

        // Phone validation
        form.findElements(By.cssSelector("input[type='tel']")).forEach(input -> {
            if (!hasProperPattern(input, PHONE_PATTERN)) {
                addBug(formBugs, input, "A2", "Incorrect phone validation", "HIGH");
            }
        });

        // Password fields
        form.findElements(By.cssSelector("input[type='password']")).forEach(input -> {
            if (!"password".equals(input.getAttribute("type"))) {
                addBug(formBugs, input, "A2", "Password field shows plain text", "CRITICAL");
            }
        });
    }

    // A3: Character Validation
    private void checkCharacterValidation(WebElement form, List<FormBug> formBugs) {
        form.findElements(By.cssSelector("input[type='text'], textarea")).forEach(input -> {
            // Check for maxlength attribute
            if (!hasAttribute(input, "maxlength")) {
                addBug(formBugs, input, "A3", "Missing character limit", "MEDIUM");
            }

            // Check for trim behavior
            if (!hasAttribute(input, "data-trim") && !hasAttribute(input, "pattern")) {
                addBug(formBugs, input, "A3", "Missing whitespace trimming", "LOW");
            }
        });
    }

    // B1: Display Issues
    private void checkErrorDisplay(WebElement form, List<FormBug> formBugs) {
        // Check for error container
        if (form.findElements(By.cssSelector(".error-message, [role='alert']")).isEmpty()) {
            addBug(formBugs, form, "B1", "Missing error message container", "MEDIUM");
        }
    }

    // C1: Field Behavior
    private void checkFieldBehavior(WebElement form, List<FormBug> formBugs) {
        // Check placeholders
        form.findElements(By.cssSelector("input:not([type='submit']), textarea")).forEach(input -> {
            if (!hasAttribute(input, "placeholder")) {
                addBug(formBugs, input, "C1", "Missing placeholder text", "LOW");
            }
        });

        // Check tab order
        checkTabOrder(form, formBugs);
    }

    // C2: Form Controls
    private void checkFormControls(WebElement form, List<FormBug> formBugs) {
        WebElement submitButton = form.findElement(By.cssSelector("input[type='submit'], button[type='submit']"));
        if (submitButton != null) {
            // Check if submit button is properly disabled
            if (!"true".equals(submitButton.getAttribute("disabled"))) {
                addBug(formBugs, submitButton, "C2", "Submit button not disabled when invalid", "MEDIUM");
            }
        }
    }

    // Helper methods
    private boolean hasProperPattern(WebElement element, Pattern pattern) {
        String htmlPattern = element.getAttribute("pattern");
        String type = element.getAttribute("type");
        return htmlPattern != null || (type != null && !type.isEmpty());
    }

    private boolean hasValidationAttributes(WebElement element) {
        return hasAttribute(element, "pattern") ||
                hasAttribute(element, "required") ||
                hasAttribute(element, "minlength") ||
                hasAttribute(element, "maxlength");
    }

    private boolean hasAttribute(WebElement element, String attr) {
        return element.getAttribute(attr) != null;
    }

    private String findRequiredIndicator(WebElement input) {
        // Implementation for finding required indicator (asterisk, text, etc.)
        return null;
    }

    private void checkTabOrder(WebElement form, List<FormBug> formBugs) {
        // Implementation for checking tab order
    }

    private String getAttribute(WebElement element, String attribute) {
        try {
            String value = element.getAttribute(attribute);
            return value != null && !value.isEmpty() ? value : null;
        } catch (Exception e) {
            return null;
        }
    }

    private void addBug(List<FormBug> formBugs, WebElement element, String category,
                        String description, String severity) {
        formBugs.add(FormBug.builder()
                .elementType(element.getTagName())
                .elementIdentifier(getAttribute(element, "id"))
                .description(String.format("[%s] %s", category, description))
                .severityLevel(FormBug.SeverityLevel.valueOf(severity))
                .htmlSnippet(truncate(element.getAttribute("outerHTML"), MAX_HTML_SNIPPET_LENGTH))
                .build());
    }

    private String truncate(String value, int maxLength) {
        return value != null && value.length() > maxLength ?
                value.substring(0, maxLength) : value;
    }
}