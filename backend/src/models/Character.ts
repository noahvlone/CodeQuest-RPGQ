import mongoose, { Schema, Document } from 'mongoose';

export type CharacterClass =
    | 'FRONTEND_WARRIOR'
    | 'BACKEND_MAGE'
    | 'FULLSTACK_RANGER'
    | 'NEURAL_HACKER'      // Data Science
    | 'QUANTUM_ARCHITECT'  // AI/ML Engineering
    | 'CLOUD_PHANTOM'      // DevOps
    | 'CIPHER_GUARDIAN'    // Cybersecurity
    | 'PIXEL_RONIN';       // Mobile Development

export interface ISkills {
    javascript: number;
    python: number;
    css: number;
    algorithms: number;
    databases: number;
}

export interface ICharacter extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    class: CharacterClass;
    level: number;
    xp: number;
    maxXp: number;
    gold: number;
    skills: ISkills;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const skillsSchema = new Schema<ISkills>(
    {
        javascript: { type: Number, default: 0, min: 0, max: 100 },
        python: { type: Number, default: 0, min: 0, max: 100 },
        css: { type: Number, default: 0, min: 0, max: 100 },
        algorithms: { type: Number, default: 0, min: 0, max: 100 },
        databases: { type: Number, default: 0, min: 0, max: 100 },
    },
    { _id: false }
);

const characterSchema = new Schema<ICharacter>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 20,
        },
        class: {
            type: String,
            enum: [
                'FRONTEND_WARRIOR',
                'BACKEND_MAGE',
                'FULLSTACK_RANGER',
                'NEURAL_HACKER',
                'QUANTUM_ARCHITECT',
                'CLOUD_PHANTOM',
                'CIPHER_GUARDIAN',
                'PIXEL_RONIN'
            ],
            required: true,
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
        },
        xp: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxXp: {
            type: Number,
            default: 1000,
        },
        gold: {
            type: Number,
            default: 100,
            min: 0,
        },
        skills: {
            type: skillsSchema,
            default: () => ({
                javascript: 10,
                python: 5,
                css: 10,
                algorithms: 5,
                databases: 5,
            }),
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

// Calculate maxXp based on level
characterSchema.pre('save', function (next) {
    this.maxXp = this.level * 1000;
    next();
});

// Level up logic
characterSchema.methods.addXp = async function (amount: number): Promise<void> {
    this.xp += amount;

    while (this.xp >= this.maxXp) {
        this.xp -= this.maxXp;
        this.level += 1;
        this.maxXp = this.level * 1000;
    }

    await this.save();
};

export const Character = mongoose.model<ICharacter>('Character', characterSchema);
