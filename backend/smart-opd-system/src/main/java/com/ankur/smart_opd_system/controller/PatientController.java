package com.ankur.smart_opd_system.controller;

import com.ankur.smart_opd_system.entity.Patient;
import com.ankur.smart_opd_system.service.PatientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")

public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    public Patient createPatient(
                @RequestBody Patient patient) {

        return patientService.savePatient(patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {

        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public Optional<Patient> getPatientById(
            @PathVariable Long id) {

        return patientService.getPatientById(id);
    }

    @DeleteMapping("/{id}")
    public String deletePatient(
            @PathVariable Long id) {

        patientService.deletePatient(id);

        return "Patient Deleted Successfully";
    }
}