package com.ankur.smart_opd_system.repository;

import com.ankur.smart_opd_system.entity.User;
import com.ankur.smart_opd_system.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    
    // Add this line to find old tokens by the User instance
    Optional<PasswordResetToken> findByUser(User user);
}