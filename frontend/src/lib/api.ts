import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use((config) => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Clear token and redirect to login
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth
    async register(email: string, username: string, password: string) {
        const { data } = await this.client.post('/auth/register', { email, username, password });
        return data;
    }

    async login(email: string, password: string) {
        const { data } = await this.client.post('/auth/login', { email, password });
        return data;
    }

    async getMe() {
        const { data } = await this.client.get('/auth/me');
        return data;
    }

    getGitHubAuthUrl() {
        return `${API_URL}/auth/github`;
    }

    getGoogleAuthUrl() {
        return `${API_URL}/auth/google`;
    }

    async updateProfile(name: string, avatarUrl?: string) {
        const { data } = await this.client.put('/characters/profile', { name, avatarUrl });
        return data;
    }

    // Characters
    async createCharacter(name: string, characterClass: string) {
        const { data } = await this.client.post('/characters', { name, characterClass });
        return data;
    }

    async getActiveCharacter() {
        const { data } = await this.client.get('/characters/active');
        return data;
    }

    async getCharacterProgress() {
        const { data } = await this.client.get('/characters/progress');
        return data;
    }

    async getInventory() {
        const { data } = await this.client.get('/characters/inventory');
        return data;
    }

    // Challenges
    async getChallenges() {
        const { data } = await this.client.get('/challenges');
        return data;
    }

    async getChallenge(id: string) {
        const { data } = await this.client.get(`/challenges/${id}`);
        return data;
    }

    async executeCode(challengeId: string, code: string) {
        const { data } = await this.client.post(`/challenges/${challengeId}/execute`, { code });
        return data;
    }

    // AI
    async chatWithAI(message: string, context?: string) {
        const { data } = await this.client.post('/ai/chat', { message, context });
        return data;
    }

    async reviewCode(code: string, challengeTitle: string) {
        const { data } = await this.client.post('/ai/review', { code, challengeTitle });
        return data;
    }

    async getHint(challengeDescription: string, currentCode: string) {
        const { data } = await this.client.post('/ai/hint', { challengeDescription, currentCode });
        return data;
    }

    // Shop
    async getShopItems() {
        const { data } = await this.client.get('/shop/items');
        return data;
    }

    async purchaseItem(itemId: string) {
        const { data } = await this.client.post(`/shop/purchase/${itemId}`);
        return data;
    }

    async equipItem(itemId: string) {
        const { data } = await this.client.post(`/shop/equip/${itemId}`);
        return data;
    }

    // Leaderboard
    async getLeaderboard(limit = 10) {
        const { data } = await this.client.get(`/leaderboard?limit=${limit}`);
        return data;
    }

    // Health check
    async healthCheck() {
        const { data } = await this.client.get('/health');
        return data;
    }
}

export const api = new ApiClient();
