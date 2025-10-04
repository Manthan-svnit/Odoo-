import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import Company from "../models/companyModel.js";

const router = express.Router();

// Register company + admin
router.post("/register-company", async (req, res) => {
  try {
    const { companyName, adminName, adminEmail, password, country, currency } = req.body;

    // 1. Create company
    const company = await Company.create({
      name: companyName,
      country,
      defaultCurrency: currency,
    });

    // 2. Create admin
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password,
      role: "Admin",
      company: company._id,
    });

    company.createdBy = admin._id;
    await company.save();

    res.status(201).json({ message: "Company and Admin created successfully", company, admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("company");

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, companyId: user.company?._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
