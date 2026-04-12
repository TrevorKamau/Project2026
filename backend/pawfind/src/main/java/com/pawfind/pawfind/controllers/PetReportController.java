package com.pawfind.pawfind.controllers;

import com.pawfind.pawfind.models.PetReport;
import com.pawfind.pawfind.services.PetReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetReportController {

    @Autowired
    private PetReportService petReportService;

    // Get all pet reports
    @GetMapping
    public List<PetReport> getAllReports() {
        return petReportService.getAllReports();
    }

    // Get a single report by id
    @GetMapping("/{id}")
    public PetReport getReportById(@PathVariable Long id) {
        return petReportService.getReportById(id);
    }

    // Submit a new lost pet report
    @PostMapping("/report")
    public PetReport submitReport(@RequestBody PetReport petReport) {
        petReport.setStatus("LOST");
        return petReportService.saveReport(petReport);
    }

    // Update a report
    @PutMapping("/{id}")
    public PetReport updateReport(@PathVariable Long id, @RequestBody PetReport petReport) {
        return petReportService.updateReport(id, petReport);
    }

    // Delete a report - Admin only
    @DeleteMapping("/{id}")
    public void deleteReport(@PathVariable Long id) {
        petReportService.deleteReport(id);
    }

    // Get reports based on their status
    @GetMapping("/status/{status}")
    public List<PetReport> getByStatus(@PathVariable String status) {
        return petReportService.getReportsByStatus(status);
    }
}
