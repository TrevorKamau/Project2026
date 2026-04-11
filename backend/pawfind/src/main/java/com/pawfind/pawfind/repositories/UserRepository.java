package com.pawfind.pawfind.repositories;

import com.pawfind.pawfind.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their email - needed for login
    User findByEmail(String email);
}
