'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number;
    max: number;
    color?: 'primary' | 'secondary' | 'accent' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    label?: string;
    className?: string;
}

export default function ProgressBar({
    value,
    max,
    color = 'primary',
    size = 'md',
    showLabel = false,
    label,
    className,
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    const colors = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        accent: 'bg-accent',
        danger: 'bg-gradient-to-r from-red-600 to-pink-500',
    };

    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between text-[10px] uppercase font-bold mb-1 tracking-widest">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-300">{value} / {max}</span>
                </div>
            )}
            <div className={cn('w-full bg-white/5 rounded-full overflow-hidden', sizes[size])}>
                <div
                    className={cn('h-full transition-all duration-500', colors[color])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
