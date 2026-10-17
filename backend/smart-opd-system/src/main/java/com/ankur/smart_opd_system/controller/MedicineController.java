
package com.ankur.smart_opd_system.controller;

import com.ankur.smart_opd_system.entity.Medicine;
import com.ankur.smart_opd_system.service.MedicineService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")

public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(
            MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @PostMapping("/create-Med")
    public Medicine createMedicine(
            @RequestBody Medicine medicine) {
        return medicineService.saveMedicine(medicine);
    }

    @GetMapping("/get_all_med")
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public Optional<Medicine> getMedicineById(
            @PathVariable Long id) {
        return medicineService.getMedicineById(id);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine) {

        return medicineService.updateMedicine(
                id, medicine);
    }

    @DeleteMapping("/{id}")
    public String deleteMedicine(
            @PathVariable Long id) {

        medicineService.deleteMedicine(id);

        return "Medicine Deleted Successfully";
    }
}