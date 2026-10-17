
package com.ankur.smart_opd_system.service;

import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.ankur.smart_opd_system.dto.LoginRequest;
import com.ankur.smart_opd_system.dto.LoginResponse;
import com.ankur.smart_opd_system.dto.RegisterRequest;
import com.ankur.smart_opd_system.entity.PasswordResetToken;
import com.ankur.smart_opd_system.entity.User;
import com.ankur.smart_opd_system.exception.BadRequestException;
import com.ankur.smart_opd_system.repository.PasswordResetTokenRepository;
import com.ankur.smart_opd_system.repository.UserRepository;
import com.ankur.smart_opd_system.security.JwtUtil;

@Service
public class AuthService {

    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final PasswordResetTokenRepository tokenRepository;
    private final MailService mailService;

    public AuthService(
            UserService userService,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            UserRepository userRepository,
            OtpService otpService,
            PasswordResetTokenRepository tokenRepository,
            MailService mailService) {

        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.tokenRepository = tokenRepository;
        this.mailService = mailService;
    }

    // REGISTER
    @Transactional
    public String register(RegisterRequest request) {

        if (request == null
                || !StringUtils.hasText(request.getEmail())) {
            throw new BadRequestException("Email is required.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "Email already exists. Please Login!");
        }

        User user = userService.register(request);

        otpService.generateAndSendOtp(user.getEmail());

        return "Check your email and enter your OTP";
    }

    // LOGIN
    public LoginResponse login(LoginRequest request) {

        if (request == null
                || !StringUtils.hasText(request.getEmail())
                || !StringUtils.hasText(request.getPassword())
                || !StringUtils.hasText(request.getRole())) {
            throw new BadRequestException(
                    "Email, password and role are required.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException(
                        "User not found. Please register!"));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid password");
        }

        if (!Objects.equals(user.getRole(), request.getRole())) {
            throw new BadRequestException("Invalid role selected");
        }

        if (!user.isVerified()) {
            throw new BadRequestException(
                    "Please verify your email first");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getRole(),
                user.getUsername(),
                user.getEmail()
        );
    }

// FORGOT PASSWORD
    @Transactional
    public String processForgotPassword(Map<String, String> request) {

        if (request == null
                || !StringUtils.hasText(request.get("email"))) {
            throw new BadRequestException("Email is required.");
        }

        String email = request.get("email").trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException(
                        "User not found with email: " + email));

        // Delete the existing reset token for this user
        tokenRepository.deleteByUser(user);

        // Ensure deletion happens before inserting the new token
        tokenRepository.flush();

        // Generate a new reset token
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken =
                new PasswordResetToken(token, user);

        // Save the new token
        tokenRepository.saveAndFlush(resetToken);

        // Generate the reset link
        String resetLink =
                "http://localhost:5173/reset-password?token=" + token;

        // Send the reset email
        mailService.sendResetEmail(user.getEmail(), resetLink);

        return "Reset link successfully sent to your email.";
    }



    // RESET PASSWORD
    @Transactional
    public String resetPassword(String token,String newPassword) {

        if (!StringUtils.hasText(token)) {
            throw new BadRequestException(
                    "Password reset token is required.");
        }

        if (!StringUtils.hasText(newPassword)) {
            throw new BadRequestException(
                    "New password is required.");
        }

        PasswordResetToken resetToken =
                tokenRepository.findByToken(token)
                        .orElseThrow(() -> new BadRequestException(
                                "Invalid password reset token."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);

            throw new BadRequestException(
                    "Reset token has expired. Please request a new one.");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
        tokenRepository.delete(resetToken);

        return "Password has been successfully updated!";
    }
}