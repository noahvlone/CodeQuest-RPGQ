import axios from 'axios';
import { env } from '../config/env.js';

interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

const SYSTEM_PROMPT = `You are "The Architect", an AI mentor in CodeQuest RPG - a cyberpunk coding education game set in Neo-Jakarta 2077. 

Your personality:
- Speak in a cool, technical, cyberpunk style
- Use Indonesian or English based on user's language
- Be encouraging but honest about code quality
- Give concise, actionable feedback
- Reference the game's lore when appropriate

Your role:
- Review code and provide helpful feedback
- Give hints without revealing full solutions
- Explain programming concepts in engaging ways
- Celebrate victories and encourage after failures`;

export class AIService {
    private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    private model = env.OPENROUTER_MODEL;
    private apiKey = env.OPENROUTER_API_KEY;

    async chat(userMessage: string, context?: string): Promise<string> {
        try {
            const messages: OpenRouterMessage[] = [
                { role: 'system', content: SYSTEM_PROMPT },
            ];

            if (context) {
                messages.push({
                    role: 'system',
                    content: `Current context: ${context}`
                });
            }

            messages.push({ role: 'user', content: userMessage });

            const response = await axios.post<OpenRouterResponse>(
                this.apiUrl,
                {
                    model: this.model,
                    messages,
                    max_tokens: 500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://codequest-rpg.vercel.app',
                        'X-Title': 'CodeQuest RPG',
                    },
                }
            );

            return response.data.choices[0]?.message?.content ||
                'Neural link error. Tidak bisa terhubung ke Architect.';
        } catch (error) {
            console.error('AI Service Error:', error);
            return 'Koneksi ke Architect terganggu. Coba lagi nanti, debugger.';
        }
    }

    async reviewCode(code: string, challengeTitle: string): Promise<string> {
        const prompt = `Review kode ini untuk tantangan "${challengeTitle}":

\`\`\`
${code}
\`\`\`

Berikan review singkat (maksimal 3 poin) tentang:
1. Apakah pendekatan sudah benar?
2. Ada bug atau improvement?
3. Tips untuk optimasi`;

        return this.chat(prompt);
    }

    async getHint(challengeDescription: string, currentCode: string): Promise<string> {
        const prompt = `Player membutuhkan hint untuk tantangan ini:
"${challengeDescription}"

Kode mereka saat ini:
\`\`\`
${currentCode}
\`\`\`

Berikan 1 hint yang membantu tanpa memberikan jawaban langsung.`;

        return this.chat(prompt);
    }

    async celebrateVictory(challengeTitle: string, timeTaken: number): Promise<string> {
        const prompt = `Player berhasil menyelesaikan "${challengeTitle}" dalam ${timeTaken} detik! 
Berikan ucapan selamat singkat dengan gaya cyberpunk.`;

        return this.chat(prompt);
    }
}

export const aiService = new AIService();
