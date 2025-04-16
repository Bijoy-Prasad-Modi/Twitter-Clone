# 🐦 Twitter Clone (MERN Stack)

A full-stack **Twitter Clone** built using the **MERN stack** (**MongoDB, Express, React, Node.js**), implementing **authentication, tweets, likes, comments, and notifications**. This project closely mimics the functionality of Twitter with a seamless user experience. 🚀

---

## ✨ Features

- 🔐 **Authentication & Authorization**: User login and registration using **JWT & HTTP-only cookies**.
- 📝 **Create, Like, Comment, and Delete Tweets**: Users can post tweets, like/unlike, and comment on posts.
- 🔔 **Real-time Notifications**: Like, comment, and follow notifications with optimized queries.
- 🖼️ **Profile System**: Users can **update their profile details**, including profile picture and bio.
- 🏎️ **Optimized Performance**:
  - Implemented **React Query** for efficient API state management and caching.
  - Used **Promise.all()** for concurrent database operations to **reduce latency**.
  - Minimized unnecessary re-renders and network calls.
- 🌎 **Deployment**:
  - **Frontend** deployed on **Vercel**.
  - **Backend** deployed on **Render**, configured with a **reverse proxy** for CORS handling.
- 🔄 **Session Persistence**: Ensured users remain logged in with secure **JWT token storage in HTTP-only cookies**.

---

## 🛠️ Tech Stack

### **Frontend (React + Vite + TailwindCSS)**
- **React.js** - UI Library
- **Vite** - Fast build tool
- **React Query** - API state management & caching
- **TailwindCSS** - Styling
- **DaisyUI** - Pre-built UI components

### **Backend (Node.js + Express + MongoDB)**
- **Node.js** & **Express.js** - Server & API routes
- **MongoDB** & **Mongoose** - Database & ORM
- **JWT & Cookies** - Secure authentication
- **Bcrypt.js** - Password hashing
- **Cloudinary** - Image uploads

---

## 🚀 Project Setup & Run Guide

### **1️⃣ Clone the Repository**
```sh
# Clone the project
git clone https://github.com/your-username/twitter-clone.git

# Navigate to the project folder
cd twitter-clone
```

### **2️⃣ Setup the Backend**
```sh
cd server
npm install  # Install dependencies

# Create a .env file and add the following variables:
MONGO_URI=<your_mongodb_connection_string>
PORT=5000
FRONTEND_URL=<your_frontend_deployment_url>
JWT_SECRET=<your_jwt_secret_key>
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

# Run the backend server
npm run dev
```

### **3️⃣ Setup the Frontend**
```sh
cd ../client
npm install  # Install dependencies

# Create a .env file and add:
VITE_BASE_URL=<your_backend_url>

# Start the React app
npm run dev
```

---

## 🏗️ Project Architecture
```
📦 twitter-clone
 ┣ 📂 server
 ┃ ┣ 📂 db               # Database configurations (MongoDB connection)
 ┃ ┣ 📂 controllers      # Business logic for authentication, posts, notifications
 ┃ ┣ 📂 models           # Mongoose models (User, Post, Notification)
 ┃ ┣ 📂 routes           # API Routes (authRoutes, postRoutes, notificationRoutes)
 ┃ ┣ 📂 middleware       # Middleware for authentication & error handling
 ┃ ┣ 📂 utils            # Utility functions (JWT token generation, date formatting)
 ┃ ┣ 📜 server.js        # Express server setup & Cloudinary configurations
 ┃ ┣ 📜 .env             # Environment variables (MongoDB URI, JWT secret, etc.)
 ┃ ┣ 📜 .gitignore       # Ignore sensitive files in version control
 ┃ ┗ 📜 package.json     # Backend dependencies & scripts
 ┣ 📂 client
 ┃ ┣ 📂 public           # Static assets (logo, icons, etc.)
 ┃ ┣ 📂 src              # React source code
 ┃ ┃ ┣ 📂 components     # Reusable UI components (Sidebar, Post, Modal)
 ┃ ┃ ┣ 📂 pages          # Page components (Home, Profile, Notifications)
 ┃ ┃ ┣ 📂 hooks          # Custom React hooks (useAuth, useFetch)
 ┃ ┃ ┣ 📂 utils          # Utility functions (API calls, date formatting)
 ┃ ┃ ┣ 📜 App.jsx        # Main React component with routing
 ┃ ┃ ┣ 📜 main.jsx       # Entry point for React app
 ┃ ┃ ┣ 📜 index.css      # Global styles
 ┃ ┣ 📜 .env             # Frontend environment variables (API URLs)
 ┃ ┣ 📜 .gitignore       # Ignore unnecessary files
 ┃ ┣ 📜 vercel.json      # Vercel deployment configuration
 ┃ ┣ 📜 vite.config.js   # Vite project configuration
 ┃ ┗ 📜 package.json     # Frontend dependencies & scripts
 ┗ 📜 README.md          # Project documentation
```

---

## 🎯 Future Enhancements
- 🧵 **Threaded Comments**: Allow users to reply to comments, creating nested discussions.
- 📊 **Analytics Dashboard**: Show user engagement stats (likes, retweets, impressions).
- 🏷️ **Hashtags & Mentions**: Enable trending topics and user tagging.
- 🏠 **Follow Feed Optimization**: Implement infinite scrolling & dynamic content loading.
- 🌍 **WebSockets for Real-time Updates**: Enable instant post updates and notifications.

---

## 🔗 References & Inspiration
- **Twitter API Documentation** - For feature implementation guidance.
- **MERN Best Practices** - Structuring a scalable full-stack app.
- **React Query Docs** - API caching & state management.
- **Cloudinary Docs** - Secure and optimized media uploads.

---

## 🏆 Final Thoughts
This **Twitter Clone** is a robust social media platform built with industry best practices in **performance optimization, secure authentication, and efficient data fetching**.

🚀 **Star the repo** if you like it! 😊

