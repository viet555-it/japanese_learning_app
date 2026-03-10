import express from 'express';
import { getUnitsByLevel, getVocabQuiz } from '../controllers/kanjiController.js';

const router = express.Router();

router.get('/units/:levelId', getUnitsByLevel);
router.get('/quiz', getVocabQuiz);

export default router;