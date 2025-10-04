# Complete Setup Guide

## 🚀 Quick Start (Recommended)

### Option 1: Use the Automated Script
```bash
# Windows
start-all.bat

# This will:
# 1. Install all dependencies
# 2. Start backend server
# 3. Start frontend server
# 4. Open both in separate windows
```

### Option 2: Manual Setup

#### Step 1: Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` file:
```env
MONGO_URI=mongodb://localhost:27017/expense-management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm start
```

#### Step 2: Frontend Setup
```bash
cd frontend/astro-expense-hub/astro-expense-hub
npm install
npm run dev
```

## 🔧 Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **npm** or **yarn**

### MongoDB Setup Options

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Use: `mongodb://localhost:27017/expense-management`

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster
3. Get connection string
4. Update MONGO_URI in backend/.env

## 📱 Access Points

After setup, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Test Page**: http://localhost:5173/test
- **API Health**: http://localhost:5000

## 🧪 Testing the Setup

### 1. Test Backend
Visit: http://localhost:5000
Should show: "Expense Management API is running 🚀"

### 2. Test Frontend
Visit: http://localhost:5173
Should show: ExpenseFlow landing page

### 3. Test Connection
Visit: http://localhost:5173/test
Click "Test Connection" - should show success

### 4. Test Authentication
1. Go to http://localhost:5173/auth
2. Click "Sign Up" tab
3. Fill in company details
4. Click "Create Account"
5. Should redirect to dashboard

## 🔍 Troubleshooting

### Common Issues

#### "Cannot connect to backend"
- Check if backend is running on port 5000
- Verify MongoDB is running
- Check backend console for errors

#### "Frontend not loading"
- Check if frontend is running on port 5173
- Run `npm install` in frontend directory
- Check browser console for errors

#### "MongoDB connection failed"
- Install MongoDB locally or use MongoDB Atlas
- Update MONGO_URI in backend/.env
- Restart backend after changing .env

### Reset Everything
```bash
# Stop all processes (Ctrl+C in terminals)

# Delete node_modules
rm -rf backend/node_modules
rm -rf frontend/astro-expense-hub/astro-expense-hub/node_modules

# Reinstall
cd backend && npm install
cd ../frontend/astro-expense-hub/astro-expense-hub && npm install

# Start fresh
cd ../../../backend && npm start
# In new terminal:
cd frontend/astro-expense-hub/astro-expense-hub && npm run dev
```

## 📋 Features Available

### ✅ Working Features
- Company registration with admin user
- User authentication (login/logout)
- JWT token management
- Role-based access (Admin/Manager/Employee)
- Responsive UI with modern design
- Backend API with MongoDB
- CORS configuration
- Error handling and validation

### 🚧 Future Features (Not Yet Implemented)
- Expense submission and management
- Receipt OCR scanning
- Multi-level approval workflows
- Real-time notifications
- Advanced analytics and reporting

## 🎯 Next Steps

1. **Test the basic functionality**:
   - Register a new company
   - Login with the created account
   - Navigate to dashboard

2. **Customize the application**:
   - Modify the UI components
   - Add new features
   - Update the styling

3. **Deploy to production**:
   - Set up production MongoDB
   - Configure environment variables
   - Deploy backend and frontend

## 📞 Support

If you encounter issues:
1. Check the troubleshooting guide
2. Verify all prerequisites are installed
3. Check the console logs for errors
4. Test each component separately

The application is now fully connected and ready for development!
