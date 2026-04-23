package com.pawfind.pawfind.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Stores email subscriptions for specific pet report
// Notify users when there's an update (push email notifications for sightings etc)
@Entity
@Table(name = "post_followers")
public class PostFollower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The pet report this email is following
    @ManyToOne
    @JoinColumn(name = "pet_report_id")
    private PetReport petReport;

    // Email address of post follower (does not require an account)
    private String email;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PetReport getPetReport() { return petReport; }
    public void setPetReport(PetReport petReport) { this.petReport = petReport; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}