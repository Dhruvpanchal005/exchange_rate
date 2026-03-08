const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3005;

// MongoDB Connection
const MONGO_URI = "mongodb://127.0.0.1:27017/cryptotracker";

mongoose
  .connect(MONGO_URI, {
    family: 4, // Force IPv4
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Contact = mongoose.model("Contact", contactSchema);

// ================= EMAIL VALIDATION =================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

// ================= REGISTER =================
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate email format
  if (!isValidEmail(email)) {
    return res.json({ success: false, message: "Invalid email format" });
  }

  // Check if password is provided
  if (!password || password.length < 6) {
    return res.json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ success: true, message: "Registered Successfully!" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.json({ success: false, message: "Error registering user" });
  }
});

// ================= LOGIN =================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.json({
        success: true,
        user: { name: user.name, email: user.email },
      });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.json({ success: false, message: "Error logging in" });
  }
});

// ================= CONTACT =================
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send to Formspree
    try {
      await fetch("https://formspree.io/f/xgonveak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
    } catch (formError) {
      console.log("Formspree error (non-critical)");
    }

    res.json({ success: true, message: "Message Sent Successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error sending message" });
  }
});

// ================= FORGOT PASSWORD =================
app.post("/api/forgot-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.json({ success: true, message: "Password Updated Successfully!" });
    } else {
      res.json({ success: false, message: "Email not found!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error updating password" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
