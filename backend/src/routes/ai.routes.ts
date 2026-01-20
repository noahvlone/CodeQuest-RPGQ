import { Router, Response } from 'express';
import { z } from 'zod';
import { aiService } from '../services/ai.service.js';
import { gameService } from '../services/game.service.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(aiLimiter);

// Chat validation schema
const chatSchema = z.object({
    body: z.object({
        message: z.string().min(1).max(1000),
        context: z.string().optional(),
    }),
});

// Chat with AI mentor
router.post('/chat', validate(chatSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { message, context } = req.body;

        const character = await gameService.getActiveCharacter(req.userId!);
        const characterContext = character
            ? `Player: ${character.name}, Class: ${character.class}, Level: ${character.level}`
            : undefined;

        const response = await aiService.chat(
            message,
            context || characterContext
        );

        res.json({ message: response });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Review code validation schema
const reviewSchema = z.object({
    body: z.object({
        code: z.string().min(1),
        challengeTitle: z.string().min(1),
    }),
});

// Review code
router.post('/review', validate(reviewSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { code, challengeTitle } = req.body;
        const review = await aiService.reviewCode(code, challengeTitle);
        res.json({ review });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get hint validation schema
const hintSchema = z.object({
    body: z.object({
        challengeDescription: z.string().min(1),
        currentCode: z.string(),
    }),
});

// Get hint
router.post('/hint', validate(hintSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { challengeDescription, currentCode } = req.body;
        const hint = await aiService.getHint(challengeDescription, currentCode);
        res.json({ hint });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
