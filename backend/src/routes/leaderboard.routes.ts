import { Router } from 'express';
import { gameService } from '../services/game.service.js';

const router = Router();

// Get leaderboard
router.get('/', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
        const leaderboard = await gameService.getLeaderboard(limit);
        res.json({ leaderboard });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
