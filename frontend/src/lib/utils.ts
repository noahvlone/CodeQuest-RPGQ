import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
        case 'EASY':
            return 'text-green-400';
        case 'MEDIUM':
            return 'text-yellow-400';
        case 'HARD':
            return 'text-orange-400';
        case 'EXPERT':
            return 'text-red-400';
        default:
            return 'text-slate-400';
    }
}

export function getClassColor(characterClass: string): string {
    switch (characterClass) {
        case 'FRONTEND_WARRIOR':
            return 'text-primary';
        case 'BACKEND_MAGE':
            return 'text-secondary';
        case 'FULLSTACK_RANGER':
            return 'text-accent';
        default:
            return 'text-white';
    }
}

export function getClassDisplayName(characterClass: string): string {
    switch (characterClass) {
        case 'FRONTEND_WARRIOR':
            return 'Frontend Warrior';
        case 'BACKEND_MAGE':
            return 'Backend Mage';
        case 'FULLSTACK_RANGER':
            return 'Fullstack Ranger';
        default:
            return characterClass;
    }
}

export function getRarityColor(rarity: string): string {
    switch (rarity) {
        case 'COMMON':
            return 'text-slate-400 border-slate-400';
        case 'UNCOMMON':
            return 'text-green-400 border-green-400';
        case 'RARE':
            return 'text-blue-400 border-blue-400';
        case 'EPIC':
            return 'text-purple-400 border-purple-400';
        case 'LEGENDARY':
            return 'text-yellow-400 border-yellow-400';
        default:
            return 'text-slate-400 border-slate-400';
    }
}
