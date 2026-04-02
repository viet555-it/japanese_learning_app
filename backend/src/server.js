import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import db from './config/db.js';

// Khởi tạo bảng login history (nếu chưa có) cho tính năng Visit Calendar
db.query(`
    CREATE TABLE IF NOT EXISTS user_login_history (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        LoginDate DATE NOT NULL,
        UNIQUE KEY unique_user_date (UserID, LoginDate),
        FOREIGN KEY (UserID) REFERENCES user(UserID) ON DELETE CASCADE
    )
`).catch(err => console.error("Table init error:", err));

import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', routes);

// Global Error Handler Middleware (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});