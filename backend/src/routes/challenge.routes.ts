import { Router, Response } from 'express';
import { z } from 'zod';
import { Challenge } from '../models/Challenge.js';
import { ChallengeProgress } from '../models/ChallengeProgress.js';
import { gameService } from '../services/game.service.js';
import { codeRunnerService } from '../services/codeRunner.service.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { executionLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Get all challenges (grouped by category)
router.get('/', async (req, res) => {
    try {
        const challenges = await Challenge.find({ isActive: true })
            .select('-solutionCode -testCases')
            .sort({ requiredLevel: 1, order: 1 });

        // Group by category
        const grouped = challenges.reduce((acc, challenge) => {
            if (!acc[challenge.category]) {
                acc[challenge.category] = [];
            }
            acc[challenge.category].push(challenge);
            return acc;
        }, {} as Record<string, typeof challenges>);

        res.json({ challenges: grouped });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get single challenge (with user progress if authenticated)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const challenge = await Challenge.findById(req.params.id)
            .select('-solutionCode');

        if (!challenge) {
            res.status(404).json({ error: 'Challenge not found' });
            return;
        }

        // Get user's progress
        const character = await gameService.getActiveCharacter(req.userId!);
        let progress = null;

        if (character) {
            progress = await ChallengeProgress.findOne({
                characterId: character._id,
                challengeId: challenge._id,
            });
        }

        // Filter hidden test cases
        const visibleTestCases = challenge.testCases.filter(tc => !tc.isHidden);

        res.json({
            challenge: {
                ...challenge.toObject(),
                testCases: visibleTestCases,
            },
            progress,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Execute code validation schema
const executeSchema = z.object({
    body: z.object({
        code: z.string().min(1, 'Code is required'),
    }),
});

// Execute code for a challenge
router.post(
    '/:id/execute',
    authMiddleware,
    executionLimiter,
    validate(executeSchema),
    async (req: AuthRequest, res: Response) => {
        try {
            const challenge = await Challenge.findById(req.params.id);
            if (!challenge) {
                res.status(404).json({ error: 'Challenge not found' });
                return;
            }

            const character = await gameService.getActiveCharacter(req.userId!);
            if (!character) {
                res.status(400).json({ error: 'No active character' });
                return;
            }

            // Check if challenge is unlocked
            const progress = await ChallengeProgress.findOne({
                characterId: character._id,
                challengeId: challenge._id,
            });

            if (!progress || progress.status === 'LOCKED') {
                res.status(403).json({ error: 'Challenge is locked' });
                return;
            }

            const { code } = req.body;

            // Run code against test cases
            const validation = await codeRunnerService.validateSolution(
                code,
                challenge.language,
                challenge.testCases
            );

            // Calculate damage/rewards
            const damage = codeRunnerService.calculateDamage(
                validation.passedTests,
                validation.totalTests,
                challenge.xpReward
            );

            // Update progress
            progress.status = 'IN_PROGRESS';
            progress.attempts += 1;
            progress.submittedCode = code;
            await progress.save();

            // Handle completion
            let rewards = null;
            if (validation.allPassed) {
                const result = await gameService.completeChallenge(
                    character._id.toString(),
                    challenge._id.toString(),
                    code,
                    validation.executionTime
                );
                rewards = {
                    xp: result.xpGained,
                    gold: result.goldGained,
                    character: result.character,
                };
            }

            // Filter hidden test case details from response
            const filteredResults = validation.results.map(r => ({
                passed: r.passed,
                input: r.isHidden ? '[hidden]' : r.input,
                expectedOutput: r.isHidden ? '[hidden]' : r.expectedOutput,
                actualOutput: r.isHidden ? (r.passed ? '✓' : '✗') : r.actualOutput,
            }));

            res.json({
                success: validation.allPassed,
                damage,
                testResults: filteredResults,
                passedTests: validation.passedTests,
                totalTests: validation.totalTests,
                executionTime: validation.executionTime,
                rewards,
            });
        } catch (error: any) {
            console.error('Execution error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

export default router;
