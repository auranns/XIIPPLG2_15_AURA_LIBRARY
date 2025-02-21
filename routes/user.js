const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// **SIGNUP**
router.post("/signup", async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    // Cek apakah email sudah digunakan
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    await User.create(name, username, email, phone, hashedPassword);
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

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Buat token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
});

// **GET PROFILE** (Hanya bisa diakses oleh user yang login)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Jangan kirim password ke response
    const { password, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

// **READ ALL USERS**
router.get("/users", async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// **READ SINGLE USER BY ID**
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// **UPDATE USER**
router.put("/users/:id", authMiddleware, async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash password jika ada perubahan
    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    const success = await User.update(req.params.id, { name, username, email, phone, password: hashedPassword });

    if (!success) {
      return res.status(400).json({ message: "Update failed" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// **DELETE USER**
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(400).json({ message: "Failed to delete user" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

module.exports = router;
