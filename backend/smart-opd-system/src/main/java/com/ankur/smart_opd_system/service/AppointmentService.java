package com.ankur.smart_opd_system.service;

import com.ankur.smart_opd_system.entity.Appointment;
import com.ankur.smart_opd_system.entity.AppointmentStatus;
import com.ankur.smart_opd_system.entity.Doctor;
import com.ankur.smart_opd_system.repository.AppointmentRepository;
import com.ankur.smart_opd_system.repository.DoctorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;


    public Appointment saveAppointment(Appointment appointment) {

        Integer token = generateToken(
                appointment.getDoctor().getDoctorId(),
                appointment.getAppointmentDate()
        );

        appointment.setTokenNo(token);

        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }


    private Integer generateToken(Long doctorId, LocalDate date) {

          System.out.println("Doctor ID = " + doctorId);
          System.out.println("Appointment Date = " + date);

        Optional<Appointment> lastAppointment =
                appointmentRepository
                        .findTopByDoctorDoctorIdAndAppointmentDateOrderByTokenNoDesc(
                                doctorId,
                                date
                        );

        if (lastAppointment.isEmpty()) {
            return 1;
        }

        return lastAppointment.get().getTokenNo() + 1;
    }


    public List<Appointment> getDoctorAppointments(String email) {

        System.out.println("Logged-in email = " + email);

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("Doctor not found")
                );

        return appointmentRepository
                .findByDoctorDoctorId(doctor.getDoctorId());
    }


    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }


    public Optional<Appointment> getAppointmentById(Long id) {

        return appointmentRepository.findById(id);
    }


    public void deleteAppointment(Long id) {

        appointmentRepository.deleteById(id);
    }
}