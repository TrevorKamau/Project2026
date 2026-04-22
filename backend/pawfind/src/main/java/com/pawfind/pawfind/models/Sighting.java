package com.pawfind.pawfind.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "sightings")
public class Sighting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_report_id")
    private PetReport petReport;

    private String location;
    private LocalDate dateSeen;
    private LocalTime timeSeen;
    private String description;
    private String photo;
    private String reporterName;
    private String reporterContact;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // GPS coordinates
    private Double latitude;
    private Double longitude;

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PetReport getPetReport() { return petReport; }
    public void setPetReport(PetReport petReport) { this.petReport = petReport; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDateSeen() { return dateSeen; }
    public void setDateSeen(LocalDate dateSeen) { this.dateSeen = dateSeen; }

    public LocalTime getTimeSeen() { return timeSeen; }
    public void setTimeSeen(LocalTime timeSeen) { this.timeSeen = timeSeen; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterContact() { return reporterContact; }
    public void setReporterContact(String reporterContact) { this.reporterContact = reporterContact; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
