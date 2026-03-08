const currencyOne = document.getElementById("currency-one");
const amountOne = document.getElementById("amount-one");
const currencyTwo = document.getElementById("currency-two");
const amountTwo = document.getElementById("amount-two");
const rateDiv = document.getElementById("rate");
const swapBtn = document.getElementById("swap");

function calculate() {
  const fromCurrency = currencyOne.value;
  const toCurrency = currencyTwo.value;
  const amount = amountOne.value;

  fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
    .then((res) => res.json())
    .then((data) => {
      const rate = data.rates[toCurrency];
      const converted = (amount * rate).toFixed(2);

      rateDiv.innerText = `${amount} ${fromCurrency} = ${converted} ${toCurrency}`;

      amountTwo.value = converted;
    })
    .catch((error) => {
      rateDiv.innerText =
        "Error fetching data. Please check your internet connection.";
      console.error(error);
    });
}

currencyOne.addEventListener("change", calculate);
amountOne.addEventListener("input", calculate);
currencyTwo.addEventListener("change", calculate);
amountTwo.addEventListener("input", calculate);

swapBtn.addEventListener("click", () => {
  const temp = currencyOne.value;
  currencyOne.value = currencyTwo.value;
  currencyTwo.value = temp;
  calculate();
});

calculate();

// Hamburger menu
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Check if user is logged in
document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    alert("Please login first!");
    window.location.href = "login.html";
  }
});

// Profile
document.addEventListener("DOMContentLoaded", function () {
  const authArea = document.getElementById("auth-area");
  const storedName = localStorage.getItem("name");

  if (storedName) {
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

    profileMenu.addEventListener("click", function () {
      profileMenu.classList.toggle("active");
    });

    document
      .getElementById("logoutBtn")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        localStorage.removeItem("isLoggedIn");
        alert("Logged Out!");
        window.location.href = "login.html";
      });
  }
});
