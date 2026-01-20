'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Github, Mail, Lock, User, Eye, EyeOff, Globe } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Button, Input } from '@/components/ui';
import { api } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading, error } = useGameStore();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        try {
            await register(email, username, password);
            router.push('/character-select');
        } catch (err: any) {
            setLocalError(err.response?.data?.error || 'Registration failed');
        }
    };

    const handleGitHubLogin = () => {
        window.location.href = api.getGitHubAuthUrl();
    };

    const handleGoogleLogin = () => {
        window.location.href = api.getGoogleAuthUrl();
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-12">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Terminal className="text-black w-7 h-7" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">
                        CodeQuest <span className="text-primary">RPG</span>
                    </span>
                </Link>

                {/* Register Form */}
                <div className="bg-dark-100 border border-white/10 rounded-2xl p-8">
                    <h1 className="text-2xl font-black italic uppercase text-center mb-2">
                        Create <span className="text-primary">Account</span>
                    </h1>
                    <p className="text-slate-400 text-sm text-center mb-8">
                        Join thousands of other debuggers!
                    </p>

                    {/* Social Login */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={handleGitHubLogin}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg py-3 px-4 font-bold uppercase text-xs italic hover:bg-white/10 transition-colors"
                        >
                            <Github size={18} />
                            GitHub
                        </button>
                        <button
                            onClick={handleGoogleLogin}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg py-3 px-4 font-bold uppercase text-xs italic hover:bg-white/10 transition-colors"
                        >
                            <Globe size={18} />
                            Google
                        </button>
                    </div>

                    <div className="relative flex items-center my-6">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-4 text-[10px] text-slate-500 uppercase font-bold tracking-widest">Or</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-11"
                                minLength={3}
                                maxLength={20}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-11"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-11 pr-11"
                                minLength={6}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-11"
                                required
                            />
                        </div>

                        {(localError || error) && (
                            <p className="text-danger text-sm text-center italic">{localError || error}</p>
                        )}

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Register Now
                        </Button>
                    </form>

                    <p className="text-center text-slate-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
