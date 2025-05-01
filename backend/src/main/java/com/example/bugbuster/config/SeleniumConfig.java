package com.example.bugbuster.config;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import jakarta.annotation.PreDestroy;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class SeleniumConfig {

    @Value("${selenium.headless:true}")
    private boolean headless;

    @Value("${selenium.timeout.seconds:30}")
    private int timeoutSeconds;

    @Value("${selenium.chromedriver.path:src/main/resources/drivers/chromedriver.exe}")
    private String chromeDriverPath;

    private final Map<String, WebDriver> drivers = new HashMap<>();

    @Bean
    @Scope("prototype") // Important change - creates new instance each time
    public WebDriver webDriver() {
        System.setProperty("webdriver.chrome.driver", chromeDriverPath);

        ChromeOptions options = new ChromeOptions();
        options.addArguments(
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--remote-allow-origins=*",
                "--disable-gpu",
                "--window-size=1920,1080"
        );

        if (headless) {
            options.addArguments("--headless=new");
        }

        WebDriver driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(timeoutSeconds));
        driver.manage().window().maximize();

        return driver;
    }

    @PreDestroy
    public void cleanup() {
        drivers.values().forEach(WebDriver::quit);
        drivers.clear();
    }
}