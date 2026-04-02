# 🌸 Japanese Learning Web Application

A comprehensive and interactive platform for learning Japanese, featuring vocabulary, kanji, and kana lessons, along with dynamic quizzes, progress tracking, and achievements.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS for modern, responsive, and aesthetic UI
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Authentication**: OAuth Integration with `@react-oauth/google` and `react-facebook-login`
- **HTTP Client**: Axios

### Backend
- **Environment**: Node.js & Express.js
- **Database**: MySQL (via `mysql2` driver) - fully compatible with cloud deployments like Railway
- **Authentication**: `bcrypt` for password hashing, JSON Web Tokens (`jsonwebtoken`) for session management
- **Architecture**: Modular routing, centralized global error handling, and robust `asyncHandler` wrappers

## 🌟 Key Features

- **Secure User Authentication**: Support for traditional email/password login as well as Social Auth (Google & Facebook).
- **Structured Learning Modules**: Specialized sections for mastering Kana (Hiragana & Katakana), Kanji, and Vocabulary based on selected levels (e.g., N5).
- **Interactive Quiz Engine**: Dynamic quiz challenges mapped to learning resources to reinforce retention.
- **Deep Progress & Analytics**: Advanced tracking of user performance, visualizing stats like total correct answers, accuracy percentage, time spent, daily streaks, and unlocking system achievements.

## 🗂️ Project Structure

```text
FinalProject_SS2/
├── frontend/       # React User Interface (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Progress, Kana, Vocab, etc.)
│   │   └── ...
├── backend/        # Node.js + Express API Server
│   ├── src/
│   │   ├── controllers/ # Request/Response handling logic
│   │   ├── models/      # Database mapping models
│   │   ├── routes/      # Express route definitions
│   │   └── seeders/     # DB population scripts
│   ├── data/            # Source JSON files used for database seeding
│   └── ...
└── README.md       # Project Documentation
```

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://www.mysql.com/) (v8+) or a cloud MySQL database like Railway

### 1. Database Setup
Ensure you have a MySQL server running either locally or in the cloud. Have your connection credentials ready.

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory by referring to the necessary variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=japanese_learning_db
   
   JWT_SECRET=super_secret_access_key
   JWT_REFRESH_SECRET=super_secret_refresh_key
   ```
4. Seed the database with initial study data (Optional but recommended):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`*

### 3. Frontend Setup
1. Navigate to the `frontend` directory from the project root:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_FACEBOOK_APP_ID=your_facebook_app_id
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be served at `http://localhost:5173`*

## 📚 API Endpoints Overview

All backend endpoints are prefixed with `/api`. Key endpoints include:

- **Authentication**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`
- **Users**: `/api/users/profile`, `/api/users/progress`, `/api/users/achievements`
- **Content**: `/api/lessons`, `/api/kana`, `/api/vocab`, `/api/kanji`
- **Quizzes**: `/api/quizzes`, `/api/quizzes/:quizId/questions`
- **Sessions**: `/api/sessions`, `/api/sessions/:sessionId/statistics`
