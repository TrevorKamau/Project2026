console.log("PawFind loaded");

// Base URL for the backend
const API_URL = "http://localhost:8080";

let allPets = [];

// ── SUBMIT LOST PET REPORT ──
async function submitForm() {
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
        locationDetails: document.getElementById("locationDetails").value,
        creatorEmail: document.getElementById("email").value,
        creatorNotificationsEnabled: document.getElementById("creatorNotificationsEnabled").checked
    };

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

    const confirmPassword = document.getElementById("confirmPassword").value;
    if (user.password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (!user.firstName || !user.lastName || !user.email || !user.password) {
        alert("Please fill in all required fields!");
        return;
    }

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

    const locField = document.getElementById("location") || document.getElementById("sightingLocation");
    const dateField = document.getElementById("date");
    const timeField = document.getElementById("time");

    const sighting = {
        petReport: { id: parseInt(petId) },
        location: locField ? locField.value : "", 
        description: document.getElementById("sightingDescription").value,
        reporterName: document.getElementById("reporterName").value,
        reporterContact: document.getElementById("reporterContact").value,
        latitude: document.getElementById("lat").value || null,
        longitude: document.getElementById("lng").value || null,
        dateSeen: dateField ? dateField.value : new Date().toISOString().split('T')[0],
        timeSeen: timeField ? timeField.value : new Date().toTimeString().split(' ')[0].substring(0, 5)
    };

    try {
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
    const loggedInUser = localStorage.getItem("user");

    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);

        const authLink = document.getElementById("auth-link");
        if (authLink) authLink.style.display = "none";

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) logoutBtn.style.display = "block";

        const settingsLink = document.getElementById("settings-link");
        if (settingsLink) settingsLink.style.display = "block";

        if (document.getElementById("firstName")) {
            document.getElementById("firstName").value = user.firstName || "";
            document.getElementById("lastName").value = user.lastName || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("phone").value = user.phone || "";
        }
    }
    
    loadRecentPets(); 
    loadAllPets(); 
    loadPetDetails();
    populatePetDropdown();
});

function checkAuth(event) {
    if (!localStorage.getItem("user")) {
        event.preventDefault();
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
        const lostPets = pets.filter(pet => pet.status === "LOST"); // Only shows pets that are STILL lost, found pets are displayed in the Wall of Hope

        if (pets.length > 0) {
            petGrid.innerHTML = "";
            const recentPets = lostPets.slice(-3).reverse();

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

    const loggedInUser = localStorage.getItem("user");
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
                ${  // If pet is found show Wall of Hope message, if not show Mark as Found button
                    pet.status === "FOUND"
                    ? `<p class="success-message">🎉 This pet is on the Wall of Hope!</p>`
                    : loggedInUser && pet.user && JSON.parse(loggedInUser).id === pet.user.id
                        ? `<button onclick="markAsFound(${pet.id})" class="btn-primary">Mark as Found ✅</button>`
                        : ``
                }
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
        const pets = await response.json(); // Stops found pets from being displayed in the main lost pets list
        allPets = pets.filter(pet => pet.status === "LOST");
        displayPets(allPets);
    } catch (error) {
        console.error("Error loading list of pets", error);
    }
}

async function loadWallOfHope() {
    const petGrid = document.getElementById("wall-of-hope-grid");
    if (!petGrid) return;

    try {
        const response = await fetch(`${API_URL}/api/pets/wall-of-hope`);
        const pets = await response.json();

        if (!pets || pets.length === 0) {
            petGrid.innerHTML = "<p>No reunited pets yet — but we stay hopeful 🐾</p>";
            return;
        }

        petGrid.innerHTML = "";

        pets.forEach(pet => {
            petGrid.innerHTML += `
                <div class="pet-card">
                    <h3>${pet.petName}</h3>
                    <p><strong>Species:</strong> ${pet.species}</p>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Area:</strong> ${pet.area}</p>
                    <p><strong>Status:</strong> FOUND 🎉</p>
                    <a href="pet-details.html?id=${pet.id}" class="btn-secondary">View Details</a>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading Wall of Hope:", error);
        petGrid.innerHTML = "<p>Could not load Wall of Hope.</p>";
    }
}

function displayPets(petsToDisplay) {
    const petGrid = document.getElementById("all-pets-grid");
    if (!petGrid) return;
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
    const areaQuery = document.getElementById("searchArea").value.toLowerCase();
    const speciesQuery = document.getElementById("filterSpecies").value;
    const dateFrom = document.getElementById("filterDateFrom").value;
    const dateTo = document.getElementById("filterDateTo").value;
 
    const filtered = allPets.filter(pet => {
        const matchesName = pet.petName.toLowerCase().includes(nameQuery);
        const matchesBreed = pet.breed.toLowerCase().includes(breedQuery);
        const matchesArea = pet.area.toLowerCase().includes(areaQuery);
        const matchesSpecies = (speciesQuery === "all" || pet.species === speciesQuery);
 
        const petDate = pet.dateLost ? new Date(pet.dateLost) : null;
        const matchesFrom = !dateFrom || (petDate && petDate >= new Date(dateFrom));
        const matchesTo = !dateTo || (petDate && petDate <= new Date(dateTo));
 
        return matchesName && matchesBreed && matchesArea && matchesSpecies && matchesFrom && matchesTo;
    });
 
    displayPets(filtered);
}

function clearFilters() {
    document.getElementById("searchName").value = "";
    document.getElementById("searchBreed").value = "";
    document.getElementById("searchArea").value = "";
    document.getElementById("filterSpecies").value = "all";
    document.getElementById("filterDateFrom").value = "";
    document.getElementById("filterDateTo").value = "";
    displayPets(allPets);
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

            const displayBox = document.getElementById("location") || document.getElementById("sightingLocation");
            if (displayBox) {
                displayBox.value = `Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }
            
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
    // Allows the user to follow a pet post using their email & sends email + post id to backend
    async function followPost() {
        const followEmail = document.getElementById("followEmail").value;
        const urlParams = new URLSearchParams(window.location.search);
        const petId = urlParams.get("id");

        // Checks for valid email
        if (!followEmail) {
            alert("Please enter an email address.");
            return;
        }

        //Checks for valid post ID
        if (!petId) {
            alert("Could not find post ID.");
            return;
        }

        // Sends follow this post request to backend
        try {
            const response = await fetch(`${API_URL}/api/pets/${petId}/follow`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: followEmail })
            });

            // Response message from backend & displays success/error/duplicate
            const message = await response.text();
            alert(message);
        } catch (error) {
            console.error("Error following post:", error);
            alert("Could not follow this post right now.");
        }
    }

//CHANGE PASSWORD
    async function changePassword() {
    const user = JSON.parse(localStorage.getItem("user"));
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!newPassword || newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, password: newPassword })
    });

    if (response.ok) {
    const updatedUser = await response.json();
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Password changed successfully!");
   } else {
    alert("Failed to change password. Please try again.");
   }

 }
    //DELETE ACCOUNT
    async function deleteAccount() {
    const user = JSON.parse(localStorage.getItem("user"));
    
    const confirmed = confirm("Are you sure you want to delete your account? This cannot be undone.");
    
    if (confirmed) {
        const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "DELETE"
        });

        if (response.ok) {
            localStorage.removeItem("user");
            window.location.href = "login.html";
        } else {
            alert("Failed to delete account. Please try again.");
        }
    }

    }

    // MARK PET AS FOUND & Move post to Wall of Hope
    async function markAsFound(petId) {
    const confirmed = confirm("Mark this pet as found? This will remove the listing and move it to the Wall of Hope.");
  
    if (confirmed) {
        const response = await fetch(`${API_URL}/api/pets/${petId}/mark-found`, {
            method: "PUT"
        });

        if (response.ok) {
            alert("Great news! Glad your pet was found! This pet has been moved to the Wall of Hope!");
            window.location.reload();

    } else {
       alert("Something went wrong. Please try again.");
    }
  }
}

async function updateProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const updatedData = {
        ...user,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
    };

    try {
        const response = await fetch(`${API_URL}/api/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const newUser = await response.json();
            localStorage.setItem("user", JSON.stringify(newUser));
            alert("Profile updated successfully!");
            location.reload();
        } else {
            alert("Failed to update profile.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
