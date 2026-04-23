package com.pawfind.pawfind.controllers;

import com.pawfind.pawfind.models.Sighting;
import com.pawfind.pawfind.services.SightingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.pawfind.pawfind.services.NotificationService;

@RestController
@RequestMapping("/api/sightings")
@CrossOrigin(origins = "*")
public class SightingController {

    @Autowired
    private SightingService sightingService;

    @Autowired
    private NotificationService notificationService;

    // Get all sightings
    @GetMapping
    public List<Sighting> getAllSightings() {
        return sightingService.getAllSightings();
    }

    // Get sightings for a specific pet report
    @GetMapping("/pet/{petReportId}")
    public List<Sighting> getSightingsByPet(@PathVariable Long petReportId) {
        return sightingService.getSightingsByPetReport(petReportId);
    }

    // Submit a new sighting (does not require login) 
    // Add notifications for Creator & Followers (still requires no login)
    // Also where the email notification is triggered from via service layer
    @PostMapping
    public Sighting submitSighting(@RequestBody Sighting sighting) {
        Sighting savedSighting = sightingService.saveSighting(sighting);

        if (savedSighting.getPetReport() != null) {
            notificationService.notifyNewSighting(
                    savedSighting.getPetReport(),
                    savedSighting.getLocation(),
                    savedSighting.getDescription()
            );
        }
        
        return sightingService.saveSighting(sighting);
    }

    // Delete a sighting (available only for admin)
    @DeleteMapping("/{id}")
    public void deleteSighting(@PathVariable Long id) {
        sightingService.deleteSighting(id);
    }
}
