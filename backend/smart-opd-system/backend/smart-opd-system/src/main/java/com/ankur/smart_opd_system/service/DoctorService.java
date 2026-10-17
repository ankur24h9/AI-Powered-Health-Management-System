package com.ankur.smart_opd_system.service;

import com.ankur.smart_opd_system.entity.Doctor;
import com.ankur.smart_opd_system.entity.User;
import com.ankur.smart_opd_system.repository.DoctorRepository;
import com.ankur.smart_opd_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

   public Doctor saveDoctor(Doctor doctor) {

    User user = userRepository.findByEmail(doctor.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    doctor.setUser(user);

    return doctorRepository.save(doctor);
}

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}