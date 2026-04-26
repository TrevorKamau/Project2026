package com.pawfind.pawfind.repositories;

import com.pawfind.pawfind.models.PostFollower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Repo for managing email followers linked to pet reports 
public interface PostFollowerRepository extends JpaRepository<PostFollower, Long> {
    // Returns all follower records for specific report
    List<PostFollower> findByPetReportId(Long petReportId);
    // Checks if email is already following specific report
    boolean existsByPetReportIdAndEmail(Long petReportId, String email);

    // Removes a follower by pet report id and email
    @Modifying
    @Transactional
    void deleteByPetReportIdAndEmail(Long petReportId, String email);
}