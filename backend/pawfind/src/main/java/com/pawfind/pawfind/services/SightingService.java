package com.pawfind.pawfind.services;

import com.pawfind.pawfind.models.Sighting;
import com.pawfind.pawfind.repositories.SightingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SightingService {

    @Autowired
    private SightingRepository sightingRepository;

    // Get all sightings
    public List<Sighting> getAllSightings() {
        return sightingRepository.findAll();
    }

    // Get sightings for a specific pet report
    public List<Sighting> getSightingsByPetReport(Long petReportId) {
        return sightingRepository.findByPetReportId(petReportId);
    }

    // Save a new sighting
    public Sighting saveSighting(Sighting sighting) {
        return sightingRepository.save(sighting);
    }

    // Delete a sighting
    public void deleteSighting(Long id) {
        sightingRepository.deleteById(id);
    }
}
