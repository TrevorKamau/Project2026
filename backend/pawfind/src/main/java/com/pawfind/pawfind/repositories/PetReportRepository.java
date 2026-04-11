package com.pawfind.pawfind.repositories;

import com.pawfind.pawfind.models.PetReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PetReportRepository extends JpaRepository<PetReport, Long> {

    // Find all reports made by a specific user
    List<PetReport> findByUserId(Long userId);

    // Find reports based on their status e.g. LOST, FOUND
    List<PetReport> findByStatus(String status);
}
