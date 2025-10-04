import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/users", userRoutes);
app.use('/api/expenses',expenseRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Expense Management API is running 🚀" });
});

const PORT = process.env.PORT || 5000;

// For development, we'll use a simple in-memory database
// In production, you should use a real MongoDB connection
const users = new Map();
const companies = new Map();

// Mock data for testing
const mockCompany = {
  _id: 'company1',
  name: 'Demo Company',
  country: 'United States',
  defaultCurrency: 'USD',
  createdBy: 'user1'
};

const mockUser = {
  _id: 'user1',
  name: 'Demo Admin',
  email: 'admin@demo.com',
  role: 'Admin',
  company: mockCompany
};

companies.set('company1', mockCompany);
users.set('user1', mockUser);

console.log("✅ Mock database initialized");
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
