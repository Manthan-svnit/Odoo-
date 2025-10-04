import express from "express";
import User from "../models/usermodel.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Admin creates Employee or Manager
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;
    const adminCompanyId = req.user.companyId;

    // Prevent invalid roles
    if (!["Employee", "Manager"].includes(role)) {
      return res.status(400).json({ message: "Role must be Employee or Manager" });
    }

    // Create new user under admin’s company
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      company: adminCompanyId,
      manager: managerId || null,
    });

    res.status(201).json({ message: `${role} created successfully`, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all users in the same company
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ company: req.user.companyId }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
