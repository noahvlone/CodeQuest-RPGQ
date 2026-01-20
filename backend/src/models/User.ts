import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    username: string;
    password?: string;
    avatarUrl?: string;
    githubId?: string;
    googleId?: string;
    provider: 'local' | 'github' | 'google';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        avatarUrl: {
            type: String,
            default: '',
        },
        githubId: {
            type: String,
            unique: true,
            sparse: true,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        provider: {
            type: String,
            enum: ['local', 'github', 'google'],
            default: 'local',
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
