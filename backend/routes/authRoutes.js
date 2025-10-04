import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware.js";

// Mock database (in production, use real MongoDB)
const users = new Map();
const companies = new Map();

const router = express.Router();

// Register company + admin
router.post("/register-company", async (req, res) => {
  try {
    const { companyName, adminName, adminEmail, password, country, currency } = req.body;

    // Generate IDs
    const companyId = `company_${Date.now()}`;
    const userId = `user_${Date.now()}`;

    // 1. Create company
    const company = {
      _id: companyId,
      name: companyName,
      country: country || 'United States',
      defaultCurrency: currency || 'USD',
      createdBy: userId
    };

    // 2. Create admin
    const admin = {
      _id: userId,
      name: adminName,
      email: adminEmail,
      password: password, // In production, hash this password
      role: "Admin",
      company: company
    };

    // Store in mock database
    companies.set(companyId, company);
    users.set(userId, admin);

    res.status(201).json({ 
      message: "Company and Admin created successfully", 
      company, 
      user: admin 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in mock database
    let user = null;
    for (const [userId, userData] of users) {
      if (userData.email === email) {
        user = userData;
        break;
      }
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, companyId: user.company?._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = users.get(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
