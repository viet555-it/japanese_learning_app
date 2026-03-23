import express from 'express';
import { getLessons, getLessonById, getVocab, getKanji, getKana } from '../controllers/contentController.js';

const router = express.Router();

router.get('/lessons', getLessons);
router.get('/lessons/:id', getLessonById);
router.get('/vocab', getVocab);
router.get('/kanji', getKanji);
router.get('/kana', getKana);

export default router;
