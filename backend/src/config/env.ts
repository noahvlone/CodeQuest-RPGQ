import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
    JWT_SECRET: z.string().min(1, 'JWT Secret is required'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    OPENROUTER_API_KEY: z.string().min(1, 'OpenRouter API Key is required'),
    OPENROUTER_MODEL: z.string().default('qwen/qwen-2.5-vl-7b-instruct:free'),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GITHUB_CALLBACK_URL: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CALLBACK_URL: z.string().optional(),
    FRONTEND_URL: z.string().default('http://localhost:3000'),
    PISTON_API_URL: z.string().default('https://emkc.org/api/v2/piston'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
