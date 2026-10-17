package com.ankur.smart_opd_system.service;

import com.ankur.smart_opd_system.entity.Medicine;
import com.ankur.smart_opd_system.repository.MedicineRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(
            MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    public Medicine saveMedicine(
            Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Optional<Medicine> getMedicineById(
            Long id) {
        return medicineRepository.findById(id);
    }

    public Medicine updateMedicine(
            Long id,
            Medicine medicineDetails) {

        Medicine medicine =
                medicineRepository.findById(id)
                .orElseThrow();

        medicine.setMedicineName(
                medicineDetails.getMedicineName());

        medicine.setManufacturer(
                medicineDetails.getManufacturer());

        medicine.setPrice(
                medicineDetails.getPrice());

        medicine.setStock(
                medicineDetails.getStock());

        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
}