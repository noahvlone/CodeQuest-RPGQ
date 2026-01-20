import mongoose, { Schema, Document } from 'mongoose';

export type ProgressStatus = 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';

export interface IChallengeProgress extends Document {
    _id: mongoose.Types.ObjectId;
    characterId: mongoose.Types.ObjectId;
    challengeId: mongoose.Types.ObjectId;
    status: ProgressStatus;
    submittedCode: string;
    attempts: number;
    bestTime: number | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const challengeProgressSchema = new Schema<IChallengeProgress>(
    {
        characterId: {
            type: Schema.Types.ObjectId,
            ref: 'Character',
            required: true,
        },
        challengeId: {
            type: Schema.Types.ObjectId,
            ref: 'Challenge',
            required: true,
        },
        status: {
            type: String,
            enum: ['LOCKED', 'UNLOCKED', 'IN_PROGRESS', 'COMPLETED'],
            default: 'LOCKED',
        },
        submittedCode: {
            type: String,
            default: '',
        },
        attempts: {
            type: Number,
            default: 0,
            min: 0,
        },
        bestTime: {
            type: Number,
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique progress per character per challenge
challengeProgressSchema.index({ characterId: 1, challengeId: 1 }, { unique: true });

export const ChallengeProgress = mongoose.model<IChallengeProgress>('ChallengeProgress', challengeProgressSchema);
