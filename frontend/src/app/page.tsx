'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight, Code2, Cpu, Trophy, Github } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
    const { isAuthenticated } = useGameStore();

    return (
        <div className="relative">
            {/* Navigation */}
            <nav className="absolute w-full z-50 py-6 px-6 flex justify-between items-center">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                        <Terminal className="text-black w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase italic">
                        CodeQuest <span className="text-primary">RPG</span>
                    </span>
                </div>
                <Link
                    href={isAuthenticated ? '/dashboard' : '/login'}
                    className="bg-primary text-black px-6 py-2 rounded font-bold text-sm uppercase italic hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
                >
                    {isAuthenticated ? 'Dashboard' : 'Login System'}
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden text-center">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter italic uppercase leading-tight px-4">
                        CODE OR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                            DELETE
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-400 text-xl mb-12 px-6">
                        The only RPG where your code is your weapon.
                        Conquer bugs, build systems, and become a legend in Neo-Jakarta 2077.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center px-6">
                        <Link
                            href={isAuthenticated ? '/dashboard' : '/register'}
                            className="bg-primary text-black px-12 py-5 rounded font-black text-xl uppercase italic hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,136,0.3)] flex items-center justify-center gap-2"
                        >
                            Start Adventure <ChevronRight />
                        </Link>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-white/20 text-white px-8 py-5 rounded font-bold text-lg uppercase italic hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                            <Github size={20} /> Source Code
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Feature Preview */}
            <section className="container mx-auto px-6 py-20">
                <motion.div
                    className="grid md:grid-cols-3 gap-10 text-center"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, staggerChildren: 0.2 }}
                    viewport={{ once: true }}
                >
                    <FeatureItem
                        icon={<Code2 className="w-8 h-8 text-primary" />}
                        title="Real Coding"
                        desc="Use real JavaScript & Python to solve challenges."
                    />
                    <FeatureItem
                        icon={<Cpu className="w-8 h-8 text-accent" />}
                        title="AI Companion"
                        desc="Intelligent mentor named 'The Architect' guides you in every battle."
                    />
                    <FeatureItem
                        icon={<Trophy className="w-8 h-8 text-secondary" />}
                        title="Leaderboard"
                        desc="Compete with other debuggers and become the strongest."
                    />
                </motion.div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-dark-100/50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-black italic uppercase text-center mb-16">
                        How <span className="text-primary">To Play</span>
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Choose Class', desc: 'Frontend Warrior, Backend Mage, or Fullstack Ranger' },
                            { step: '02', title: 'Enter Arena', desc: 'Select challenges according to your level and skill' },
                            { step: '03', title: 'Write Code', desc: 'Solve challenges by writing solutions' },
                            { step: '04', title: 'Level Up!', desc: 'Get XP, Gold, and climb the ranks' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-5xl font-black text-primary/20 mb-4">{item.step}</div>
                                <h3 className="text-xl font-black uppercase italic mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase mb-8">
                        Ready To Be A <span className="text-gradient">Legend</span>?
                    </h2>
                    <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
                        Thousands of developers have joined. It's time for you to prove your coding skills.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 bg-primary text-black px-12 py-5 rounded font-black text-xl uppercase italic hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,136,0.3)]"
                    >
                        Register Free <ChevronRight />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <motion.div
            className="p-8 bg-dark-100 border border-white/5 rounded-2xl hover:border-primary/30 transition-all hover:translate-y-[-5px] group"
            whileHover={{ scale: 1.02 }}
        >
            <div className="mb-6 inline-block p-4 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-black italic uppercase mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}
