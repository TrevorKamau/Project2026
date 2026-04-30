## 🐾 PawFind — Lost Pet Reporting System

PawFind is a community-driven web application that helps reunite lost pets with their owners. Users can report missing pets, submit sightings with GPS coordinates (or manually type in details: area, time, date etc.), follow posts for email notifications and celebrate reunions on the Wall of Hope.
##
## Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Java 25
- Spring Boot

### Database
- MySQL (hosted on Railway)
<img width="1918" height="863" alt="Screenshot 2026-04-30 212932" src="https://github.com/user-attachments/assets/53cb882c-2811-4432-8dcc-e6c1a788311e" />

##
## Prerequisites
Before running the project, make sure you have the following installed:

- Java 25
- Maven
- VS Code with the Live Server extension
- An IDE for Java such as IntelliJ IDEA
##
## How to Run

### 1. Clone the repository
```
git clone https://github.com/your-username/Project2026.git
cd Project2026
```

### 2. Start the backend
Open the backend/pawfind folder in intelliJ IDEA (or your preferred Java IDE)

Run the main application class:
```
src/main/java/com/pawfind/pawfind/PawfindApplication.java
```
The backend will start on http://localhost:8080

You can verify it is running by visiting http://localhost:8080/api/pets

### 3. Start the frontend
Open the project's root folder in VS Code.

Right click on index.html and select "Open with Live Server"

The app will open in your browser at http://127.0.0.1:5500

##
## Features
- **Report a lost pet** — submit details including species, breed, area, and date lost
- **Browse lost pets** — filter by name, breed, area, species and date range
-  **Report a sighting** — pin your GPS location and notify the pet's owner automatically
-  **Follow a post** — get email notifications when a new sighting is reported (email notifications via Gmail SMTP)
-  **Mark as found** — move a reunited pet to the Wall of Hope
-  **Wall of Hope** — a gallery of successfully reunited pets
-  **User accounts** — register, login, update profile, change password
-  **Unfollow a post** - remove yourself from email notifications
-  **Print a poster** - generate a printable missing pet poster for any report
-  **Vets & Shelters map** - embedded map of local vets and shelters in Galway
-  **Delete account** - permanently removes account and all associated reports
-  **Delete report** - owner can remove their own pet listing

##
## Email Notifications
Email notifications are implemented and working via Gmail SMTP.
To enable them, open:

backend/pawfind/src/main/resources/application.properties

And update lines 18 and 19 with your own Gmail credentials:
<img width="1256" height="566" alt="Screenshot 2026-04-30 210507" src="https://github.com/user-attachments/assets/b8480f02-e1df-4bec-b216-16d44ce84d14" />

NOTE: Use a Gmail App password, not your regular Gmail password.


##
## Project Structure
```
Project2026/
├── index.html              # Home page
├── lost-pets.html          # Browse lost pets
├── pet-details.html        # Individual pet report
├── report.html             # Submit a lost pet report
├── sightings.html          # Report a sighting
├── wall-of-hope.html       # Reunited pets gallery
├── resources-map.html      # Vets & shelters map
├── login.html              # Login
├── register.html           # Register
├── settings.html           # User profile settings
├── css/
│   └── style.css
├── js/
│   └── main.js
├── database/
│   └── schema.sql          # Database schema reference
└── backend/
    └── pawfind/            # Spring Boot application
        └── src/main/java/com/pawfind/pawfind/
            ├── controllers/
            ├── services/
            ├── repositories/
            └── models/
```
