'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handleOAuthCallback, character } = useGameStore();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            router.push(`/login?error=${error}`);
            return;
        }

        if (token) {
            handleOAuthCallback(token)
                .then(() => {
                    // Check if user has a character
                    if (character) {
                        router.push('/dashboard');
                    } else {
                        router.push('/character-select');
                    }
                })
                .catch(() => {
                    router.push('/login?error=auth_failed');
                });
        } else {
            router.push('/login');
        }
    }, [searchParams, router, handleOAuthCallback, character]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-slate-400 italic">Menghubungkan ke sistem...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-400 italic">Loading...</p>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
