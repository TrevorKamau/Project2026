package com.pawfind.pawfind.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// Service for sending emails using JavaMailSender & notifies users of any changes to the report (sighting etc)
@Service
public class EmailService {

    // Uses the mail sender from application.properties (currently is left blank but works)
    @Autowired
    private JavaMailSender mailSender;

    // Email itself that gets sent
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}