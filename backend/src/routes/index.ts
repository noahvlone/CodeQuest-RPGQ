import { Router } from 'express';
import authRoutes from './auth.routes.js';
import characterRoutes from './character.routes.js';
import challengeRoutes from './challenge.routes.js';
import aiRoutes from './ai.routes.js';
import shopRoutes from './shop.routes.js';
import leaderboardRoutes from './leaderboard.routes.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'CodeQuest RPG API'
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/characters', characterRoutes);
router.use('/challenges', challengeRoutes);
router.use('/ai', aiRoutes);
router.use('/shop', shopRoutes);
router.use('/leaderboard', leaderboardRoutes);

export default router;
