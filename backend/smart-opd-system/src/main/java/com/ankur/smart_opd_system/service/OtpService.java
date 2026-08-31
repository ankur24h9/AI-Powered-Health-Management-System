package com.ankur.smart_opd_system.service;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ankur.smart_opd_system.entity.OtpVerification;
import com.ankur.smart_opd_system.entity.User;
import com.ankur.smart_opd_system.repository.OtpRepository;
import com.ankur.smart_opd_system.repository.UserRepository;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;
    @Autowired
private UserRepository userRepository;

    @Autowired
    private MailService mailService;

    public void generateAndSendOtp(String email) {

String otp = String.valueOf(100000 + new Random().nextInt(900000) );

        Optional<OtpVerification> existing =
                otpRepository.findByEmail(email);

        OtpVerification otpData =
                existing.orElse(new OtpVerification());

        otpData.setEmail(email);
        otpData.setOtp(otp);

        otpData.setExpiryTime(
                System.currentTimeMillis() + (5 * 60 * 1000)
        );

        otpRepository.save(otpData);

        mailService.sendOtp(email, otp);
    }

public boolean verifyOtp(
        String email,
        String otp) {

    Optional<OtpVerification> otpData =
            otpRepository.findByEmail(email);

    if (otpData.isEmpty()) {
        return false;
    }

    OtpVerification data = otpData.get();

    
    System.out.println("Email = " + email);
    System.out.println("OTP in DB = " + data.getOtp());
    System.out.println("OTP entered = " + otp);
    System.out.println("Current Time = " + System.currentTimeMillis());
    System.out.println("Expiry Time = " + data.getExpiryTime());
    

    if (System.currentTimeMillis()
            > data.getExpiryTime()) {
        return false;
    }

    if (!data.getOtp().equals(otp)) {
        return false;
    }

    User user = userRepository.findByEmail(email)
            .orElse(null);

    if (user != null) {
        user.setVerified(true);
        userRepository.save(user);
    }


    return true;
}
}