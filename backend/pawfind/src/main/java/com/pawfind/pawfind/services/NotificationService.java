package com.pawfind.pawfind.services;

import com.pawfind.pawfind.models.PetReport;
import com.pawfind.pawfind.models.PostFollower;
import com.pawfind.pawfind.repositories.PostFollowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// Handles sending notifications for changes in report
@Service
public class NotificationService {

    // Service used to actually send emails
    @Autowired
    private EmailService emailService;

    // Repo from which all users following a specific report are retrieved from
    @Autowired
    private PostFollowerRepository postFollowerRepository;

    // Send email TO original creator (if notifications are on) & ALL users who followed the post via email notifications
    public void notifyNewSighting(PetReport petReport, String location, String description) { 
        String subject = "PawFind Update: New sighting for " + petReport.getPetName();
        String body = "There has been a new sighting reported for " + petReport.getPetName() + ".\n\n"
                + "Location: " + location + "\n"
                + "Details: " + description + "\n\n"
                + "Check the post for more details.";
     
        // Email for creator
        if (Boolean.TRUE.equals(petReport.getCreatorNotificationsEnabled())
                && petReport.getCreatorEmail() != null
                && !petReport.getCreatorEmail().isBlank()) {
            emailService.sendEmail(petReport.getCreatorEmail(), subject, body);
        }

        // Email for followers
        List<PostFollower> followers = postFollowerRepository.findByPetReportId(petReport.getId());
        for (PostFollower follower : followers) {
            if (follower.getEmail() != null && !follower.getEmail().isBlank()
                    && !follower.getEmail().equalsIgnoreCase(petReport.getCreatorEmail())) {
                emailService.sendEmail(follower.getEmail(), subject, body);
            }
        }
    }
}