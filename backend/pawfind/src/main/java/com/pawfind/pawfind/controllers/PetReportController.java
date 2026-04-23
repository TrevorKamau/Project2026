package com.pawfind.pawfind.controllers;

import com.pawfind.pawfind.models.PetReport;
import com.pawfind.pawfind.services.PetReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import com.pawfind.pawfind.models.FollowRequest;
import com.pawfind.pawfind.models.PostFollower;
import com.pawfind.pawfind.repositories.PostFollowerRepository;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetReportController {

    @Autowired
    private PetReportService petReportService;

    // Repo for managing users who follow post via email
    @Autowired
    private PostFollowerRepository postFollowerRepository;

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

    // Submit a new lost pet report / Changed default email notifcations to enabled for creator
    @PostMapping("/report")
    public ResponseEntity<PetReport> submitReport(@RequestBody PetReport petReport) {
        // Automatically set status to "lost" when report is submitted
        petReport.setStatus("LOST");

        // If notifications are not specifically disabled, enable them by default
         if (petReport.getCreatorNotificationsEnabled() == null) {
        petReport.setCreatorNotificationsEnabled(true);
        }
        // Save to database
        PetReport savedReport = petReportService.saveReport(petReport);
        return ResponseEntity.ok(savedReport);
    }

    // Follow the post for notifications
    @PostMapping("/{id}/follow")
    public ResponseEntity<String> followPost(@PathVariable Long id, @RequestBody FollowRequest request) {
        // Get ID of the pet report being followed
        PetReport petReport = petReportService.getReportById(id);

        // Make sure that a email WAS provided
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        // Prevents the same email from following the same post
        boolean alreadyExists = postFollowerRepository.existsByPetReportIdAndEmail(id, request.getEmail());
        if (alreadyExists) {
            return ResponseEntity.ok("You are already following this post.");
        }

        // New foollower record
        PostFollower follower = new PostFollower();
        follower.setPetReport(petReport);
        follower.setEmail(request.getEmail());

        // Save follower to database
        postFollowerRepository.save(follower);
        return ResponseEntity.ok("Followed successfully.");
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
