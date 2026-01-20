import { Router, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { env } from '../config/env.js';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email'),
        username: z.string().min(3, 'Username must be at least 3 characters').max(20),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(1, 'Password is required'),
    }),
});

// Register
router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const result = await authService.register(email, username, password);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
});

// GitHub OAuth - initiate
router.get('/github', (req, res) => {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = env.GITHUB_CALLBACK_URL;
    const scope = 'read:user user:email';

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    res.redirect(githubAuthUrl);
});

// GitHub OAuth - callback
router.get('/github/callback', async (req, res) => {
    try {
        const { code } = req.query;

        if (!code || typeof code !== 'string') {
            res.redirect(`${env.FRONTEND_URL}/login?error=no_code`);
            return;
        }

        const result = await authService.githubAuth(code);

        // Redirect to frontend with token
        res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${result.token}`);
    } catch (error: any) {
        console.error('GitHub OAuth error:', error);
        res.redirect(`${env.FRONTEND_URL}/login?error=auth_failed`);
    }
});

// Google OAuth - initiate
router.get('/google', (req, res) => {
    const clientId = env.GOOGLE_CLIENT_ID;
    const redirectUri = env.GOOGLE_CALLBACK_URL;
    const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

    res.redirect(googleAuthUrl);
});

// Google OAuth - callback
router.get('/google/callback', async (req, res) => {
    try {
        const { code } = req.query;

        if (!code || typeof code !== 'string') {
            res.redirect(`${env.FRONTEND_URL}/login?error=no_code`);
            return;
        }

        const result = await authService.googleAuth(code);

        // Redirect to frontend with token
        res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${result.token}`);
    } catch (error: any) {
        console.error('Google OAuth error:', error);
        res.redirect(`${env.FRONTEND_URL}/login?error=auth_failed`);
    }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    res.json({ user: req.user });
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

export default router;
