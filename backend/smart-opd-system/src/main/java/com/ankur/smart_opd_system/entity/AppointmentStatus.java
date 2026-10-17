package com.ankur.smart_opd_system.entity;

public enum AppointmentStatus {
    PENDING,
    CONSULTING,
    COMPLETED,
    CANCELLED;

    public static String getStatus(String consulting) {

        return consulting;
    }
}
