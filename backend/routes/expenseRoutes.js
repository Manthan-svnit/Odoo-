import express from 'express';
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import Expense from '../models/expenseModel.js';
import User from '../models/usermodel.js'; // Fixed: Capital 'M'
import Company from '../models/companyModel.js';
import axios from 'axios';

const router = express.Router();

// Helper functions - define these BEFORE using them in routes
async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const rate = response.data.rates[toCurrency];
    return amount * rate;
  } catch (error) {
    console.error('Currency conversion error:', error);
    return amount; // Fallback to original amount
  }
}

async function setupApprovalFlow(expense, user) {
  const approvalFlow = [];
  let sequence = 1;

  // Check if manager approval is required
  if (user.manager && user.isManagerApprover) {
    approvalFlow.push({
      approver: user.manager,
      sequence: sequence++,
      status: 'pending'
    });
  }

  expense.approvalFlow = approvalFlow;
  
  // Set current approver to the first in sequence
  if (approvalFlow.length > 0) {
    expense.currentApprover = approvalFlow[0].approver;
  }
}

// Routes - Use verifyToken directly (not authMiddleware)
router.post('/', verifyToken, async (req, res) => { // ← CHANGED: authMiddleware to verifyToken
  try {
    const { title, description, expenseLines, currency, receiptImage } = req.body;
    
    // Get user and company info
    const user = await User.findById(req.user.id).populate('company');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total amount
    const totalAmount = expenseLines.reduce((total, line) => total + line.amount, 0);

    // Convert to company's default currency
    let convertedAmount = totalAmount;
    if (currency !== user.company.defaultCurrency) {
      convertedAmount = await convertCurrency(totalAmount, currency, user.company.defaultCurrency);
    }

    // Create expense
    const expense = new Expense({
      employee: req.user.id,
      company: user.company._id,
      title,
      description,
      expenseLines,
      totalAmount,
      currency: currency.toUpperCase(),
      convertedAmount,
      receiptImage,
      status: 'submitted'
    });

    // Set up initial approval flow
    await setupApprovalFlow(expense, user);

    const savedExpense = await expense.save();
    
    res.status(201).json({
      message: 'Expense submitted successfully',
      expense: savedExpense
    });

  } catch (error) {
    console.error('Expense submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/my-expenses', verifyToken, async (req, res) => { // ← CHANGED: authMiddleware to verifyToken
  try {
    const expenses = await Expense.find({ employee: req.user.id })
      .populate('currentApprover', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      count: expenses.length,
      expenses
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => { // ← CHANGED: authMiddleware to verifyToken
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('employee', 'name email')
      .populate('currentApprover', 'name email')
      .populate('approvalFlow.approver', 'name email role');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if user has permission to view this expense
    const canView = expense.employee._id.toString() === req.user.id || 
                   expense.approvalFlow.some(flow => flow.approver._id.toString() === req.user.id);

    if (!canView) {
      return res.status(403).json({ message: 'Not authorized to view this expense' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;