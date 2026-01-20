'use client';

import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className, interactive, onClick }: CardProps) {
    return (
        <div
            className={cn(
                'bg-dark-100 border border-white/10 rounded-2xl p-6',
                'transition-all duration-300',
                interactive && 'cursor-pointer hover:border-primary/30 hover:translate-y-[-2px] hover:shadow-lg',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
