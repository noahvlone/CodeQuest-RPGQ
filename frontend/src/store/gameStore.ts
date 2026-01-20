import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
    _id: string;
    email: string;
    username: string;
    avatarUrl?: string;
    provider: string;
}

interface Character {
    _id: string;
    name: string;
    class: string;
    level: number;
    xp: number;
    maxXp: number;
    gold: number;
    skills: {
        javascript: number;
        python: number;
        css: number;
        algorithms: number;
        databases: number;
    };
}

interface GameState {
    // Auth
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Character
    character: Character | null;

    // UI State
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setCharacter: (character: Character | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Auth actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;
    handleOAuthCallback: (token: string) => Promise<void>;

    // Game actions
    fetchCharacter: () => Promise<void>;
    createCharacter: (name: string, characterClass: string) => Promise<void>;
    updateCharacter: (updates: Partial<Character>) => void;
    updateProfile: (name: string, avatarUrl?: string) => Promise<void>;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            token: null,
            isAuthenticated: false,
            character: null,
            isLoading: false,
            error: null,

            // Setters
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setToken: (token) => {
                if (token) {
                    localStorage.setItem('token', token);
                } else {
                    localStorage.removeItem('token');
                }
                set({ token });
            },
            setCharacter: (character) => set({ character }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),

            // Auth actions
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, token } = await api.login(email, password);
                    localStorage.setItem('token', token);
                    set({ user, token, isAuthenticated: true, isLoading: false });

                    // Fetch character after login
                    await get().fetchCharacter();
                } catch (err: any) {
                    set({
                        error: err.response?.data?.error || 'Login failed',
                        isLoading: false
                    });
                    throw err;
                }
            },

            register: async (email, username, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, token } = await api.register(email, username, password);
                    localStorage.setItem('token', token);
                    set({ user, token, isAuthenticated: true, isLoading: false });
                } catch (err: any) {
                    set({
                        error: err.response?.data?.error || 'Registration failed',
                        isLoading: false
                    });
                    throw err;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    character: null,
                    error: null
                });
            },

            handleOAuthCallback: async (token) => {
                set({ isLoading: true, error: null });
                try {
                    localStorage.setItem('token', token);
                    const { user } = await api.getMe();
                    set({ user, token, isAuthenticated: true, isLoading: false });

                    // Try to fetch character
                    await get().fetchCharacter();
                } catch (err: any) {
                    set({
                        error: err.response?.data?.error || 'Authentication failed',
                        isLoading: false
                    });
                    throw err;
                }
            },

            // Game actions
            fetchCharacter: async () => {
                try {
                    const { character } = await api.getActiveCharacter();
                    set({ character });
                } catch {
                    set({ character: null });
                }
            },

            createCharacter: async (name, characterClass) => {
                set({ isLoading: true, error: null });
                try {
                    const { character } = await api.createCharacter(name, characterClass);
                    set({ character, isLoading: false });
                } catch (err: any) {
                    set({
                        error: err.response?.data?.error || 'Failed to create character',
                        isLoading: false
                    });
                    throw err;
                }
            },

            updateCharacter: (updates) => {
                const current = get().character;
                if (current) {
                    set({ character: { ...current, ...updates } });
                }
            },

            updateProfile: async (name, avatarUrl) => {
                set({ isLoading: true, error: null });
                try {
                    await api.updateProfile(name, avatarUrl);

                    // Update local state
                    const { character, user } = get();
                    if (character) set({ character: { ...character, name } });
                    if (user && avatarUrl) set({ user: { ...user, avatarUrl } });

                    set({ isLoading: false });
                } catch (err: any) {
                    set({
                        error: err.response?.data?.error || 'Failed to update profile',
                        isLoading: false
                    });
                    throw err;
                }
            },
        }),
        {
            name: 'codequest-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
