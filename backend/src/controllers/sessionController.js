import db from '../config/db.js';

export const createSession = async (req, res) => {
    try {
        // UserID can be null if it's a guest
        const { userId, lessonId } = req.body;

        if (!lessonId) {
            return res.status(400).json({ message: "lessonId is required" });
        }

        const [result] = await db.query(
            `INSERT INTO quiz_sessions (UserID, LessonID, StartTime) 
             VALUES (?, ?, NOW())`,
            [userId || null, lessonId]
        );

        res.status(201).json({ sessionId: result.insertId });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ message: error.message });
    }
};

export const saveStatistic = async (req, res) => {
    try {
        const { sessionId, score, accuracyRate, timeTaken, heartsRemaining } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ message: "sessionId is required" });
        }

        // Update the end time on the session
        await db.query('UPDATE quiz_sessions SET EndTime = NOW() WHERE SessionID = ?', [sessionId]);

        // Insert statistics
        await db.query(
            `INSERT INTO statistic (SessionID, Score, AccuracyRate, TimeTaken, HeartsRemaining) 
             VALUES (?, ?, ?, ?, ?)`,
            [sessionId, score || 0, accuracyRate || 0, timeTaken || 0, heartsRemaining || null]
        );

        res.json({ message: "Saved statistics session" });
    } catch (error) {
        console.error("Error saving stats:", error);
        res.status(500).json({ message: error.message });
    }
};