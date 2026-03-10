import express from 'express';
import { getKanjiQuiz } from '../controllers/vocabController.js';

const router = express.Router();

router.get('/quiz', getKanjiQuiz);

export default router;