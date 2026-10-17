package com.ankur.smart_opd_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private Double consultationFee;

    private Double medicineCharge;

    private Double testCharge;

    private Double totalAmount;

    private String paymentStatus;


    public Bill() {
    }


    public Bill(Long id, String patientName,
                Double consultationFee,
                Double medicineCharge,
                Double testCharge,
                Double totalAmount,
                String paymentStatus) {
        this.id = id;
        this.patientName = patientName;
        this.consultationFee = consultationFee;
        this.medicineCharge = medicineCharge;
        this.testCharge = testCharge;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public Double getMedicineCharge() {
        return medicineCharge;
    }

    public void setMedicineCharge(Double medicineCharge) {
        this.medicineCharge = medicineCharge;
    }

    public Double getTestCharge() {
        return testCharge;
    }

    public void setTestCharge(Double testCharge) {
        this.testCharge = testCharge;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}