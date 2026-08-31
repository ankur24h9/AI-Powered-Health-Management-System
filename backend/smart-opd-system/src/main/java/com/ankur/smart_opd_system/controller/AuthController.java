package com.ankur.smart_opd_system.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ankur.smart_opd_system.dto.LoginRequest;
import com.ankur.smart_opd_system.dto.LoginResponse;
import com.ankur.smart_opd_system.dto.RegisterRequest;
import com.ankur.smart_opd_system.entity.PasswordResetToken;
import com.ankur.smart_opd_system.entity.User;
import com.ankur.smart_opd_system.repository.PasswordResetTokenRepository;
import com.ankur.smart_opd_system.repository.UserRepository;
import com.ankur.smart_opd_system.security.JwtUtil;
import com.ankur.smart_opd_system.service.MailService;
import com.ankur.smart_opd_system.service.OtpService;
import com.ankur.smart_opd_system.service.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;
    

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private MailService mailService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists. Please Login!");
        }

        User user = userService.register(request);
        otpService.generateAndSendOtp(user.getEmail());

        return ResponseEntity.ok("Check your email and enter your OTP");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found. Please register ! ");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }
        if (!user.getRole().equals(request.getRole())) {
            return ResponseEntity.badRequest().body("Invalid role selected");
        }
        if (!user.isVerified()) {
            return ResponseEntity.badRequest().body("Please verify your email first");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(
                new LoginResponse(token, user.getRole(), user.getUsername(), user.getEmail())
        );
    }
@PostMapping("/forgot-password")
public ResponseEntity<?> processForgotPassword(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    
    User user = userRepository.findByEmail(email).orElse(null);
    if (user == null) {
        return ResponseEntity.badRequest().body("User not found with email: " + email);
    }

    tokenRepository.findByUser(user).ifPresent(oldToken -> tokenRepository.delete(oldToken));

    String token = UUID.randomUUID().toString();
    PasswordResetToken resetToken = new PasswordResetToken(token, user);
    tokenRepository.save(resetToken);

    String resetLink = "http://localhost:5173/reset-password?token=" + token;
    mailService.sendResetEmail(user.getEmail(), resetLink);

    return ResponseEntity.ok("Reset link successfully sent to your email.");
}

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestBody String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

        if (resetToken == null) {
            return ResponseEntity.badRequest().body("Invalid password reset token.");
        }

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body("Reset token has expired. Please request a new one.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Password has been successfully updated!");
    }
}
