import express from 'express';
import {
    getUserProgress,
    getUserHistory,
    getUserLoginHistory,
    getAllAchievements,
    getUserAchievements,
    checkAndUnlockAchievement
} from '../controllers/progressController.js';

const router = express.Router();

// Progress and History
router.get('/user/:userId', getUserProgress);
router.get('/history/:userId', getUserHistory);
router.get('/login-history/:userId', getUserLoginHistory);

// Achievements
router.get('/achievements', getAllAchievements);
router.get('/achievements/user/:userId', getUserAchievements);
router.post('/achievements/unlock', checkAndUnlockAchievement);

export default router;
