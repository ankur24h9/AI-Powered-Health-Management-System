package com.ankur.smart_opd_system.controller;

import com.ankur.smart_opd_system.entity.Prescription;
import com.ankur.smart_opd_system.service.PrescriptionService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(
            PrescriptionService prescriptionService) {

        this.prescriptionService = prescriptionService;
    }

    @PostMapping("/create_prescription")
    public Prescription createPrescription(
            @RequestBody Prescription prescription) {

        return prescriptionService.savePrescription(
                prescription);
    }

    @GetMapping("/get_All_Prescription")
    public List<Prescription> getAllPrescriptions() {

        return prescriptionService.getAllPrescriptions();
    }

    // Logged-in patient's prescriptions
    @GetMapping("/my-prescriptions")
    public List<Prescription> getMyPrescriptions(
            Authentication authentication) {

        return prescriptionService
                .getMyPrescriptions(authentication);
    }

    @GetMapping("/{id}")
    public Optional<Prescription> getPrescriptionById(
            @PathVariable Long id) {

        return prescriptionService
                .getPrescriptionById(id);
    }

    @DeleteMapping("/{id}")
    public String deletePrescription(
            @PathVariable Long id) {

        prescriptionService.deletePrescription(id);

        return "Prescription Deleted Successfully";
    }
}