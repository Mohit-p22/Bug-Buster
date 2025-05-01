package com.example.bugbuster.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/testing")
public class TestController {


    @GetMapping("/test")
    public String testConnection(){
        return "Heloooo";
    }

}
