package com.ankur.smart_opd_system.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        
        return "Smart OPD Backend Running Successfully";
    }
}