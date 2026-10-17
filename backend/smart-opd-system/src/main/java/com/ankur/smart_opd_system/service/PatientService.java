package com.ankur.smart_opd_system.service;

import java.util.List;
import java.util.Optional;

import com.ankur.smart_opd_system.exception.ResourceNotFoundException;
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


    public  List<Patient> getAllPatients() {
        return patientRepository.findByActiveTrue();
    }

    public Patient updatePatient(Long id, Patient patientReq){
        Optional<Patient> existingPatient = patientRepository.findById(id);
        if(existingPatient.isEmpty()){
            return null;
        }
        Patient patientToSave = existingPatient.get();
        patientToSave.setFirstName(patientReq.getFirstName());
        patientToSave.setLastName(patientReq.getLastName());
        patientToSave.setEmail(patientReq.getEmail());
        patientToSave.setAge(patientReq.getAge());
        patientToSave.setGender(patientReq.getGender());
        patientToSave.setAddress(patientReq.getAddress());
        patientToSave.setBloodGroup(patientReq.getBloodGroup());
        patientToSave.setEmergencyContact(patientReq.getEmergencyContact());
        patientToSave.setPhone(patientReq.getPhone());
        return patientRepository.save(patientToSave);
    }


    public Patient getPatientById(Long id) {
        Patient patientResponse = patientRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Patient with id " + id + "not found"));
        return patientRepository.save(patientResponse);

    }


    public boolean deletePatient(Long id) {

        Optional<Patient> patient = patientRepository.findById(id);

        if (patient.isEmpty()) {
            return false;
        }

        Patient existingPatient = patient.get();

        existingPatient.setActive(false);

        patientRepository.save(existingPatient);

        return true;
    }
}