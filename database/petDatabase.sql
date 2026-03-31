CREATE DATABASE IF NOT EXISTS pet_system;

USE pet_system;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(50)
);

CREATE TABLE pet_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  pet_name VARCHAR(100),
  description TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (email, password, role)
VALUES ('user@test.com', 'password', 'USER');

INSERT INTO pet_reports (user_id, pet_name, description, status)
VALUES (1, 'Max', 'Brown dog missing', 'LOST');

-- Status updates
UPDATE pet_reports
SET status = 'FOUND'
WHERE id = 1;

UPDATE pet_reports
SET status = 'APPROVED'
WHERE id = 1;

-- test
SELECT * FROM pet_reports
WHERE status = 'LOST';