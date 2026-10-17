package com.ankur.smart_opd_system.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import com.ankur.smart_opd_system.entity.Patient;

import java.util.List;
import java.util.Optional;

@Component
public  interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByActiveTrue();
    Optional<Patient> findByEmail(String email);

}