document.addEventListener("DOMContentLoaded", function () {
  /* ================= SHOW MORE COINS BUTTON ================= */

  const moreCoinsSection = document.getElementById("more-coins");
  const coinsSection = document.getElementById("coins");

  // Function to create the Show More button at top
  function createShowMoreButton() {
    // Remove any existing button
    const existingBtn = document.getElementById("showMoreContainer");
    if (existingBtn) existingBtn.remove();

    const btnDiv = document.createElement("div");
    btnDiv.className = "more-container";
    btnDiv.id = "showMoreContainer";
    btnDiv.innerHTML =
      '<button id="showMoreBtn" class="more">Show More Coins</button>';
    coinsSection.appendChild(btnDiv);

    document.getElementById("showMoreBtn").onclick = function () {
      moreCoinsSection.style.display = "block";
      createShowLessButton();
      moreCoinsSection.scrollIntoView({ behavior: "smooth" });
    };
  }

  // Function to create the Show Less button at bottom
  function createShowLessButton() {
    // Remove any existing button
    const existingBtn = document.getElementById("showLessContainer");
    if (existingBtn) existingBtn.remove();

    const btnDiv = document.createElement("div");
    btnDiv.className = "more-container";
    btnDiv.id = "showLessContainer";
    btnDiv.innerHTML =
      '<button id="showLessBtn" class="more">Show Less Coins</button>';
    moreCoinsSection.appendChild(btnDiv);

    document.getElementById("showLessBtn").onclick = function () {
      moreCoinsSection.style.display = "none";
      createShowMoreButton();
      coinsSection.scrollIntoView({ behavior: "smooth" });
    };
  }

  // Initialize the Show More button
  createShowMoreButton();

  /* ================= HAMBURGER MENU ================= */

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      navLinks.classList.toggle("active");
    });
  }

  /* ================= PROFILE SYSTEM ================= */

  const authArea = document.getElementById("auth-area");
  const storedName = localStorage.getItem("name");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (authArea && storedName && isLoggedIn) {
    const firstLetter = storedName.charAt(0).toUpperCase();

    authArea.innerHTML = `
      <div class="profile-menu" id="profileMenu">
        <div class="profile-avatar">${firstLetter}</div>
        <span>${storedName}</span>
        <div class="profile-dropdown">
          <a href="#">My Profile</a>
          <a href="#" id="logoutBtn">Logout</a>
        </div>
    `;

    const profileMenu = document.getElementById("profileMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    if (profileMenu) {
      profileMenu.addEventListener("click", function (e) {
        e.stopPropagation();
        profileMenu.classList.toggle("active");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("name");
        localStorage.removeItem("email");

        alert("Logged Out!");
        window.location.href = "login.html";
      });
    }
  }

  /* ================= GLOBAL CLICK HANDLER ================= */

  // Close hamburger menu and profile dropdown when clicking outside
  document.addEventListener("click", function (e) {
    // Close hamburger menu when clicking outside
    if (navLinks && navLinks.classList.contains("active")) {
      if (!navLinks.contains(e.target) && !menuToggle?.contains(e.target)) {
        navLinks.classList.remove("active");
      }
    }

    // Close profile dropdown when clicking outside (but not on profile menu)
    const profileMenu = document.getElementById("profileMenu");
    if (profileMenu && profileMenu.classList.contains("active")) {
      if (!profileMenu.contains(e.target)) {
        profileMenu.classList.remove("active");
      }
    }
  });

  // Close hamburger when clicking nav links
  if (navLinks) {
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
      });
    });
  }
});
