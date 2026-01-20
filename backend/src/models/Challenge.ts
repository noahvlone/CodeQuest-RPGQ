import mongoose, { Schema, Document } from 'mongoose';
import { CharacterClass } from './Character.js';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type ChallengeCategory = 'SYNTAX' | 'LOGIC' | 'ALGORITHMS' | 'DATA_STRUCTURES' | 'DATABASES' | 'DATA_SCIENCE' | 'AI_ML' | 'DEVOPS' | 'SECURITY' | 'MOBILE';
export type Language = 'javascript' | 'python';

export interface ITestCase {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

export interface IChallenge extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    narrative: string;
    difficulty: Difficulty;
    category: ChallengeCategory;
    language: Language;
    starterCode: string;
    solutionCode: string;
    testCases: ITestCase[];
    xpReward: number;
    goldReward: number;
    requiredLevel: number;
    order: number;
    targetClasses: CharacterClass[];  // Empty = all classes
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const testCaseSchema = new Schema<ITestCase>(
    {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
    },
    { _id: false }
);

const challengeSchema = new Schema<IChallenge>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        narrative: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD', 'EXPERT'],
            required: true,
        },
        category: {
            type: String,
            enum: ['SYNTAX', 'LOGIC', 'ALGORITHMS', 'DATA_STRUCTURES', 'DATABASES', 'DATA_SCIENCE', 'AI_ML', 'DEVOPS', 'SECURITY', 'MOBILE'],
            required: true,
        },
        language: {
            type: String,
            enum: ['javascript', 'python'],
            default: 'javascript',
        },
        starterCode: {
            type: String,
            required: true,
        },
        solutionCode: {
            type: String,
            required: true,
        },
        testCases: {
            type: [testCaseSchema],
            required: true,
            validate: [(v: ITestCase[]) => v.length > 0, 'At least one test case required'],
        },
        xpReward: {
            type: Number,
            required: true,
            min: 0,
        },
        goldReward: {
            type: Number,
            required: true,
            min: 0,
        },
        requiredLevel: {
            type: Number,
            default: 1,
            min: 1,
        },
        order: {
            type: Number,
            default: 0,
        },
        targetClasses: {
            type: [String],
            enum: [
                'FRONTEND_WARRIOR', 'BACKEND_MAGE', 'FULLSTACK_RANGER',
                'NEURAL_HACKER', 'QUANTUM_ARCHITECT', 'CLOUD_PHANTOM',
                'CIPHER_GUARDIAN', 'PIXEL_RONIN'
            ],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

challengeSchema.index({ category: 1, order: 1 });
challengeSchema.index({ difficulty: 1 });

export const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema);
