package com.ankur.smart_opd_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender; 

    public void sendOtp(String email, String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Smart OPD OTP Verification");
        message.setText("Your OTP is: " +otp);
        mailSender.send(message);
    }
    public void sendResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Smart OPD Password Reset Request");
        message.setText("Click the link below to reset your password. This link expires in 15 minutes:\n\n" + resetLink);
        
        mailSender.send(message);
    }
}