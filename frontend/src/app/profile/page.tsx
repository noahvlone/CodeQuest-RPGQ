'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Save, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button, Input, Card } from '@/components/ui';

export default function ProfilePage() {
    const router = useRouter();
    const { user, character, isAuthenticated, fetchCharacter, updateProfile, isLoading, error } = useGameStore();

    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (character) {
            setName(character.name);
        }
        if (user?.avatarUrl) {
            setAvatarUrl(user.avatarUrl);
        }
    }, [isAuthenticated, character, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setIsSaving(true);

        try {
            await updateProfile(name, avatarUrl);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            // Error managed by store
        } finally {
            setIsSaving(false);
        }
    };

    if (!character) return null;

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-black">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black italic uppercase">
                                Edit <span className="text-primary">Profile</span>
                            </h1>
                            <p className="text-slate-400">Update your identity in the neural network.</p>
                        </div>
                    </div>

                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden bg-dark-300">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                <User size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black border-2 border-dark-100">
                                        <LinkIcon size={14} />
                                    </div>
                                </div>
                            </div>

                            <Input
                                label="Character Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter character name..."
                                minLength={2}
                                maxLength={20}
                                required
                            />

                            <Input
                                label="Avatar URL"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://example.com/avatar.jpg"
                            />

                            {error && (
                                <div className="p-3 bg-danger/10 border border-danger/30 rounded text-danger text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-500 text-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    {successMessage}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isSaving}
                            >
                                <Save size={18} className="mr-2" />
                                Save Changes
                            </Button>
                        </form>
                    </Card>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Card className="text-center p-4">
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Level</div>
                            <div className="text-2xl font-black text-white">{character.level}</div>
                        </Card>
                        <Card className="text-center p-4">
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Class</div>
                            <div className="text-2xl font-black text-primary">{character.class.replace('_', ' ')}</div>
                        </Card>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </>
    );
}
