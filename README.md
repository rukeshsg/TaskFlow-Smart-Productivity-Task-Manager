# TaskFlow: Smart Productivity Manager

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-1E1E2E?logo=vite&logoColor=646CFF)

![Node.js](https://img.shields.io/badge/Node.js-20232A?logo=node.js&logoColor=339933)
![Express](https://img.shields.io/badge/Express-20232A?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-20232A?logo=mongodb&logoColor=47A248)

![JWT](https://img.shields.io/badge/JWT-1E1E2E?logo=jsonwebtokens&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-1E1E2E?logo=socket.io&logoColor=white)

![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-0A0F1C?logo=render&logoColor=46E3B7)

![License](https://img.shields.io/badge/License-MIT-FFD700)
![Status](https://img.shields.io/badge/Status-Live-00C853)
![Build](https://img.shields.io/badge/Build-Passing-00E676)
![PRs](https://img.shields.io/badge/PRs-Welcome-2979FF)

TaskFlow is an ultra-premium, full-stack Task Management application designed for high-performing individuals and teams. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a highly responsive, glassmorphism-inspired UI, real-time synchronization, interactive Kanban boards, and a comprehensive Calendar view.

## 🌐Live Demo
- 🔗 Frontend: https://task-flow-smart-productivity-task-manager-nqrokvypt.vercel.app
- 🔗 Backend API: https://taskflow-smart-productivity-task-manager.onrender.com

## ✨ Features

- **Authentication System**: Secure JWT-based login/registration with encrypted passwords.
- **Dynamic Kanban Board**: Drag-and-drop task management grouped by status.
- **Smart Calendar**: Monthly, weekly, and agenda views colored dynamically by task priority.
- **Dark/Light Mode**: Full CSS-variable-based theming engine with seamless toggling.
- **Real-Time Readiness**: Architecture pre-configured for Socket.io synchronization.
- **Advanced Filtering & Analytics**: Real-time stats calculation and streak tracking.

## 📸 Screenshots

### 🏠 Home Page / Kanban Board
<p align="center">
  <img src="./assets/home-page.png" width="800"/>
</p>

### 📅 Smart Calendar
<p align="center">
  <img src="./assets/smart-calendar.png" width="800"/>
</p>

### 🔐 Login Page
<p align="center">
  <img src="./assets/login.png" width="800"/>
</p>

## 🚀 Tech Stack

**Frontend:**
- React 19 (Vite)
- Framer Motion (Animations)
- React Big Calendar
- Axios (API Client)
- Vanilla CSS Variables (No external UI frameworks)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Helmet & Express Rate Limit (Security)

## 📦 Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URL (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Install Dependencies**
   Run the setup script from the root directory to install both frontend and backend dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://your_replica_set_string_here
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the Application**
   From the root folder, run the dev servers concurrently:
   ```bash
   npm run dev:backend
   # In a separate terminal:
   npm run dev:frontend
   ```

## 🌐 Deployment Configuration

The repository is structured for seamless deployment using a monorepo setup:
- **Backend (Render)**: The `backend/` folder contains a robust Express server. Ensure environment variables are added in your hosting dashboard.
- **Frontend (Vercel)**: The `frontend/` folder uses Vite. The build command is `npm run build` and the publish directory is `dist`. A `vercel.json` file is included for SPA routing rules.

## 📄 License

This project is licensed under the Apache License 2.0.
