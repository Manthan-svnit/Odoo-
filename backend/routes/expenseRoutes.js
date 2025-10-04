import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Mock database (in production, use real MongoDB)
const expenses = new Map();

// Get all expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userExpenses = Array.from(expenses.values()).filter(
      expense => expense.userId === req.user.userId
    );
    res.json(userExpenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expense by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = expenses.get(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    
    // Check if user owns this expense
    if (expense.userId !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;
    
    const expense = {
      _id: `expense_${Date.now()}`,
      userId: req.user.userId,
      amount,
      description,
      category,
      date: date || new Date().toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    expenses.set(expense._id, expense);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = expenses.get(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    
    // Check if user owns this expense
    if (expense.userId !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedExpense = { ...expense, ...req.body };
    expenses.set(req.params.id, updatedExpense);
    
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = expenses.get(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    
    // Check if user owns this expense
    if (expense.userId !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    expenses.delete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/Reject expense (Admin/Manager only)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Check if user has permission to approve/reject
    if (!['Admin', 'Manager'].includes(req.user.role)) {
      return res.status(403).json({ message: "Manager or Admin access required" });
    }

    const expense = expenses.get(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    expense.status = status;
    expense.updatedAt = new Date().toISOString();
    expenses.set(req.params.id, expense);
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;