package com.ankur.smart_opd_system.repository;

import com.ankur.smart_opd_system.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {
}