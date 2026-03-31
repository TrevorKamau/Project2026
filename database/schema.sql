-- Lost Pet Reporting System
-- Database Schema

CREATE DATABASE IF NOT EXISTS lost_pet_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

SELECT database();
USE lost_pet_db;
SELECT database();
SHOW tables;

-- Users table
CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('OWNER', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pet reports table
CREATE TABLE IF NOT EXISTS pet_reports (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    pet_name VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    breed VARCHAR(100),
    age VARCHAR(50),
    gender VARCHAR(20),
    colour VARCHAR(100),
    description TEXT,
    area VARCHAR(255),
    date_lost DATE,
    location_details VARCHAR(255),
    photo VARCHAR(255),
    status ENUM('LOST', 'SIGHTING', 'FOUND') DEFAULT 'LOST',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sightings table
CREATE TABLE IF NOT EXISTS sightings (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pet_report_id INT UNSIGNED NOT NULL,
    location VARCHAR(255),
    date_seen DATE,
    time_seen TIME,
    description TEXT,
    photo VARCHAR(255),
    reporter_name VARCHAR(100),
    reporter_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_report_id) REFERENCES pet_reports(id)
);

-- Automatically update pet status when a sighting is added
DELIMITER //
CREATE TRIGGER update_status_on_sighting
AFTER INSERT ON sightings
FOR EACH ROW
BEGIN
	UPDATE pet_reports
    SET status = 'SIGHTING'
    WHERE id = NEW.pet_report_id;
END //
DELIMITER ;
