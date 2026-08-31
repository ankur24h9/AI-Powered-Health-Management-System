package com.ankur.smart_opd_system.repository;

import com.ankur.smart_opd_system.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository
        extends JpaRepository<Bill, Long> {
}