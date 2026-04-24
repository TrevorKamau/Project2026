package com.pawfind.pawfind.services;

import com.pawfind.pawfind.models.PetReport;
import com.pawfind.pawfind.repositories.PetReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PetReportService {

    @Autowired
    private PetReportRepository petReportRepository;

    // Get all pet reports
    public List<PetReport> getAllReports() {
        return petReportRepository.findAll();
    }

    // Get a report by their id
    public PetReport getReportById(Long id) {
        return petReportRepository.findById(id).orElse(null);
    }

    // Save a new report
    public PetReport saveReport(PetReport petReport) {
        return petReportRepository.save(petReport);
    }

    // Update an existing report
    public PetReport updateReport(Long id, PetReport updatedReport) {
        PetReport existing = petReportRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setPetName(updatedReport.getPetName());
            existing.setSpecies(updatedReport.getSpecies());
            existing.setBreed(updatedReport.getBreed());
            existing.setAge(updatedReport.getAge());
            existing.setGender(updatedReport.getGender());
            existing.setColour(updatedReport.getColour());
            existing.setDescription(updatedReport.getDescription());
            existing.setArea(updatedReport.getArea());
            existing.setDateLost(updatedReport.getDateLost());
            existing.setLocationDetails(updatedReport.getLocationDetails());
            existing.setStatus(updatedReport.getStatus());
            return petReportRepository.save(existing);
        }
        return null;
    }
        // Mark a pet as found instead of deleting it
    public PetReport markAsFound(Long id) {
        PetReport petReport = petReportRepository.findById(id).orElse(null);

        if (petReport == null) {
            return null;
        }
        //SECURITY PLACEHOLDER, only creator of the post or admin should be allowed to mark the pet as found. For now anyone can.
        petReport.setStatus("FOUND");
        return petReportRepository.save(petReport);
    }

    // Delete a report
    public void deleteReport(Long id) {
        petReportRepository.deleteById(id);
    }

    // Get reports by status
    public List<PetReport> getReportsByStatus(String status) {
        return petReportRepository.findByStatus(status);
    }
}
