import express from 'express';
import {
    getUserProgress,
    getUserHistory,
    getAllAchievements,
    getUserAchievements,
    checkAndUnlockAchievement
} from '../controllers/progressController.js';

const router = express.Router();

// Progress and History
router.get('/user/:userId', getUserProgress);
router.get('/history/:userId', getUserHistory);

// Achievements
router.get('/achievements', getAllAchievements);
router.get('/achievements/user/:userId', getUserAchievements);
router.post('/achievements/unlock', checkAndUnlockAchievement);

export default router;
