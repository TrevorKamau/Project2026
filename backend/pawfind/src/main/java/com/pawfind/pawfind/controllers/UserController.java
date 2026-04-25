package com.pawfind.pawfind.controllers;

import com.pawfind.pawfind.models.User;
import com.pawfind.pawfind.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Get all users (Available only for admin)
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get a user by id
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Register a new user
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setRole("OWNER");
        User saved = userService.saveUser(user);
        saved.setPassword(null); // never send the hash to the browser
        return saved;
    }

    // Delete a user - admin only
    @DeleteMapping("/{id}")
    public void deleteuser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginDetails) {
        User user = userService.login(loginDetails.getEmail(), loginDetails.getPassword());

        if (user != null) {
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        if (updatedUser != null) {
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}