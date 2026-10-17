package com.ankur.smart_opd_system.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ankur.smart_opd_system.entity.Patient;
import com.ankur.smart_opd_system.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }


    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}