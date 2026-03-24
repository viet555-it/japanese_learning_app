import db from '../config/db.js';

/**
 * Get overall learning statistics for a specific user
 * This calculates overall performance for the Progress Page
 */
export const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;

        // Query to get overall aggregated stats for a user
        const query = `
            SELECT 
                COUNT(qs.SessionID) as totalSessions,
                SUM(s.Score) as totalScore,
                AVG(s.AccuracyRate) as averageAccuracy,
                SUM(s.TimeTaken) as totalTimeSpent
            FROM quiz_sessions qs
            JOIN statistic s ON qs.SessionID = s.SessionID
            WHERE qs.UserID = ? AND qs.EndTime IS NOT NULL
        `;

        const [stats] = await db.query(query, [userId]);
        
        // Return structured data for the frontend chart
        res.json({
            totalSessions: stats[0].totalSessions || 0,
            totalScore: stats[0].totalScore || 0,
            averageAccuracy: stats[0].averageAccuracy ? parseFloat(stats[0].averageAccuracy).toFixed(2) : 0,
            totalTimeSpent: stats[0].totalTimeSpent || 0 // In seconds
        });
    } catch (error) {
        console.error("Error fetching user progress:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get recent learning history for a user
 */
export const getUserHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const query = `
            SELECT 
                qs.SessionID,
                qs.StartTime,
                qs.EndTime,
                l.Title as LessonTitle,
                l.Type as LessonType,
                l.JLPT_Level,
                s.Score,
                s.AccuracyRate,
                s.TimeTaken,
                s.HeartsRemaining
            FROM quiz_sessions qs
            JOIN statistic s ON qs.SessionID = s.SessionID
            JOIN lesson l ON qs.LessonID = l.LessonID
            WHERE qs.UserID = ?
            ORDER BY qs.StartTime DESC
            LIMIT 50
        `;
        
        const [history] = await db.query(query, [userId]);
        res.json(history);
    } catch (error) {
        console.error("Error fetching user history:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * List all available system achievements
 */
export const getAllAchievements = async (req, res) => {
    try {
        const [achievements] = await db.query('SELECT * FROM achievement');
        res.json(achievements);
    } catch (error) {
        console.error("Error fetching achievements:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * List achievements unlocked by the specific user
 */
export const getUserAchievements = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const query = `
            SELECT a.AchievementID, a.Title, a.Description, a.IconURL, ua.EarnedAt
            FROM user_achievement ua
            JOIN achievement a ON ua.AchievementID = a.AchievementID
            WHERE ua.UserID = ?
            ORDER BY ua.EarnedAt DESC
        `;
        
        const [userAchievements] = await db.query(query, [userId]);
        res.json(userAchievements);
    } catch (error) {
        console.error("Error fetching user achievements:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Check and Unlock Achievement (Internal / Backend Trigger usually, but exposed as POST for testing)
 */
export const checkAndUnlockAchievement = async (req, res) => {
    try {
        const { userId, achievementId } = req.body;
        
        if (!userId || !achievementId) {
            return res.status(400).json({ message: "userId and achievementId are required" });
        }
        
        // Check if user already has it
        const [existing] = await db.query(
            'SELECT * FROM user_achievement WHERE UserID = ? AND AchievementID = ?', 
            [userId, achievementId]
        );
        
        if (existing.length > 0) {
            return res.json({ message: "Achievement already unlocked", unlocked: false });
        }
        
        // Insert new achievement
        await db.query(
            'INSERT INTO user_achievement (UserID, AchievementID, EarnedAt) VALUES (?, ?, NOW())',
            [userId, achievementId]
        );
        
        res.status(201).json({ message: "Achievement unlocked successfully!", unlocked: true });
    } catch (error) {
        console.error("Error unlocking achievement:", error);
        res.status(500).json({ message: error.message });
    }
};
