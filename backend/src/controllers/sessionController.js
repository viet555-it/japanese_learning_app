import db from '../config/db.js';

export const createSession = async (req, res) => {
    try {
        const { difficultyMode, quizMode, levelId, categoryId } = req.body;

        const [result] = await db.query(
            `INSERT INTO quiz_sessions (DifficultyMode, QuizMode, LevelID, CategoryID) 
             VALUES (?, ?, ?, ?)`,
            [difficultyMode, quizMode, levelId, categoryId]
        );

        res.status(201).json({ sessionId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveStatistic = async (req, res) => {
    try {
        const { sessionId, correctCount, wrongCount, avgTime } = req.body;
        
        const accuracyRate = (correctCount / (correctCount + wrongCount)) * 100;

        await db.query(
            `INSERT INTO statistic (SessionID, CorrectCount, WrongCount, AccuracyRate, AvgTime) 
             VALUES (?, ?, ?, ?, ?)`,
            [sessionId, correctCount, wrongCount, accuracyRate, avgTime]
        );

        res.json({ message: "Saved statistics session" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};