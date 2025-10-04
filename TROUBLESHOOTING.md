# Troubleshooting Guide

## Common Issues and Solutions

### 1. Frontend Not Loading

**Problem**: Frontend shows blank page or errors
**Solutions**:
- Make sure you're in the correct directory: `frontend/astro-expense-hub/astro-expense-hub`
- Run `npm install` to install dependencies
- Check if port 5173 is available
- Try `npm run dev` to start the frontend

### 2. Backend Connection Issues

**Problem**: Frontend can't connect to backend
**Solutions**:
- Ensure backend is running on port 5000
- Check if MongoDB is running
- Verify `.env` file in backend directory has correct MONGO_URI
- Test backend directly: visit `http://localhost:5000`

### 3. Authentication Errors

**Problem**: Login/Registration not working
**Solutions**:
- Check browser console for errors
- Verify backend is running
- Test connection at `http://localhost:5173/test`
- Check if JWT_SECRET is set in backend .env

### 4. MongoDB Connection Issues

**Problem**: Backend can't connect to MongoDB
**Solutions**:
- Install MongoDB locally or use MongoDB Atlas
- Update MONGO_URI in backend/.env
- Check if MongoDB service is running
- For local MongoDB: `mongod` command

### 5. Port Conflicts

**Problem**: Port already in use errors
**Solutions**:
- Change port in vite.config.ts (frontend)
- Change PORT in backend/.env
- Kill processes using the ports:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -ti:5000 | xargs kill -9`

### 6. CORS Issues

**Problem**: CORS errors in browser console
**Solutions**:
- Backend CORS is configured for localhost:5173
- Check if frontend is running on correct port
- Verify backend server.js CORS configuration

## Step-by-Step Setup

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=mongodb://localhost:27017/expense-management
# JWT_SECRET=your-super-secret-jwt-key
# PORT=5000
# FRONTEND_URL=http://localhost:5173
npm start
```

### 2. Frontend Setup
```bash
cd frontend/astro-expense-hub/astro-expense-hub
npm install
npm run dev
```

### 3. Test Connection
- Visit `http://localhost:5173/test`
- Click "Test Connection" button
- Should show "Backend is running!"

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/expense-management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend
- No .env needed (uses proxy)
- API calls go to `/api` (proxied to backend)

## Common Error Messages

### "Cannot connect to backend"
- Check if backend is running on port 5000
- Verify MongoDB is running
- Check backend console for errors

### "CORS error"
- Backend CORS is configured for localhost:5173
- Make sure frontend is on correct port

### "MongoDB connection failed"
- Install MongoDB locally
- Or use MongoDB Atlas (cloud)
- Update MONGO_URI in .env

### "JWT token invalid"
- Check JWT_SECRET in backend .env
- Restart backend after changing .env

## Quick Fixes

### Reset Everything
```bash
# Stop all processes
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

### Check Logs
- Backend logs: Check terminal where `npm start` is running
- Frontend logs: Check browser console (F12)
- Network tab: Check if API calls are failing

## Still Having Issues?

1. Check all requirements are installed
2. Verify all environment variables are set
3. Test each component separately
4. Check firewall/antivirus settings
5. Try different ports if needed
