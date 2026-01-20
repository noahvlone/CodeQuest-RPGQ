'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, type = 'text', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold uppercase italic tracking-widest text-slate-400 mb-2">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'w-full bg-dark-200 border border-white/10 rounded-lg px-4 py-3',
                        'text-white placeholder:text-slate-500',
                        'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30',
                        'transition-all duration-300',
                        error && 'border-danger/50 focus:border-danger/50 focus:ring-danger/30',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-danger italic">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
