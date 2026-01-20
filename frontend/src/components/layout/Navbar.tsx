'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, LogOut, User, ShoppingCart, Trophy, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getClassDisplayName, getClassColor } from '@/lib/utils';

export default function Navbar() {
    const router = useRouter();
    const { user, character, isAuthenticated, logout } = useGameStore();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="fixed w-full z-40 bg-[#050505]/80 backdrop-blur-lg border-b border-white/10 px-6 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <Terminal className="text-black w-5 h-5" />
                        </div>
                        <span className="text-lg font-black tracking-tighter uppercase italic hidden md:block">
                            CodeQuest
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                        className="flex gap-6 text-xs font-bold uppercase italic tracking-widest"
                    >
                        {[
                            { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { href: '/shop', icon: ShoppingCart, label: 'Shop' },
                            { href: '/leaderboard', icon: Trophy, label: 'Ranking' }
                        ].map((link) => (
                            <motion.div key={link.href} variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}>
                                <Link
                                    href={link.href}
                                    className="text-slate-500 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <link.icon size={16} />
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="flex items-center gap-6">
                    {character && (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className={`text-[10px] font-bold uppercase italic ${getClassColor(character.class)}`}>
                                    {getClassDisplayName(character.class)}
                                </div>
                                <div className="text-xs font-black italic uppercase">Lv. {character.level}</div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                                <span className="text-yellow-400 text-xs font-bold">{character.gold}</span>
                                <span className="text-[10px] text-slate-500">CQ</span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                    </div>
                    <Link href="/profile" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} />
                        )}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-slate-500 hover:text-danger transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
