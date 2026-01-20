import { Router, Response } from 'express';
import { shopService } from '../services/shop.service.js';
import { gameService } from '../services/game.service.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Get all items
router.get('/items', async (_req, res) => {
    try {
        const items = await shopService.getAllItems();
        res.json({ items });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Purchase item
router.post('/purchase/:itemId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const character = await gameService.getActiveCharacter(req.userId!);
        if (!character) {
            res.status(400).json({ error: 'No active character' });
            return;
        }

        const result = await shopService.purchaseItem(
            character._id.toString(),
            req.params.itemId
        );

        if (!result.success) {
            res.status(400).json({ error: result.message });
            return;
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Equip item
router.post('/equip/:itemId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const character = await gameService.getActiveCharacter(req.userId!);
        if (!character) {
            res.status(400).json({ error: 'No active character' });
            return;
        }

        const success = await shopService.equipItem(
            character._id.toString(),
            req.params.itemId
        );

        if (!success) {
            res.status(400).json({ error: 'Cannot equip this item' });
            return;
        }

        res.json({ message: 'Item equipped' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Unequip item
router.post('/unequip/:itemId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const character = await gameService.getActiveCharacter(req.userId!);
        if (!character) {
            res.status(400).json({ error: 'No active character' });
            return;
        }

        const success = await shopService.unequipItem(
            character._id.toString(),
            req.params.itemId
        );

        if (!success) {
            res.status(400).json({ error: 'Cannot unequip this item' });
            return;
        }

        res.json({ message: 'Item unequipped' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
