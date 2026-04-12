package com.pawfind.pawfind.services;

import com.pawfind.pawfind.models.User;
import com.pawfind.pawfind.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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

    // Save a new user - register
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Delete a user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
