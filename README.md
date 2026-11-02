# ⚡ Tech-Fest-2026-Portal — Complete MERN Stack Application

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Render](https://img.shields.io/badge/Render-Backend%20Deploy-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com)
[![Netlify](https://img.shields.io/badge/Netlify-Frontend%20Deploy-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com)

An enterprise-grade, responsive full-stack MERN (MongoDB Atlas, Express.js, React, Node.js) web application architected for the **Tech-Fest 2026 National Science & Technology Festival**. Built to manage national hackathons, robotic combat arenas, competitive programming battles, guest summits, and automated delegate ticketing.

---

## 📑 Table of Contents
1. [Project Overview & Objective](#-project-overview--objective)
2. [Key Features](#-key-features)
3. [Architecture & Data Flow](#-architecture--data-flow)
4. [Technology Stack](#-technology-stack)
5. [Directory Structure](#-directory-structure)
6. [Quick Start & Local Development](#-quick-start--local-development)
7. [Environment Variables Reference](#-environment-variables-reference)
8. [MongoDB Atlas Setup Guide](#-mongodb-atlas-setup-guide)
9. [Database Seeding](#-database-seeding)
10. [API Endpoints Reference](#-api-endpoints-reference)
11. [Authentication & Role-Based Access Control](#-authentication--role-based-access-control)
12. [Deployment Guides](#-deployment-guides)
    - [GitHub Repository Preparation](#1-github-repository-preparation)
    - [Render Backend API Deployment](#2-render-backend-api-deployment)
    - [Netlify Frontend SPA Deployment](#3-netlify-frontend-spa-deployment)
    - [Cross-Cloud Production Integration](#4-cross-cloud-production-integration)
13. [Troubleshooting & Common Issues Resolved](#-troubleshooting--common-issues-resolved)
14. [Final College Project Submission Checklist](#-final-college-project-submission-checklist)

---

## 🎯 Project Overview & Objective

The **Tech-Fest-2026-Portal** is engineered to replace legacy fragmented spreadsheets and manual registration workflows with a cohesive cloud-native system. 

### Core Objectives:
- Provide an engaging, futuristic user experience with dark cyber-aesthetics, glowing accents, and micro-animations.
- Deliver full CRUD functionality across festival competitions, student registrations, and user profiles.
- Enforce strict security: JWT token verification, Bcrypt password hashing, and Role-Based Access Control (`student` vs `admin`).
- Automate entry pass generation with unique alphanumeric Ticket Codes and digital QR simulation badges.
- Ensure 100% production readiness with seamless continuous deployment on Render and Netlify.

---

## ✨ Key Features

### 🌐 Frontend (React + Vite)
- **Futuristic Landing Page**: Dynamic countdown clock to festival kickoff, festival impact metrics, track categories showcase, timeline breakdown, and FAQ section.
- **Competitions Directory**: Filter by track (Hackathon, Coding, Robotics, Gaming, AI & Data, Paper Presentation, Workshop), keyword search, capacity indicator bars.
- **Event Deep Dive**: Prize pool displays, team size rules, arena venue, rules checklist, coordinator contacts, and 1-click registration.
- **Interactive Registration Modal**: Support for team registrations (1–4 members), dynamic member rows, special hardware/lab requests, and instant celebratory confetti.
- **Digital QR Entry Pass Generator**: Downloadable / printable delegate pass with unique ticket code (`TF26-XXXX-XXXX`), attendee info, venue hall, and entrance scanner QR.
- **Student Dashboard**: Real-time view of confirmed passes, profile editor (Name, College, Phone), and 1-click registration cancellation.
- **Admin Control Center**: Operations dashboard with global stats, event creation/editing/deletion modal, registration quota management, and attendee directory.
- **Evaluation Helpers**: One-click demo login buttons for both Student and Admin accounts to evaluate immediately without manual typing.

### ⚙️ Backend (Express + Node.js + Mongoose)
- **Modular MVC Architecture**: Dedicated controllers, routers, middleware, and models.
- **Health Check Endpoint**: `GET /api/health` returning JSON `{ "status": "ok", "uptime": ... }` required by cloud monitoring.
- **Atlas Cloud Integration**: Mongoose connection pooling with server selection timeouts and friendly setup warnings.
- **Port Conflict Safeguard**: Automatically falls back to port `5001` if port `5000` is occupied by macOS AirPlay / ControlCenter.
- **CORS Configuration**: Restricts access in production to verified frontend origins while permitting local dev.

---

## 🏗️ Architecture & Data Flow

```
[ Browser / Client ] 
        │ (HTTPS / React Router)
        ▼
[ Netlify Static CDN ] ────► Serves React + Vite Single Page Application (SPA)
        │
        │ (REST API via Axios / Bearer JWT)
        ▼
[ Render Web Service ] ────► Express.js Server (Node.js runtime)
        │                     ├── CORS Middleware & JSON Parser
        │                     ├── JWT Auth & Role-Based Middleware
        │                     ├── Controllers & Input Validation
        │                     └── Mongoose ODM
        │
        ▼ (MongoDB Wire Protocol TLS)
[ MongoDB Atlas Cloud ] ───► Collections: users, events, registrations
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router DOM v6, Axios, Lucide React, Canvas Confetti |
| **Styling** | Vanilla CSS Design System with Cyberpunk Dark Glassmorphism, Google Fonts (Outfit, Plus Jakarta Sans) |
| **Backend** | Node.js (v20+), Express.js 4, Mongoose 8, Dotenv, Cors |
| **Security** | Bcrypt.js (Password Hashing), JSON Web Tokens (JWT), Sanitization |
| **Database** | MongoDB Atlas (Cloud Tier with M10 / M0 Sandbox) |
| **Hosting & CI/CD** | GitHub (Version Control), Render (API Web Service), Netlify (SPA Hosting) |

---

## 📁 Directory Structure

```
Tech-Fest-2026-Portal/
├── client/                          # React + Vite Frontend
│   ├── public/
│   │   ├── _redirects              # Netlify SPA redirect rule
│   │   └── favicon.svg             # TechFest cyber icon
│   ├── src/
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── CountdownTimer.jsx  # Live festival countdown clock
│   │   │   ├── EventCard.jsx       # Event showcase card with capacity bar
│   │   │   ├── EventFormModal.jsx  # Admin create/edit event modal
│   │   │   ├── Footer.jsx          # Footer with live API health indicator
│   │   │   ├── Navbar.jsx          # Responsive nav with role pill & drawer
│   │   │   ├── ProtectedRoute.jsx  # Route guard for Auth & Admin roles
│   │   │   ├── RegisterModal.jsx   # Team event registration flow
│   │   │   └── TicketModal.jsx     # Printable QR entry pass modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Centralized JWT & user state
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx      # Global navbar + outlet + footer shell
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Operations control center
│   │   │   ├── EventDetails.jsx    # Event details & registration trigger
│   │   │   ├── Events.jsx          # Category filter & search catalog
│   │   │   ├── Home.jsx            # Festival landing page
│   │   │   ├── Login.jsx           # Sign in with demo account shortcuts
│   │   │   ├── NotFound.jsx        # 404 handler
│   │   │   ├── Signup.jsx          # Student registration
│   │   │   └── UserDashboard.jsx   # My Passes & profile editor
│   │   ├── services/
│   │   │   └── api.js              # Axios client with JWT interceptors
│   │   ├── App.css                 # Master application component styles
│   │   ├── App.jsx                 # Route definitions & router outlet
│   │   ├── index.css               # Design system tokens & reset
│   │   └── main.jsx                # DOM entrypoint with AuthProvider
│   ├── .env.example                # Frontend environment template
│   ├── index.html                  # HTML5 entry with meta SEO tags
│   ├── netlify.toml                # Netlify build & redirect rules
│   ├── package.json
│   └── vite.config.js
├── server/                          # Express + Node.js Backend
│   ├── config/
│   │   └── db.js                   # Mongoose Atlas connection logic
│   ├── controllers/
│   │   ├── authController.js       # Register, login, current user
│   │   ├── eventController.js      # Full CRUD for festival competitions
│   │   ├── registrationController.js# Reserve spot, generate pass, cancel
│   │   └── userController.js       # Profile management & admin user lists
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verify & adminOnly guards
│   │   └── errorMiddleware.js      # Structured JSON error responses
│   ├── models/
│   │   ├── Event.js                # Schema for festival competitions
│   │   ├── Registration.js         # Schema for passes with unique ticketCode
│   │   └── User.js                 # Schema for accounts with bcrypt hashing
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth routes
│   │   ├── eventRoutes.js          # /api/events routes
│   │   ├── registrationRoutes.js   # /api/registrations routes
│   │   └── userRoutes.js           # /api/users routes
│   ├── utils/
│   │   ├── generateToken.js        # JWT generation helper (30d expiry)
│   │   └── seed.js                 # Sample events & test accounts seeder
│   ├── .env.example                # Backend environment template
│   ├── package.json
│   └── server.js                   # Express server entrypoint
├── .gitignore                      # Ignores .env and node_modules
├── render.yaml                     # Render Infrastructure Blueprint
└── README.md                       # Comprehensive Documentation
```

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js (v18 or higher recommended; verified with v24.21.0)
- npm (v9 or higher)
- Git

### 1. Clone or Open the Workspace
```bash
cd /Users/gauri/Desktop/main_project
```

### 2. Configure Backend Environment
Create `server/.env` based on `server/.env.example`:
```bash
cp server/.env.example server/.env
```
Open `server/.env` and insert your MongoDB Atlas URI:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/techfest2026?retryWrites=true&w=majority
JWT_SECRET=super_secret_techfest_2026_jwt_token_at_least_32_characters
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=5000
```

### 3. Install & Start Backend
```bash
cd server
npm install
npm start
```
*Note: If macOS AirPlay is using port 5000, the server automatically binds to `http://localhost:5001`.*

Verify the health check endpoint:
```bash
curl http://localhost:5001/api/health
# Expected: {"status":"ok","timestamp":"...","environment":"development"}
```

### 4. Configure Frontend Environment
In a new terminal window:
```bash
cd /Users/gauri/Desktop/main_project/client
cp .env.example .env
```
Ensure `client/.env` points to the active backend:
```env
VITE_API_URL=http://localhost:5001
```

### 5. Install & Start Frontend
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔐 Environment Variables Reference

### Backend (`server/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `MONGO_URI` | MongoDB Atlas Connection String with credentials | `mongodb+srv://admin:pass@cluster0.xxx.mongodb.net/techfest2026` |
| `JWT_SECRET` | 32+ character key for signing authentication tokens | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |
| `CLIENT_ORIGIN` | Allowed client origin for CORS | `http://localhost:5173` (dev) / `https://techfest2026.netlify.app` (prod) |
| `NODE_ENV` | Runtime environment | `development` or `production` |
| `PORT` | Listening port for Express | `5000` (auto-falls back to `5001` if busy) |

### Frontend (`client/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API without trailing slash | `http://localhost:5001` (dev) / `https://techfest-2026-portal-api.onrender.com` (prod) |

---

## 🍃 MongoDB Atlas Setup Guide

1. **Create an Account**: Visit [MongoDB Atlas](https://www.mongodb.com/atlas) and register.
2. **Deploy Cluster**: Select **M0 Free Tier** in your preferred region.
3. **Create Database User**:
   - Go to **Security → Database Access → Add New Database User**.
   - Select **Password Authentication**.
   - Username: `techfest_admin`
   - Password: `<your_secure_password>` (e.g. `TechFest2026SecurePass!`)
   - Role: `Read and write to any database`.
4. **Configure IP Access List (Network Access)**:
   - Go to **Security → Network Access → Add IP Address**.
   - For local development: click **Add Current IP Address**.
   - For Render cloud connectivity: add `0.0.0.0/0` (Allow Access from Anywhere) or add Render's outbound IP ranges.
5. **Obtain Connection String**:
   - Go to **Database Deployments → Connect → Drivers (Node.js)**.
   - Copy connection string:
     ```
     mongodb+srv://techfest_admin:<password>@cluster0.xxxxx.mongodb.net/techfest2026?retryWrites=true&w=majority
     ```
   - Paste into `server/.env` as `MONGO_URI`.

---

## 🌱 Database Seeding

To quickly populate the database with 8 flagship Tech-Fest events, test accounts, and registrations:
```bash
cd server
npm run seed
```

### Pre-configured Test Accounts:
| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@techfest2026.com` | `Admin@2026` | Full CRUD on Events & Registrations, Admin Operations Portal |
| **Student** | `student@techfest2026.com` | `Student@2026` | Event Registration, Digital Pass View, Profile Edit |

*Both accounts can also be filled with 1 click using the Demo buttons on the Login page.*

---

## 📡 API Endpoints Reference

### Health Check
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Status health check `{ "status": "ok" }` |
| `GET` | `/` | Public | API discovery and schema documentation |

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Fetch logged-in user profile |

### Events CRUD (`/api/events`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Public | List all events (supports `?category=` & `?search=`) |
| `GET` | `/api/events/:id` | Public | Get single event details by ID |
| `POST` | `/api/events` | Admin Only | Create a new festival competition |
| `PUT` | `/api/events/:id` | Admin Only | Update competition details |
| `DELETE`| `/api/events/:id` | Admin Only | Delete competition & associated registrations |

### Registrations CRUD (`/api/registrations`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/registrations` | Private | Register for event & generate Ticket Pass |
| `GET` | `/api/registrations/my` | Private | Retrieve logged-in student's tickets |
| `DELETE`| `/api/registrations/:id` | Private/Admin | Cancel registration & release capacity spot |
| `GET` | `/api/registrations` | Admin Only | List all festival registrations with user & event info |
| `PUT` | `/api/registrations/:id` | Admin Only | Update pass status (`Confirmed` / `Cancelled`) |

### Users & Operations (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Private | Get current user profile details |
| `PUT` | `/api/users/profile` | Private | Update student name, college, phone |
| `GET` | `/api/users` | Admin Only | List all users and aggregate portal metrics |

---

## 🔒 Authentication & Role-Based Access Control

1. **Password Encryption**: Stored passwords are salted and hashed using `bcryptjs` with 10 rounds of salt before persisting to MongoDB Atlas.
2. **JWT Tokens**: On successful authentication, a JWT is signed with the user's MongoDB `_id` and `role`, expiring in 30 days.
3. **Route Protection**: The `protect` middleware extracts the Bearer token from the `Authorization` HTTP header, decodes it, and attaches the active user to `req.user`.
4. **Admin Protection**: The `adminOnly` middleware validates that `req.user.role === 'admin'`. Non-admin requests are rejected with a `403 Forbidden` JSON response.
5. **Frontend Guards**: The `<ProtectedRoute>` wrapper dynamically verifies login state and admin privileges, redirecting unauthorized traffic safely.

---

## 🚢 Deployment Guides

### 1. GitHub Repository Preparation
```bash
cd /Users/gauri/Desktop/main_project
git init
git add .
git commit -m "Initial commit: Complete Tech-Fest 2026 MERN Stack Portal"
git branch -M main

# Add your GitHub repository remote
git remote add origin https://github.com/gauri-jagadeesh/Tech-Fest-2026-Portal.git
git push -u origin main
```

### 2. Render Backend API Deployment
1. Log in to [Render](https://render.com).
2. Click **New + → Web Service**.
3. Connect your GitHub repository `Tech-Fest-2026-Portal`.
4. Configure service settings:
   - **Name**: `techfest-2026-portal-api`
   - **Region**: Oregon (US West) or closest region
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Language**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free ($0/month)`
5. Configure Environment Variables under **Advanced**:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `mongodb+srv://...` (your Atlas URI)
   - `JWT_SECRET` = `techfest_super_secure_random_32_characters_secret`
   - `CLIENT_ORIGIN` = `https://YOUR-SITE-NAME.netlify.app`
6. Click **Deploy Web Service**.
7. Test the live health endpoint:
   ```
   https://techfest-2026-portal-api.onrender.com/api/health
   # Returns: {"status":"ok"}
   ```

### 3. Netlify Frontend SPA Deployment
1. Log in to [Netlify](https://www.netlify.com).
2. Click **Add new site → Import an existing project → GitHub**.
3. Select `Techfest-deployment`.
4. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://techfest-2026-portal-api.onrender.com` (no trailing slash)
6. Click **Deploy Site**.
7. The included `client/public/_redirects` and `client/netlify.toml` automatically route all subpaths (`/events`, `/dashboard`, `/admin`) to `/index.html` preventing 404 errors on browser page reloads.

### 4. Cross-Cloud Production Integration
- After Netlify assigns a URL (e.g. `https://techfest-2026.netlify.app`):
  1. Return to your **Render dashboard → Environment**.
  2. Set `CLIENT_ORIGIN` = `https://techfest-2026.netlify.app`.
  3. Trigger a **Manual Deploy → Deploy latest commit** on Render.
- Test end-to-end: Register a new student account on Netlify, browse competitions, reserve a spot, and check that the record persists in MongoDB Atlas.

---

## 🛠️ Troubleshooting & Common Issues Resolved

| Problem | Root Cause | Solution Implemented |
| :--- | :--- | :--- |
| **`listen EADDRINUSE :::5000`** | macOS AirPlay Receiver occupies port 5000 by default | Built automatic port listener fallback in `server.js` that detects `EADDRINUSE` and seamlessly binds to port `5001`. |
| **Netlify SPA 404 on page refresh** | Static server tries to find file at path `/events` or `/dashboard` | Included `client/public/_redirects` (`/* /index.html 200`) and `netlify.toml` redirect configurations. |
| **CORS Rejected on cross-cloud** | Missing or trailing slash mismatch in origin headers | Sanitized URL handling in `client/src/services/api.js` and dynamic origin matching in `server/server.js`. |
| **Missing Atlas credentials** | Database URL not yet configured in local `.env` | Implemented graceful warning diagnostics in `server/config/db.js` with exact configuration guidelines. |

---

## 📋 Final College Project Submission Checklist

Use this checklist for project evaluation and viva demonstration:

- [x] **Project Title**: Tech-Fest-2026-Portal
- [x] **Objective**: End-to-end full-stack MERN festival registration and competition management portal
- [x] **Frontend Stack**: React 18 + Vite 6 + React Router 6 + CSS Glassmorphism
- [x] **Backend Stack**: Node.js + Express.js + Mongoose 8
- [x] **Database**: MongoDB Atlas cloud integration with User, Event, and Registration models
- [x] **Authentication**: Bcrypt password hashing + JWT token verification + RBAC (Student vs Admin)
- [x] **CRUD Operations**:
  - [x] Events: Create, Read (Filter & Search), Update, Delete
  - [x] Registrations: Reserve spot, View passes, Cancel registration, Admin status toggle
  - [x] Users: Register, Login, Profile updates
- [x] **Health Check Route**: `GET /api/health` returning `{"status":"ok"}`
- [x] **Digital Pass System**: Unique alphanumeric ticket code generation (`TF26-XXXX-XXXX`) and QR badge view
- [x] **Demo Accounts**: Instant 1-click test credentials on login page for Student and Admin
- [x] **Production Deployment Ready**:
  - [x] Netlify configuration with `_redirects` and `netlify.toml`
  - [x] Render configuration with `render.yaml`
  - [x] Root `.gitignore` correctly ignoring secrets while preserving `.env.example`
- [x] **Live GitHub Repository URL**: [https://github.com/gauri-jagadeesh/Tech-Fest-2026-Portal](https://github.com/gauri-jagadeesh/Tech-Fest-2026-Portal)
- [ ] **Live Render API URL**: `https://techfest-2026-portal-api.onrender.com/api/health`
- [ ] **Live Netlify Frontend URL**: `https://techfest-2026.netlify.app`

---

*Engineered with excellence for Tech-Fest 2026.*
