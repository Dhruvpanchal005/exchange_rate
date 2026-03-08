document.addEventListener("DOMContentLoaded", function () {
  /* ================= REGISTER ================= */

  const form = document.querySelector(".register-form");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("reg-name");
      const email = document.getElementById("reg-email");
      const password = document.getElementById("reg-password");
      const confirm = document.getElementById("reg-confirm");

      if (!name || !email || !password || !confirm) {
        alert("Input ID mismatch!");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        alert("Please enter a valid email address");
        return;
      }

      if (password.value !== confirm.value) {
        alert("Passwords do not match");
        return;
      }

      if (password.value.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      // Disable button during request
      const submitBtn = form.querySelector(".register-btn");
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';

      // Send registration request
      const response = await fetch("http://localhost:3005/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registered Successfully!");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Registration failed");
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Register";
      }
    });
  }

  /* ================= HAMBURGER MENU ================= */

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      navLinks.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove("active");
      }
    });

    const links = navLinks.querySelectorAll("a");

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
      });
    });
  }
});
