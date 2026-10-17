package com.ankur.smart_opd_system.controller;
import com.ankur.smart_opd_system.entity.Patient;
import com.ankur.smart_opd_system.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    @GetMapping("/getAll")
    public ResponseEntity<List<Patient>>getAllPatients() {

        List<Patient> list=patientService.getAllPatients();
        if(list.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(list);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientReq){

        Patient patientResp = patientService.updatePatient(id,patientReq);
        if(patientResp==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(patientResp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id) {
        Patient patientRes = patientService.getPatientById(id);

        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {

        boolean deleted = patientService.deletePatient(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Patient deactivated successfully");
    }

}