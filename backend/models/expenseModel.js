import mongoose from "mongoose";

const expenseLineSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Travel', 'Meals', 'Accommodation', 'Office Supplies', 'Entertainment', 'Transportation', 'Other']
  },
  date: {
    type: Date,
    required: true
  },
  receiptUrl: {
    type: String,
    default: null
  }
});

const expenseSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  expenseLines: [expenseLineSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    uppercase: true
  },
  convertedAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'paid'],
    default: 'draft'
  },
  currentApprover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalFlow: [{
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    comments: String,
    actionDate: Date,
    sequence: Number
  }],
  receiptImage: {
    type: String, // URL to stored receipt image
    default: null
  },
  ocrData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
expenseSchema.pre('save', function(next) {
  if (this.expenseLines && this.expenseLines.length > 0) {
    this.totalAmount = this.expenseLines.reduce((total, line) => total + line.amount, 0);
  }
  next();
});

export default mongoose.model("Expense", expenseSchema);