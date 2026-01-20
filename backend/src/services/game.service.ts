import mongoose from 'mongoose';
import { Character, ICharacter, CharacterClass } from '../models/Character.js';
import { ChallengeProgress } from '../models/ChallengeProgress.js';
import { Challenge } from '../models/Challenge.js';
import { Inventory } from '../models/Inventory.js';

interface CreateCharacterData {
    userId: string;
    name: string;
    characterClass: CharacterClass;
}

interface LeaderboardEntry {
    rank: number;
    character: {
        name: string;
        class: CharacterClass;
        level: number;
        xp: number;
    };
    user: {
        username: string;
        avatarUrl?: string;
    };
    totalXp: number;
}

export class GameService {
    async createCharacter(data: CreateCharacterData): Promise<ICharacter> {
        // Deactivate existing characters
        await Character.updateMany(
            { userId: data.userId },
            { isActive: false }
        );

        // Set initial skills based on class
        const classSkills = this.getClassSkills(data.characterClass);

        const character = await Character.create({
            userId: data.userId,
            name: data.name,
            class: data.characterClass,
            skills: classSkills,
        });

        // Initialize challenge progress - unlock first challenges for this class
        await this.initializeChallengeProgress(character._id.toString(), data.characterClass);

        return character;
    }

    private getClassSkills(characterClass: CharacterClass) {
        switch (characterClass) {
            case 'FRONTEND_WARRIOR':
                return { javascript: 15, python: 5, css: 20, algorithms: 5, databases: 5 };
            case 'BACKEND_MAGE':
                return { javascript: 10, python: 15, css: 5, algorithms: 10, databases: 15 };
            case 'FULLSTACK_RANGER':
                return { javascript: 12, python: 12, css: 10, algorithms: 8, databases: 8 };
            case 'NEURAL_HACKER':  // Data Scientist
                return { javascript: 8, python: 20, css: 2, algorithms: 15, databases: 10 };
            case 'QUANTUM_ARCHITECT':  // AI/ML Engineer
                return { javascript: 10, python: 18, css: 2, algorithms: 18, databases: 7 };
            case 'CLOUD_PHANTOM':  // DevOps
                return { javascript: 12, python: 15, css: 3, algorithms: 8, databases: 12 };
            case 'CIPHER_GUARDIAN':  // Cybersecurity
                return { javascript: 10, python: 15, css: 5, algorithms: 12, databases: 13 };
            case 'PIXEL_RONIN':  // Mobile Developer
                return { javascript: 18, python: 5, css: 15, algorithms: 10, databases: 7 };
            default:
                return { javascript: 10, python: 10, css: 10, algorithms: 10, databases: 10 };
        }
    }

    private async initializeChallengeProgress(characterId: string, characterClass: CharacterClass): Promise<void> {
        // Get challenges for this character class (or universal challenges with empty targetClasses)
        const challenges = await Challenge.find({
            isActive: true,
            $or: [
                { targetClasses: { $size: 0 } },  // Universal challenges
                { targetClasses: characterClass }  // Class-specific challenges
            ]
        }).sort({ requiredLevel: 1, order: 1 });

        const progressDocs = challenges.map((challenge, index) => ({
            characterId: new mongoose.Types.ObjectId(characterId),
            challengeId: challenge._id,
            status: index < 3 ? 'UNLOCKED' : 'LOCKED', // Unlock first 3 challenges
        }));

        await ChallengeProgress.insertMany(progressDocs);
    }

    async getActiveCharacter(userId: string): Promise<ICharacter | null> {
        return Character.findOne({ userId, isActive: true });
    }

    async getCharacterProgress(characterId: string) {
        const progress = await ChallengeProgress.find({ characterId })
            .populate('challengeId')
            .sort({ 'challengeId.order': 1 });

        return progress;
    }

    async addRewards(characterId: string, xp: number, gold: number): Promise<ICharacter> {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');

        character.xp += xp;
        character.gold += gold;

        // Level up check
        while (character.xp >= character.maxXp) {
            character.xp -= character.maxXp;
            character.level += 1;
            character.maxXp = character.level * 1000;

            // Unlock new challenges on level up
            await this.unlockChallengesForLevel(characterId, character.level);
        }

        await character.save();
        return character;
    }

    async updateSkill(characterId: string, skill: keyof typeof Character.prototype.skills, amount: number): Promise<void> {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');

        const currentValue = character.skills[skill as keyof typeof character.skills] || 0;
        const newValue = Math.min(100, currentValue + amount);

        character.skills[skill as keyof typeof character.skills] = newValue;
        await character.save();
    }

    private async unlockChallengesForLevel(characterId: string, level: number): Promise<void> {
        // Find locked challenges that should now be unlocked
        const challengesToUnlock = await Challenge.find({
            requiredLevel: { $lte: level },
            isActive: true,
        });

        for (const challenge of challengesToUnlock) {
            await ChallengeProgress.findOneAndUpdate(
                { characterId, challengeId: challenge._id, status: 'LOCKED' },
                { status: 'UNLOCKED' }
            );
        }
    }

    async completeChallenge(
        characterId: string,
        challengeId: string,
        submittedCode: string,
        executionTime: number
    ): Promise<{ character: ICharacter; xpGained: number; goldGained: number }> {
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) throw new Error('Challenge not found');

        const progress = await ChallengeProgress.findOne({ characterId, challengeId });
        if (!progress) throw new Error('Challenge progress not found');

        // Update progress
        const wasCompleted = progress.status === 'COMPLETED';
        progress.status = 'COMPLETED';
        progress.submittedCode = submittedCode;
        progress.attempts += 1;
        progress.completedAt = new Date();

        if (!progress.bestTime || executionTime < progress.bestTime) {
            progress.bestTime = executionTime;
        }

        await progress.save();

        // Only give rewards on first completion
        let xpGained = 0;
        let goldGained = 0;

        if (!wasCompleted) {
            xpGained = challenge.xpReward;
            goldGained = challenge.goldReward;

            const character = await this.addRewards(characterId, xpGained, goldGained);

            // Unlock next challenges
            await this.unlockNextChallenges(characterId, challengeId);

            return { character, xpGained, goldGained };
        }

        const character = await Character.findById(characterId);
        return { character: character!, xpGained, goldGained };
    }

    private async unlockNextChallenges(characterId: string, completedChallengeId: string): Promise<void> {
        const completedChallenge = await Challenge.findById(completedChallengeId);
        if (!completedChallenge) return;

        // Unlock the next 2 challenges in the same category or next category
        const nextChallenges = await Challenge.find({
            isActive: true,
            $or: [
                { category: completedChallenge.category, order: { $gt: completedChallenge.order } },
                { requiredLevel: { $lte: (await Character.findById(characterId))?.level || 1 } },
            ],
        }).limit(2);

        for (const challenge of nextChallenges) {
            await ChallengeProgress.findOneAndUpdate(
                { characterId, challengeId: challenge._id, status: 'LOCKED' },
                { status: 'UNLOCKED' }
            );
        }
    }

    async getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
        const characters = await Character.find({ isActive: true })
            .populate('userId', 'username avatarUrl')
            .sort({ level: -1, xp: -1 })
            .limit(limit);

        return characters.map((char, index) => ({
            rank: index + 1,
            character: {
                name: char.name,
                class: char.class,
                level: char.level,
                xp: char.xp,
            },
            user: {
                username: (char.userId as any).username,
                avatarUrl: (char.userId as any).avatarUrl,
            },
            totalXp: (char.level - 1) * 1000 + char.xp,
        }));
    }

    async getInventory(characterId: string) {
        return Inventory.find({ characterId }).populate('itemId');
    }
}

export const gameService = new GameService();
