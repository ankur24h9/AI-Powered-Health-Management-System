package com.ankur.smart_opd_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;      
import com.ankur.smart_opd_system.entity.Doctor;

public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {
              Optional<Doctor> findByEmail(String email);
}