# Japanese Learning App - Backend 🌸

This is the backend API for an interactive, gamified Japanese Learning Web Platform. It serves vocabulary, kanji, and kana lessons (JLPT N5 to N1), powers custom quizzes, and tracks user study progress and achievements.

## 🚀 Features
* **Authentication**: JWT-based secure login, registration, and refresh-token sessions.
* **Learning Content**: Serves structured data for Vocabulary, Kanji, and Kana by JLPT levels.
* **Quiz Engine**: Admin tools to create quizzes, attach questions, and fetch randomized testing sessions.
* **Gamification & Progress**: Tracks user quiz sessions, calculates average accuracy/time, handles streaks, and rewards users with unlockable Achievements.

## 📂 Architecture & Scaling
The backend was restructured for **maintainability and scalability**:
* `src/server.js`: Purely handles the port listener and bootstrap operations.
* `src/app.js`: Express application configuration, isolated for easy testing plugins and middlewares.
* `src/routes/index.js`: A centralized router index. Allows for easy API versioning (e.g. `/api/v1`) in the future.
* `src/middlewares/`: Global middlewares, such as a centralized `errorHandler.js` preventing unexpected server crashes, and `authMiddleware.js` for JWT security.
* `src/controllers/`: Separated by domain logic (Auth, Progress, Content, Quiz, Sessions).

## 🛠 Prerequisites
* **Node.js**: v18+
* **MySQL**: v8+ (with `japanese_learning_db` created)

## 📦 Setup & Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Create a `.env` file in the `backend/` root directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=japanese_learning_db
   JWT_SECRET=your_super_secret_access_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   NODE_ENV=development
   ```

3. Seed the database. This script wipes old data and cleanly structures your lessons, kanji, vocab, and quizzes.
   ```bash
   npm run seed
   ```

4. Start the server (Development mode using nodemon):
   ```bash
   npm run dev
   ```

## 🌐 Core API Endpoints

### Authentication (`/api/auth`)
* `POST /register`: Register a new user
* `POST /login`: Get Access & Refresh JWT tokens
* `POST /refresh`: Generate a new access token
* `GET /profile`: Fetch auth user details & streaks

### Progress & Gameplay (`/api/sessions`, `/api/progress`)
* `POST /api/sessions`: Initialize a new quiz session
* `POST /api/sessions/statistics`: Save score & accuracy at the end of a quiz
* `GET /api/progress/user/:id`: Retrieve historical metrics (Total Time, Average Accuracy)
* `GET /api/progress/history/:id`: Get recent timeline of completed lessons
* `GET /api/progress/achievements/user/:id`: See badges unlocked by a user

### Quizzes (`/api/questions`)
* `GET /api/questions`: List available testing quizzes
* `GET /api/questions/:id`: Get actual questions attached to a quiz wrapper
* `POST /api/questions`: (Admin) Generate a new quiz 
* `POST /api/questions/:id/items`: (Admin) Attach Vocabulary/Kanji/Kana IDs to the quiz

### Learning Library (`/api`)
* `GET /api/lessons?level=N5`: Returns JLPT lessons
* `GET /api/vocab?lessonId=1`: Fetch vocabulary for a specific lesson
* `GET /api/kanji?lessonId=418`: Fetch kanji for a specific lesson
* `GET /api/kana?lessonId=545`: Fetch katakana/hiragana

## 🤝 Contribution
When adding new domains:
1. Create your controller in `src/controllers/`.
2. Map your routes in `src/routes/`.
3. Register the new route file into the indexer at `src/routes/index.js`.
