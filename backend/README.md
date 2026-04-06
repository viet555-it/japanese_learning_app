# ⚙️ GoJapan — Backend API Server

Express.js REST API server for the GoJapan Japanese learning application.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | v18+ | Runtime |
| **Express** | v5 | HTTP framework |
| **MySQL 2** | v3 | Database driver |
| **bcrypt** | v6 | Password hashing |
| **jsonwebtoken** | v9 | JWT access & refresh tokens |
| **google-auth-library** | v10 | Google OAuth token verification |
| **dotenv** | v17 | Environment variable loading |
| **cors** | v2 | Cross-Origin Resource Sharing |
| **nodemon** | v3 | Dev hot-reloading |

---

## 📁 Directory Structure

```
backend/
├── .env                    ← Environment variables (not committed)
├── package.json
├── data/                   ← JSON source files for seeding
│   ├── kana.json
│   ├── kanji.json
│   └── vocab.json
└── src/
    ├── server.js           ← Entry point: app setup, middleware, table init
    ├── config/
    │   └── db.js           ← MySQL connection pool (supports SSL for Railway)
    ├── controllers/        ← Request handling logic
    │   ├── authController.js       ← Register, login, OAuth, profile, JWT
    │   ├── contentController.js    ← Lessons, vocab, kanji, kana endpoints
    │   ├── feedbackController.js   ← Submit, list, upvote feedback
    │   ├── progressController.js   ← Progress stats, history, achievements
    │   ├── questionController.js   ← Quiz CRUD and question fetching
    │   └── sessionController.js    ← Training session create & save stats
    ├── middlewares/
    │   ├── authMiddleware.js       ← JWT Bearer token verification
    │   └── errorHandler.js        ← Global async error handler
    ├── routes/
    │   ├── index.js                ← Mounts all routers under /api
    │   ├── authRoutes.js           ← /api/auth/*
    │   ├── contentRoutes.js        ← /api/lessons, /api/vocab, /api/kanji, /api/kana
    │   ├── feedbackRoutes.js       ← /api/feedback/*
    │   ├── progressRoutes.js       ← /api/progress/*
    │   ├── questionRoutes.js       ← /api/questions/*
    │   └── sessionRoutes.js        ← /api/sessions/*
    ├── seeders/
    │   └── seed.js                 ← Database population script
    └── utils/
        └── asyncHandler.js         ← Wraps async route handlers
```

---

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend/` root:

```env
# Server
PORT=5000

# Database (Local)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=japanese_learning_db
DB_PORT=3306

# Database (Cloud / Railway — use DATABASE_URL instead)
# DATABASE_URL=mysql://user:pass@host:port/dbname

# Authentication
JWT_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here

# OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Database Seed (Optional)

Populate the database with all lessons, vocabulary, kanji, kana, and quiz data:

```bash
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
# Runs at http://localhost:5000 with nodemon hot-reload
```

### 5. Run Production

```bash
npm start
```

---

## 📡 API Reference

All routes are prefixed with `/api`.

### 🔐 Authentication — `/api/auth`

| Method | Route | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Register with email & password |
| `POST` | `/auth/login` | ❌ | Login → returns `accessToken` + `refreshToken` |
| `POST` | `/auth/refresh` | ❌ | Exchange refresh token for new access token |
| `POST` | `/auth/logout` | ❌ | Invalidate refresh token |
| `POST` | `/auth/google` | ❌ | Verify Google ID token → returns app tokens |
| `POST` | `/auth/facebook` | ❌ | Verify Facebook access token → returns app tokens |
| `GET` | `/auth/profile` | ✅ Bearer | Get authenticated user's profile |
| `PUT` | `/auth/profile` | ✅ Bearer | Update authenticated user's profile |

---

### 📚 Content — `/api`

| Method | Route | Query Params | Description |
|---|---|---|---|
| `GET` | `/lessons` | `?type=Vocabulary&level=N5` | Get filtered lessons |
| `GET` | `/lessons/:id` | — | Get single lesson by ID |
| `GET` | `/vocab` | `?lessonId=1` | Get vocabulary for a lesson |
| `GET` | `/kanji` | `?lessonId=1` | Get kanji for a lesson |
| `GET` | `/kana` | — | Get all kana characters |

---

### 🧩 Quiz & Questions — `/api/questions`

| Method | Route | Description |
|---|---|---|
| `GET` | `/questions` | List all quizzes, filterable by `?lessonId=1` |
| `GET` | `/questions/:quizId` | Get quiz info and its questions |
| `GET` | `/questions/:quizId/questions` | Alias — get questions for a quiz |
| `POST` | `/questions` | Create a new quiz |
| `PUT` | `/questions/:id` | Update a quiz |
| `DELETE` | `/questions/:id` | Delete a quiz |
| `POST` | `/questions/:quizId/items` | Add question items to a quiz |

---

### 🎮 Training Sessions — `/api/sessions`

| Method | Route | Body | Description |
|---|---|---|---|
| `POST` | `/sessions/create` | `{ userId, lessonId }` | Start a new session, returns `sessionId` |
| `POST` | `/sessions/save-statistic` | `{ sessionId, score, accuracyRate, timeTaken, heartsRemaining }` | Save completed session results |

---

### 📊 Progress — `/api/progress`

| Method | Route | Description |
|---|---|---|
| `GET` | `/progress/user/:userId` | Get overall progress summary (sessions, accuracy) |
| `GET` | `/progress/history/:userId` | Full session history for a user |
| `GET` | `/progress/login-history/:userId` | Login/visit history for streak calendar |
| `GET` | `/progress/achievements` | Get all available achievements |
| `GET` | `/progress/achievements/user/:userId` | Get achievements unlocked by a user |
| `POST` | `/progress/achievements/unlock` | Body: `{ userId, achievementId }` — unlock achievement |

---

### 💬 Feedback — `/api/feedback`

| Method | Route | Description |
|---|---|---|
| `GET` | `/feedback` | Get all community feedback posts (sorted newest first) |
| `POST` | `/feedback` | Submit feedback: `{ user_id, rating, category, description, image_data? }` |
| `PATCH` | `/feedback/:id/upvote` | Increment upvote count for a post |

---

## 🗄️ Database Tables

The following tables are used (created via seeders or auto-initialized at startup):

| Table | Description |
|---|---|
| `user` | User accounts (email, password hash, display name, avatar) |
| `refresh_tokens` | Stored refresh tokens for JWT rotation |
| `lesson` | Learning units grouped by type (Kana/Vocab/Kanji) and JLPT level |
| `vocabulary` | Vocabulary words linked to lessons |
| `kanji` | Kanji characters with onyomi/kunyomi readings |
| `kana` | Hiragana and Katakana character table |
| `quiz` | Quiz entities linked to a lesson |
| `quiz_item` | Individual question entries in a quiz |
| `training_session` | Records of each training session per user |
| `session_statistic` | Accuracy, score, time for each session |
| `achievement` | Master list of all achievements |
| `user_achievement` | Tracks which achievements a user has unlocked |
| `user_login_history` | One record per user per day (for streak calendar) |
| `feedback` | Community feedback posts with upvote count |

---

## 🔒 Authentication Flow

```
1. User registers/logs in → server returns { accessToken, refreshToken }
2. Frontend stores tokens → accessToken in memory, refreshToken in localStorage
3. All protected requests send: Authorization: Bearer <accessToken>
4. When accessToken expires → POST /api/auth/refresh with { refreshToken }
5. Server issues new accessToken
6. On logout → POST /api/auth/logout to invalidate refreshToken
```

Social login (Google / Facebook) follows the same flow — the frontend sends the provider token, the server verifies it and returns its own JWT pair.
