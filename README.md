# Expense Management System

A full-stack expense management application with React frontend and Node.js backend.

## 🚀 Features

- **Company Registration**: Create companies with admin users
- **User Authentication**: JWT-based authentication system
- **Role-based Access**: Admin, Manager, and Employee roles
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middlewares/        # Authentication middleware
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   └── astro-expense-hub/  # React application
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend/astro-expense-hub/astro-expense-hub
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/expense-management
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the development servers**

   **Option 1: Use the provided scripts**
   ```bash
   # Windows
   start-dev.bat
   
   # Linux/Mac
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend/astro-expense-hub/astro-expense-hub
   npm run dev
   ```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register-company` - Register a new company and admin
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires authentication)

### Request/Response Examples

**Register Company:**
```json
POST /api/auth/register-company
{
  "companyName": "Acme Corp",
  "adminName": "John Doe",
  "adminEmail": "john@acme.com",
  "password": "password123",
  "country": "United States",
  "currency": "USD"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@acme.com",
  "password": "password123"
}
```

## 🔧 Development

### Backend Development
- The backend uses ES modules
- Authentication is handled via JWT tokens
- CORS is configured for the frontend URL
- MongoDB connection is required

### Frontend Development
- Built with Vite for fast development
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components for UI elements

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin/Manager/Employee),
  company: ObjectId (ref: Company),
  manager: ObjectId (ref: User)
}
```

### Company Model
```javascript
{
  name: String,
  country: String,
  defaultCurrency: String,
  createdBy: ObjectId (ref: User)
}
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Update API URL in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all environment variables are set
4. Check that both servers are running on the correct ports

## 🔮 Future Enhancements

- Expense submission and management
- Receipt OCR scanning
- Multi-level approval workflows
- Real-time notifications
- Advanced analytics and reporting
- Mobile app development