package com.pawfind.pawfind.repositories;

import com.pawfind.pawfind.models.Sighting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SightingRepository extends JpaRepository<Sighting, Long> {

    // Find sightings for a specific pet report
    List<Sighting> findByPetReportId(Long petReportId);
}
