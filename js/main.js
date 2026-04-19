console.log("PawFind loaded");

// Base URL for the backend
const API_URL = "http://localhost:8080";

// TODO: This will send the form data to the backend later
function submitForm() {
    alert("Report has been submitted!");
}

// TODO: Will send login details to the backend later
function handleLogin() {
    alert("Login clicked!");
}

// ── REGISTER ──
function Register() {
    const user = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value
    };

    // Check if passwords match
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (user.password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Ensure required fields are filled in
    if (!user.firstName || !user.lastname || !user.email || !user.password) {
        alert("Please fill in all required fields!");
        return;
    }

    // TODO: Send to Spring Boot
    fetch(API_URL + "/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        alert("Account has been created successfully! Please login.");
        window.location.href = "login.html";
    })
    .catch(error => {
        alert("Something went wrong. Please try again.");
        console.error(error);
    });
}

// TODO: Will send this data to the backend later
function submitSighting() {
    alert("Sighting submitted!");
}