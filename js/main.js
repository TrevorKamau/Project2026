console.log("PawFind loaded");

// Base URL for the backend
const API_URL = "http://localhost:8080";

let allPets = [];

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

// ── LOGIN ── 
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

// ── Sighting report ──
async function submitSighting() {
    const urlParams = new URLSearchParams(window.location.search);
    let petId = urlParams.get('id');

    if (!petId) {
        const dropdown = document.getElementById("petReport");
        if (dropdown) petId = dropdown.value;
    }

    if (!petId || petId === "") {
        alert("Please select which pet you saw.");
        return;
    }

    const sighting = {
        petReport: { id: parseInt(petId) },
        location: document.getElementById("location").value,
        description: document.getElementById("sightingDescription").value,
        reporterName: document.getElementById("reporterName").value,
        reporterContact: document.getElementById("reporterContact").value,
        latitude: document.getElementById("lat").value || null,
        longitude: document.getElementById("lng").value || null,
        dateSeen: document.getElementById("date").value || new Date().toISOString().split('T')[0],
        timeSeen: document.getElementById("time").value || new Date().toTimeString().split(' ')[0].substring(0, 5)
    };

    try {
        // Send the POST request to the sightings controller
        const response = await fetch(`${API_URL}/api/sightings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sighting)
        });

        if (response.ok) {
            alert("Sighting reported! Thank you for your contribution.");
            location.reload();
        }
    } catch (error) {
        console.error("Error submitting sighting:", error);
    }
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
    loadRecentPets(); // show latest 3 missing pets
    loadAllPets(); // show everything in lost pets tab including filters
    populatePetDropdown();
});

function checkAuth(event) {
    if (!localStorage.getItem("user")) {
        event.preventDefault(); // prevent user to click "report lost pet" before they are logged in
        alert("You must be logged in to report a pet!");
        window.location.href = "login.html";
    }
}

// ── LOGOUT ──
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

async function loadPetDetails() {
    const contentDiv = document.getElementById("pet-details-content");
    if (!contentDiv) return;

    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');

    if (!petId) {
        contentDiv.innerHTML = "<h2>No pet ID found.</h2>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/pets/${petId}`);
        if (!response.ok) throw new Error("Pet not found");

        const pet = await response.json();

        contentDiv.innerHTML = `
            <div class="details-card">
                <h1>${pet.petName}</h1>
                <div class="status-badge">${pet.status}</div>
                <hr>
                <p><strong>Species:</strong> ${pet.species}</p>
                <p><strong>Breed:</strong> ${pet.breed}</p>
                <p><strong>Gender:</strong> ${pet.gender}</p>
                <p><strong>Color:</strong> ${pet.colour}</p>
                <p><strong>Date Lost:</strong> ${pet.dateLost}</p>
                <p><strong>Area:</strong> ${pet.area}</p>
                <p><strong>Specific Location:</strong> ${pet.locationDetails}</p>
                <div class="description-box">
                    <h3>Description</h3>
                    <p>${pet.description}</p>
                </div>
            </div>
        `;

        loadSightings(petId);

    } catch (error) {
        contentDiv.innerHTML = "<h2>Error loading details. It might have been removed.</h2>";
        console.error(error);
    }
}

async function loadSightings(petId) {
    const container = document.getElementById("sightings-container");
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/api/sightings/pet/${petId}`);
        const sightings = await response.json();

        if (sightings.length > 0) {
            container.innerHTML = sightings.map(s => `
                <div class="sighting-card" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 8px;">
                    <p><strong>Seen:</strong> ${s.dateSeen} at ${s.timeSeen}</p>
                    <p><strong>Location:</strong> ${s.location}</p>
                    <p>${s.description}</p>
                    ${s.latitude ? `<a href="https://www.google.com/maps?q=${s.latitude},${s.longitude}" target="_blank" class="btn-small">🗺️ View on Map</a>` : ''}
                </div>
            `).join('');
        } else {
            container.innerHTML = "<p>No sightings reported yet.</p>";
        }
    } catch (err) {
        console.error("Error loading sightings:", err);
    }
}

async function loadAllPets() {
    const petGrid = document.getElementById("all-pets-grid");
    if (!petGrid) return;

    try {
        const response = await fetch(`${API_URL}/api/pets`);
        allPets = await response.json();
        displayPets(allPets);
    } catch (error) {
        console.error("Error loading list of pets", error);
    }
}

function displayPets(petsToDisplay) {
    const petGrid = document.getElementById("all-pets-grid");
    petGrid.innerHTML = "";

    if (petsToDisplay.length === 0) {
        petGrid.innerHTML = "<p class='no-results'>No pets match your search criteria.</p>";
        return;
    }

    petsToDisplay.forEach(pet => {
        const petCard = `
            <div class="pet-card">
                <h3>${pet.petName}</h3>
                <p><strong>Species:</strong> ${pet.species}</p>
                <p><strong>Breed:</strong> ${pet.breed}</p>
                <p><strong>Area:</strong> ${pet.area}</p>
                <a href="pet-details.html?id=${pet.id}" class="btn-secondary">View Details</a>
            </div>
        `;
        petGrid.innerHTML += petCard;
    });
}

function filterPets() {
    const nameQuery = document.getElementById("searchName").value.toLowerCase();
    const breedQuery = document.getElementById("searchBreed").value.toLowerCase();
    const speciesQuery = document.getElementById("filterSpecies").value;

    const filtered = allPets.filter(pet => {
        const matchesName = pet.petName.toLowerCase().includes(nameQuery);
        const matchesBreed = pet.breed.toLowerCase().includes(breedQuery);
        const matchesSpecies = (speciesQuery === "all" || pet.species === speciesQuery);

        return matchesName && matchesBreed && matchesSpecies;
    });

    displayPets(filtered);
}

// Grab the user's gps
function getLocation() {
    if (navigator.geolocation) {

        const options = {
            enableHighAccuracy: true, 
            timeout: 5000,            
            maximumAge: 0
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            document.getElementById("lat").value = lat;
            document.getElementById("lng").value = lng;

            document.getElementById("sightingLocation").value = `Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            alert(`Location pinned! (Accurate within ${Math.round(position.coords.accuracy)}m)`);
        }, () => {
            alert("Could not get location");
        }, options);
    }
}

async function populatePetDropdown() {
    const dropdown = document.getElementById("petReport");
    if (!dropdown) return;

    try {
        const response = await fetch(`${API_URL}/api/pets`);
        const pets = await response.json();

        pets.forEach(pet => {
            const option = document.createElement("option");
            option.value = pet.id;
            option.textContent = `${pet.petName} (${pet.breed} - ${pet.area})`;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading pets for dropdown", error);
    }
}

