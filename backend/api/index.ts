import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import { connectDB } from '../src/config/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Ensure database connection
    await connectDB();

    // Pass request to Express app
    // We need to cast because Vercel types and Express types might slightly differ
    // but Express 'app' is a valid handler for (req, res)
    return app(req as any, res as any);
}
