package com.ankur.smart_opd_system.controller;

import com.ankur.smart_opd_system.dto.OtpRequest;
import com.ankur.smart_opd_system.dto.VerifyOtpRequest;
import com.ankur.smart_opd_system.service.OtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public String sendOtp(
            @RequestBody OtpRequest request) {

        otpService.generateAndSendOtp(
                request.getEmail());

        return "OTP Sent Successfully";
    }

    @PostMapping("/verify")
    public String verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        boolean verified =
                otpService.verifyOtp(
                        request.getEmail(),
                        request.getOtp());

        if (verified) {
            return "OTP Verified Successfully";
        }

        return "Invalid OTP";
    }
}
