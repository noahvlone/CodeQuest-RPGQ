import { Router, Response } from 'express';
import { z } from 'zod';
import { gameService } from '../services/game.service.js';
import { authService } from '../services/auth.service.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

// All character routes require auth
router.use(authMiddleware);

// Validation schemas
const createCharacterSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(20),
        characterClass: z.enum([
            'FRONTEND_WARRIOR', 'BACKEND_MAGE', 'FULLSTACK_RANGER',
            'NEURAL_HACKER', 'QUANTUM_ARCHITECT', 'CLOUD_PHANTOM',
            'CIPHER_GUARDIAN', 'PIXEL_RONIN'
        ]),
    }),
});

const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(20).optional(),
        avatarUrl: z.string().url().optional().or(z.literal('')),
    }),
});

// Create character
router.post('/', validate(createCharacterSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { name, characterClass } = req.body;
        const character = await gameService.createCharacter({
            userId: req.userId!,
            name,
            characterClass,
        });
        res.status(201).json({ character });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Get active character
router.get('/active', async (req: AuthRequest, res: Response) => {
    try {
        const character = await gameService.getActiveCharacter(req.userId!);
        if (!character) {
            res.status(404).json({ error: 'No active character found' });
            return;
        }
        res.json({ character });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get character progress
router.get('/progress', async (req: AuthRequest, res: Response) => {
    try {
        const character = await gameService.getActiveCharacter(req.userId!);
        if (!character) {
            res.status(404).json({ error: 'No active character found' });
            return;
        }

        const progress = await gameService.getCharacterProgress(character._id.toString());
        res.json({ progress });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get inventory
router.get('/inventory', async (req: AuthRequest, res: Response) => {
    try {
        const character = await gameService.getActiveCharacter(req.userId!);
        if (!character) {
            res.status(404).json({ error: 'No active character found' });
            return;
        }

        const inventory = await gameService.getInventory(character._id.toString());
        res.json({ inventory });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.put('/profile', validate(updateProfileSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { name, avatarUrl } = req.body;

        // Update user avatar
        if (avatarUrl !== undefined) {
            await authService.updateAvatar(req.userId!, avatarUrl);
        }

        // Update active character name
        if (name) {
            const character = await gameService.getActiveCharacter(req.userId!);
            if (character) {
                character.name = name;
                await character.save();
            }
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
