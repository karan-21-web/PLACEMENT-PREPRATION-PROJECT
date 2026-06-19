<<<<<<< HEAD
# Placement-Prepilot-Project
this is a platform for students
=======
# 📋 PrepPilot - Placement Preparation Platform

A full-stack MERN application to help students track and manage their placement preparation journey. Built as a B.Tech CSE final year project.

## 📖 Project Description

PrepPilot is a placement preparation tracker that helps engineering students organize their job applications, DSA practice, resumes, and interview preparation in one place. It includes AI-powered interview question generation using Google's Gemini API.

## ✨ Features

- **Authentication** - Register, Login, Logout with JWT
- **Dashboard** - Overview of applications, DSA progress, resumes, and upcoming interviews
- **Company Tracker** - Add, edit, delete, search, and filter companies by status
- **DSA Tracker** - Log solved problems with difficulty, topic, platform filters
- **Resume Manager** - Upload, download, and manage resume versions (PDF)
- **Interview Preparation** - Generate interview questions using Gemini AI
- **Analytics** - Pie chart (DSA by difficulty) and Bar chart (companies by status)
- **Profile** - Update name, college, branch, graduation year
- **Settings** - Dark mode toggle, logout
- **404 Page** - Custom not found page

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Recharts (for analytics charts)
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- Express Validator
- Google Generative AI (Gemini)

## 📁 Folder Structure

```
placement-preparation-project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth endpoints
│   │   ├── companyController.js  # Company CRUD
│   │   ├── dsaController.js      # DSA problem CRUD
│   │   ├── interviewController.js # Interview endpoints
│   │   └── resumeController.js   # Resume upload/download
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorMiddleware.js    # Error handling
│   │   ├── uploadMiddleware.js   # Multer config
│   │   └── validationMiddleware.js # Input validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── DSAProblem.js
│   │   ├── Resume.js
│   │   ├── InterviewQuestion.js
│   │   └── InterviewSession.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── dsaRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── resumeRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── companyService.js
│   │   ├── dsaService.js
│   │   ├── geminiService.js      # AI question generation
│   │   ├── interviewService.js
│   │   └── resumeService.js
│   ├── uploads/                   # Resume file storage
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── tracker/
│   │   │       ├── CompanyCard.jsx
│   │   │       ├── CompanyModal.jsx
│   │   │       └── DSAProblemModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── CompanyTracker.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DsaTracker.jsx
│   │   │   ├── InterviewPrep.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResumeManager.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🚀 Installation Steps

### Prerequisites
- Node.js (v18 or above)
- MongoDB Atlas account (or local MongoDB)
- Gemini API key (optional, for AI features)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/placement-preparation-project.git
cd placement-preparation-project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=<your mongodb url>
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | No (fallback questions used if missing) |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

## 💻 How to Run Locally

1. Open two terminal windows

2. **Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

3. **Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

4. Open `http://localhost:5173` in your browser

## 📦 How to Build

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/` folder.

## 🌐 How to Deploy

### Backend - Render

1. Go to [render.com](https://render.com) and create an account
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** preppilot-api
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables (MONGO_URI, JWT_SECRET, GEMINI_API_KEY)
6. Click "Create Web Service"
7. Note your Render URL (e.g., `https://preppilot-api.onrender.com`)

### Frontend - Vercel

1. Go to [vercel.com](https://vercel.com) and create an account
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** frontend
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://preppilot-api.onrender.com/api`
6. Click "Deploy"

### Database - MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP address (0.0.0.0/0 for all)
5. Get the connection string and use it as `MONGO_URI`

## ❗ Common Errors and Solutions

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` on backend start | Check if MongoDB URI is correct and your IP is whitelisted |
| `JWT_SECRET is not defined` | Make sure `.env` file exists in `backend/` with JWT_SECRET |
| CORS error in browser | Check that `VITE_API_URL` matches your backend URL |
| `Cannot find module` | Run `npm install` in the correct directory |
| Resume upload fails | Make sure `uploads/resumes/` directory exists in backend |
| Gemini API error | Check GEMINI_API_KEY or the app will use fallback questions |
| Port already in use | Change PORT in `.env` or kill the process using that port |
| Build fails on Vercel | Make sure `VITE_API_URL` env variable is set in Vercel dashboard |

## 🔮 Future Scope

- Email verification on registration
- Password reset functionality
- Resume parser with ATS score
- Real-time notifications
- Company-specific interview experiences
- Peer discussion forum
- Mobile app version
- Admin panel for placement cell

## 📝 License

This project is created for educational purposes as part of B.Tech CSE coursework.
>>>>>>> d31a5df (Initial commit)
