const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware

const router = express.Router();

// **SIGNUP**
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah digunakan
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUserId = await User.create(name, email, hashedPassword);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
});

// **LOGIN**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah user ada
    const user = await User.getByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user); // ✅ Cek user sebelum login

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { userId: user.id }, // ✅ Pastikan `userId` ada
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated Token:", token); // ✅ Debugging

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
});


// **GET PROFILE**
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Ambil user dari database berdasarkan userId dari token JWT
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] }, // Hilangkan password dari respons
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

module.exports = router;
