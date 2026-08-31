package com.ankur.smart_opd_system.repository;

import com.ankur.smart_opd_system.entity.Appointment;
import com.ankur.smart_opd_system.entity.Doctor;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {
                
                Optional<Appointment>
findTopByDoctorDoctorIdAndAppointmentDateOrderByTokenNoDesc(
        Long doctorId,
        LocalDate appointmentDate
);

                 List<Appointment> findByDoctorDoctorId(Long doctorId);
}