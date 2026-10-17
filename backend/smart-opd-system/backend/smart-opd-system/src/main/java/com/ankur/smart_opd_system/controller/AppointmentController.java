package com.ankur.smart_opd_system.controller;

import com.ankur.smart_opd_system.entity.Appointment;
import com.ankur.smart_opd_system.service.AppointmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")

public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
@PostMapping
public Appointment createAppointment(
        @RequestBody Appointment appointment) {


    if (appointment.getPatient() != null) {
        System.out.println("Patient ID = " +
                appointment.getPatient().getPatientId());
    } else {
        System.out.println("Patient is NULL");
    }

    if (appointment.getDoctor() != null) {
        System.out.println("Doctor ID = " +
                appointment.getDoctor().getDoctorId());
    } else {
        System.out.println("Doctor is NULL");
    }

    System.out.println("===== DEBUG =====");

    return appointmentService.saveAppointment(appointment);
}


@GetMapping("/doctor")
public List<Appointment> getDoctorAppointments(Authentication authentication) {

    String email = authentication.getName();

    return appointmentService.getDoctorAppointments(email);
}

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public Optional<Appointment> getAppointmentById(
            @PathVariable Long id) {

        return appointmentService.getAppointmentById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteAppointment(
            @PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return "Appointment Deleted Successfully";
    }
}