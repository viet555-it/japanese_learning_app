import express from 'express';

import authRoutes from './authRoutes.js';
import contentRoutes from './contentRoutes.js';
import progressRoutes from './progressRoutes.js';
import questionRoutes from './questionRoutes.js';
import sessionRoutes from './sessionRoutes.js';

const router = express.Router();

/**
 * Route Indexer
 * Centralizes all application routes for easy mounting and versioning (e.g., /api/v1)
 */

router.use('/auth', authRoutes);
router.use('/progress', progressRoutes);
router.use('/questions', questionRoutes);
router.use('/sessions', sessionRoutes);

// contentRoutes defines root level resources like /lessons, /kana, /kanji
router.use('/', contentRoutes);

export default router;
