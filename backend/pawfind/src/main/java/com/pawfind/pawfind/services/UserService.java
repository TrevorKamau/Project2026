package com.pawfind.pawfind.services;

import com.pawfind.pawfind.models.PetReport;
import com.pawfind.pawfind.models.User;
import com.pawfind.pawfind.repositories.PetReportRepository;
import com.pawfind.pawfind.repositories.PostFollowerRepository;
import com.pawfind.pawfind.repositories.SightingRepository;
import com.pawfind.pawfind.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PetReportRepository petReportRepository;

    @Autowired
    private SightingRepository sightingRepository;

    @Autowired
    private PostFollowerRepository postFollowerRepository;

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get a user based on their id
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Get a user by email - for login
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Save a new user - register (hashes password before storing)
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Delete a user and all their associated data
    public void deleteUser(Long id) {
        // Get all pet reports belonging to this user
        List<PetReport> userReports = petReportRepository.findByUserId(id);

        for (PetReport report : userReports) {
            // Delete sightings linked to each report
            sightingRepository.deleteAll(sightingRepository.findByPetReportId(report.getId()));
            // Delete followers linked to each report
            postFollowerRepository.deleteAll(postFollowerRepository.findByPetReportId(report.getId()));
        }

        // Delete all the user's pet reports
        petReportRepository.deleteAll(userReports);

        // Finally delete the user
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());

            // Only update password if a new one is provided — hash it before storing
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }

            return userRepository.save(user);
        }
        return null;
    }
}