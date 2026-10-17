package com.ankur.smart_opd_system.controller;

import com.ankur.smart_opd_system.entity.Bill;
import com.ankur.smart_opd_system.service.BillService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin("*")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping("/create-bill")
    public Bill createBill(@RequestBody Bill bill) {

        return billService.saveBill(bill);
    }

    @GetMapping("/get_all_bills")
    public List<Bill> getAllBills() {

        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public Optional<Bill> getBillById(
            @PathVariable Long id) {
        return billService.getBillById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteBill(
            @PathVariable Long id) {

        billService.deleteBill(id);

        return "Bill Deleted Successfully";
    }
}