#!/bin/bash

echo "Starting Expense Management System..."
echo

echo "Starting Backend Server..."
cd backend && npm start &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend Development Server..."
cd ../frontend/astro-expense-hub/astro-expense-hub && npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
