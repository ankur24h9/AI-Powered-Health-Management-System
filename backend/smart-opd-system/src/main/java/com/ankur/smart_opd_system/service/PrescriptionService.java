package com.ankur.smart_opd_system.service;

import com.ankur.smart_opd_system.entity.Patient;
import com.ankur.smart_opd_system.entity.Prescription;
import com.ankur.smart_opd_system.repository.PatientRepository;
import com.ankur.smart_opd_system.repository.PrescriptionRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository,
            PatientRepository patientRepository) {

        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
    }

    public Prescription savePrescription(
            Prescription prescription) {

        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(
            Long id) {

        return prescriptionRepository.findById(id);
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    // Get prescriptions of logged-in patient
    public List<Prescription> getMyPrescriptions(
            Authentication authentication) {

        String email = authentication.getName();

        Patient patient = patientRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        return prescriptionRepository
                .findByPatientPatientId(patient.getPatientId());
    }
}