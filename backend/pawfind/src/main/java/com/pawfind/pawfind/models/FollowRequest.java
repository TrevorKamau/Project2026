package com.pawfind.pawfind.models;

// Request object used for when a user enters email to follow a post
// Only contains email field from frontend

public class FollowRequest {
    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}