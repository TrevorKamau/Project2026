console.log("PawFind loaded");

// Base URL for the backend
const API_URL = "http://localhost:8080";

// ── SUBMIT LOST PET REPORT ──
async function submitForm() {
    // check if user is logged in
    const loggedInUser = localStorage.getItem("user");
    if(!loggedInUser) {
        alert("You must log in first to proceed");
        return;
    }

    const user = JSON.parse(loggedInUser);

    const petReport = {
        user: { id: user.id },
        petName: document.getElementById("petName").value,
        species: document.getElementById("species").value,
        breed: document.getElementById("breed").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        colour: document.getElementById("colour").value,
        description: document.getElementById("description").value,
        area: document.getElementById("area").value,
        dateLost: document.getElementById("dateLost").value,
        locationDetails: document.getElementById("locationDetails").value
    };

    // Validation
    if (!petReport.petName || !petReport.species || !petReport.area || !petReport.dateLost) {
        alert("Please fill in all required fields!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/pets/report`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(petReport)
        });

        if (response.ok) {
            alert("Report has been submitted!");
            window.location.href = "lost-pets.html";
        } else {
            alert("Something went wrong. Please try again.");
        }
    } catch (error) {
        alert("Could not connect to server.");
        console.error(error);
    }
}

// TODO: Will send login details to the backend later
//function handleLogin() {
   // alert("Login clicked!");
//}
async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  } catch (error) {
    alert("Could not connect to server.");
  }
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
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
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

document.addEventListener("DOMContentLoaded", function() {
    const authLink = document.getElementById("auth-link");
    const loggedInUser = localStorage.getItem("user");

    if (loggedInUser && authLink) {
        const user = JSON.parse(loggedInUser);
        
        // Change "Login" to "Logout" after user logs in
        authLink.textContent = `Logout (${user.firstName})`;
        authLink.href = "#";
        
        authLink.onclick = function() {
            logout();
        };
    }
    loadRecentPets();
});

function checkAuth(event) {
    if (!localStorage.getItem("user")) {
        event.preventDefault(); // prevent user to click "report lost pet" before they are logged in
        alert("You must be logged in to report a pet!");
        window.location.href = "login.html";
    }
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  alert("Logged out successfully");
  window.location.href = "index.html";
}

async function loadRecentPets() {
    const petGrid = document.getElementById("pet-grid");
    if (!petGrid) return;

    try {
        const response = await fetch(`${API_URL}/api/pets`);
        const pets = await response.json();

        if (pets.length > 0) {
            petGrid.innerHTML = "";

            // Show only 3 most recent reports on the homepage
            const recentPets = pets.slice(-3).reverse();

            recentPets.forEach(pet => {
                const petCard = `
                <div class="pet-card">
                    <h3>${pet.petName}</h3>
                    <p><strong>Species:</strong> ${pet.species}</p>
                    <p><strong>Area:</strong> ${pet.area}</p>
                    <p><strong>Status:</strong> <span class="status-lost">${pet.status}</span></p>
                    <a href="pet-details.html?id=${pet.id}" class="btn-secondary">View Details</a>
                </div>
                `;
                petGrid.innerHTML += petCard;
            });
        }
    } catch (error) {
        console.error("Error loading list of lost pets", error);
    }
}

