console.log("PawFind loaded");

// Base URL for the backend
const API_URL = "http://localhost:8080";

// TODO: This will send the form data to the backend later
function submitForm() {
    alert("Report has been submitted!");
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
    // LOGOUT
    function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
    }
    //UPDATE PROFILE
    async function updateProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    
    const updatedUser = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
    };

    const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
    });

    if (response.ok) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated!");
    } else {
        alert("Failed to update profile. Please try again.");
    }
}
    //CHANGE PASSWORD
    async function changePassword() {
    const user = JSON.parse(localStorage.getItem("user"));
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, password: newPassword })
    });

    if (response.ok) {
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

