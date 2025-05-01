package com.example.bugbuster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class BugBusterApplication {
	public static void main(String[] args) {
		SpringApplication.run(BugBusterApplication.class, args);
	}

}