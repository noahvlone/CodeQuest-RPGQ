'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Loader2, User } from 'lucide-react';
import { api } from '@/lib/api';
import { getClassDisplayName, getClassColor, formatNumber } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui';

interface LeaderboardEntry {
    rank: number;
    character: {
        name: string;
        class: string;
        level: number;
        xp: number;
    };
    user: {
        username: string;
        avatarUrl?: string;
    };
    totalXp: number;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const { leaderboard } = await api.getLeaderboard(50);
                setLeaderboard(leaderboard);
            } catch (error) {
                console.error('Failed to load leaderboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 2:
                return 'text-slate-300 bg-slate-300/10 border-slate-300/30';
            case 3:
                return 'text-amber-600 bg-amber-600/10 border-amber-600/30';
            default:
                return 'text-slate-500 bg-white/5 border-white/10';
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-6 pt-32 pb-20 text-center">
                <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
                <h2 className="text-4xl font-black italic uppercase mb-4">
                    Top <span className="text-primary">Debuggers</span>
                </h2>
                <p className="text-slate-400 mb-12">
                    Ranking board of the best players in the system.
                </p>

                <div className="max-w-3xl mx-auto">
                    <Card className="p-0 overflow-hidden">
                        {leaderboard.map((entry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center 
                    font-mono text-xl font-bold border
                    ${getRankStyle(entry.rank)}
                  `}>
                                        #{entry.rank}
                                    </div>
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center overflow-hidden">
                                        {entry.user.avatarUrl ? (
                                            <img
                                                src={entry.user.avatarUrl}
                                                alt={entry.user.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={20} className="text-slate-500" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-black italic uppercase">{entry.character.name}</h5>
                                        <p className={`text-[10px] font-bold uppercase ${getClassColor(entry.character.class)}`}>
                                            {getClassDisplayName(entry.character.class)} • Lv. {entry.character.level}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-mono">{formatNumber(entry.totalXp)}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Total XP</div>
                                </div>
                            </motion.div>
                        ))}

                        {leaderboard.length === 0 && (
                            <div className="p-12 text-center text-slate-500">
                                <Trophy size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="italic">No players on the leaderboard yet.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
            <Footer />
        </>
    );
}
