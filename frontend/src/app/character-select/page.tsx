'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Database, Sword, Terminal, Brain, Cpu, Cloud, Shield, Smartphone } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Button, Input } from '@/components/ui';

const CHARACTER_CLASSES = [
    {
        id: 'FRONTEND_WARRIOR',
        name: 'Frontend Warrior',
        icon: Zap,
        color: 'text-primary',
        borderColor: 'border-primary',
        bgColor: 'bg-primary/10',
        hoverBg: 'hover:bg-primary/20',
        description: 'Master of the DOM and visual warfare.',
        stats: { javascript: 15, python: 5, css: 20, algorithms: 5, databases: 5 },
    },
    {
        id: 'BACKEND_MAGE',
        name: 'Backend Mage',
        icon: Database,
        color: 'text-secondary',
        borderColor: 'border-secondary',
        bgColor: 'bg-secondary/10',
        hoverBg: 'hover:bg-secondary/20',
        description: 'Sorcerer of servers and data manipulation.',
        stats: { javascript: 10, python: 15, css: 5, algorithms: 10, databases: 15 },
    },
    {
        id: 'FULLSTACK_RANGER',
        name: 'Fullstack Ranger',
        icon: Sword,
        color: 'text-accent',
        borderColor: 'border-accent',
        bgColor: 'bg-accent/10',
        hoverBg: 'hover:bg-accent/20',
        description: 'Versatile adapting to any environment.',
        stats: { javascript: 12, python: 12, css: 10, algorithms: 8, databases: 8 },
    },
    {
        id: 'NEURAL_HACKER',
        name: 'Neural Hacker',
        icon: Brain,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-400',
        bgColor: 'bg-emerald-400/10',
        hoverBg: 'hover:bg-emerald-400/20',
        description: 'Data Scientist unraveling patterns in chaos.',
        stats: { javascript: 8, python: 20, css: 2, algorithms: 15, databases: 10 },
    },
    {
        id: 'QUANTUM_ARCHITECT',
        name: 'Quantum Architect',
        icon: Cpu,
        color: 'text-violet-400',
        borderColor: 'border-violet-400',
        bgColor: 'bg-violet-400/10',
        hoverBg: 'hover:bg-violet-400/20',
        description: 'AI Engineer constructing synthetic minds.',
        stats: { javascript: 10, python: 18, css: 2, algorithms: 18, databases: 7 },
    },
    {
        id: 'CLOUD_PHANTOM',
        name: 'Cloud Phantom',
        icon: Cloud,
        color: 'text-sky-400',
        borderColor: 'border-sky-400',
        bgColor: 'bg-sky-400/10',
        hoverBg: 'hover:bg-sky-400/20',
        description: 'DevOps Engineer traversing the infrastructure.',
        stats: { javascript: 12, python: 15, css: 3, algorithms: 8, databases: 12 },
    },
    {
        id: 'CIPHER_GUARDIAN',
        name: 'Cipher Guardian',
        icon: Shield,
        color: 'text-rose-400',
        borderColor: 'border-rose-400',
        bgColor: 'bg-rose-400/10',
        hoverBg: 'hover:bg-rose-400/20',
        description: 'Cybersecurity Specialist guarding the core.',
        stats: { javascript: 10, python: 15, css: 5, algorithms: 12, databases: 13 },
    },
    {
        id: 'PIXEL_RONIN',
        name: 'Pixel Ronin',
        icon: Smartphone,
        color: 'text-orange-400',
        borderColor: 'border-orange-400',
        bgColor: 'bg-orange-400/10',
        hoverBg: 'hover:bg-orange-400/20',
        description: 'Mobile Developer crafting portable worlds.',
        stats: { javascript: 18, python: 5, css: 15, algorithms: 10, databases: 7 },
    },
];

export default function CharacterSelectPage() {
    const router = useRouter();
    const { createCharacter, isLoading, error } = useGameStore();
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [characterName, setCharacterName] = useState('');
    const [step, setStep] = useState<'class' | 'name'>('class');

    const handleClassSelect = (classId: string) => {
        setSelectedClass(classId);
    };

    const handleContinue = () => {
        if (selectedClass) {
            setStep('name');
        }
    };

    const handleCreate = async () => {
        if (!selectedClass || !characterName.trim()) return;

        try {
            await createCharacter(characterName.trim(), selectedClass);
            router.push('/dashboard');
        } catch {
            // Error handled by store
        }
    };

    const selectedClassData = CHARACTER_CLASSES.find(c => c.id === selectedClass);

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -z-10" />

            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                            <Terminal className="text-black w-6 h-6" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            CodeQuest <span className="text-primary">RPG</span>
                        </span>
                    </div>
                    <h1 className="text-4xl font-black italic uppercase mb-4">
                        {step === 'class' ? (
                            <>Choose <span className="text-primary">Class</span></>
                        ) : (
                            <>Name <span className="text-primary">Character</span></>
                        )}
                    </h1>
                    <p className="text-slate-400">
                        {step === 'class'
                            ? 'Each class has unique skills in the coding world'
                            : 'This name will represent you throughout Neo-Jakarta'}
                    </p>
                </div>

                {step === 'class' ? (
                    <>
                        {/* Class Selection */}
                        <div className="grid md:grid-cols-4 gap-6 mb-12">
                            {CHARACTER_CLASSES.map((charClass, index) => {
                                const Icon = charClass.icon;
                                const isSelected = selectedClass === charClass.id;

                                return (
                                    <motion.div
                                        key={charClass.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleClassSelect(charClass.id)}
                                        className={`
                      p-4 border-2 rounded-2xl cursor-pointer transition-all relative overflow-hidden
                      flex flex-col items-center text-center group
                      ${charClass.borderColor} ${charClass.bgColor} ${charClass.hoverBg}
                      ${isSelected ? 'scale-105 shadow-[0_0_30px_rgba(0,0,0,0.5)] ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'}
                    `}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="selected-glow"
                                                className={`absolute inset-0 bg-${charClass.color.split('-')[1]}/20 blur-xl`}
                                            />
                                        )}

                                        <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center mb-4 z-10
                      bg-black/40 ${charClass.color} text-3xl shadow-lg group-hover:scale-110 transition-transform
                    `}>
                                            <Icon size={32} />
                                        </div>
                                        <h3 className={`text-lg font-black italic uppercase mb-2 ${charClass.color} z-10`}>
                                            {charClass.name}
                                        </h3>
                                        <p className="text-slate-400 text-xs mb-4 italic leading-tight z-10">
                                            {charClass.description}
                                        </p>

                                        {/* Stats Preview */}
                                        <div className="w-full space-y-1 text-[8px] uppercase font-bold z-10">
                                            {Object.entries(charClass.stats).map(([stat, value]) => (
                                                <div key={stat} className="flex justify-between items-center">
                                                    <span className="text-slate-500">{stat.slice(0, 4)}</span>
                                                    <div className="flex-1 mx-2 h-1 bg-black/40 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full ${charClass.color.replace('text-', 'bg-')}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(value / 20) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className={charClass.color}>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="text-center">
                            <Button
                                onClick={handleContinue}
                                disabled={!selectedClass}
                                size="lg"
                            >
                                Continue
                            </Button>
                        </div>
                    </>
                ) : (
                    /* Name Input */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <div className={`
              p-8 rounded-2xl border-2 mb-8
              ${selectedClassData?.borderColor} ${selectedClassData?.bgColor}
            `}>
                            <div className="flex items-center gap-4 mb-6">
                                {selectedClassData && (
                                    <div className={`
                    w-16 h-16 rounded-xl flex items-center justify-center
                    bg-black/40 ${selectedClassData.color}
                  `}>
                                        <selectedClassData.icon size={32} />
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Selected Class</p>
                                    <h3 className={`text-xl font-black italic uppercase ${selectedClassData?.color}`}>
                                        {selectedClassData?.name}
                                    </h3>
                                </div>
                            </div>

                            <Input
                                label="Character Name"
                                placeholder="Enter name..."
                                value={characterName}
                                onChange={(e) => setCharacterName(e.target.value)}
                                maxLength={20}
                            />
                        </div>

                        {error && (
                            <p className="text-danger text-sm text-center italic mb-4">{error}</p>
                        )}

                        <div className="flex gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => setStep('class')}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={!characterName.trim()}
                                isLoading={isLoading}
                                className="flex-1"
                            >
                                Create Character
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
