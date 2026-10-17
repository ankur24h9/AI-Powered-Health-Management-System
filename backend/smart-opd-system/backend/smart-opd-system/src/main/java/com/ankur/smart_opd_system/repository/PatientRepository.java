package com.ankur.smart_opd_system.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ankur.smart_opd_system.entity.Patient;
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
}