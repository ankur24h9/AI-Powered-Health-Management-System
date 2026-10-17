package com.ankur.smart_opd_system.repository;

import com.ankur.smart_opd_system.entity.Appointment;
import com.ankur.smart_opd_system.entity.Doctor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {
                 Appointment findTopByDoctorDoctorIdAndAppointmentDateOrderByTokenNoDesc(
            Long doctorId,
            LocalDate appointmentDate
    );

                 List<Appointment> findByDoctorDoctorId(Long doctorId);
}