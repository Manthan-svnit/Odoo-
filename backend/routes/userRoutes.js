import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Mock database (in production, use real MongoDB)
const users = new Map();

// Get all users (Admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const allUsers = Array.from(users.values());
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user data
    const updatedUser = { ...user, ...req.body };
    users.set(req.params.id, updatedUser);
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    users.delete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;