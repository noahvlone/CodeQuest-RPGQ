'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Play, Sparkles, Bug, AlertCircle,
    Cpu, Loader2, Zap, CheckCircle2, XCircle
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { api } from '@/lib/api';
import { Button, ProgressBar } from '@/components/ui';

// Dynamic import for Monaco Editor (client-side only)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Challenge {
    _id: string;
    title: string;
    description: string;
    narrative: string;
    difficulty: string;
    category: string;
    language: string;
    starterCode: string;
    testCases: Array<{ input: string; expectedOutput: string }>;
    xpReward: number;
    goldReward: number;
}

interface TestResult {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
}

interface ExecutionResult {
    success: boolean;
    damage: number;
    testResults: TestResult[];
    passedTests: number;
    totalTests: number;
    executionTime: number;
    rewards?: {
        xp: number;
        gold: number;
        character: any;
    };
}

export default function BattlePage() {
    const router = useRouter();
    const params = useParams();
    const challengeId = params.id as string;

    const { character, updateCharacter, isAuthenticated } = useGameStore();

    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState('');
    const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
    const [bugHp, setBugHp] = useState(100);
    const [showVictory, setShowVictory] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const loadChallenge = async () => {
            try {
                const { challenge, progress } = await api.getChallenge(challengeId);
                setChallenge(challenge);
                setCode(progress?.submittedCode || challenge.starterCode);
                setAiMessage(`Welcome to ${challenge.title}. ${challenge.narrative}`);
            } catch (error) {
                console.error('Failed to load challenge:', error);
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        loadChallenge();
    }, [challengeId, isAuthenticated, router]);

    const runCode = async () => {
        if (!challenge) return;

        setIsRunning(true);
        setExecutionResult(null);

        try {
            const result = await api.executeCode(challengeId, code);
            setExecutionResult(result);

            // Calculate damage and update bug HP
            const damagePercent = (result.passedTests / result.totalTests) * 100;
            setBugHp(prev => Math.max(0, prev - damagePercent));

            if (result.success) {
                setShowVictory(true);
                if (result.rewards?.character) {
                    updateCharacter(result.rewards.character);
                }
                setAiMessage(`Great job, debugger! Bug eliminated. +${result.rewards?.xp || 0} XP, +${result.rewards?.gold || 0} Gold!`);
            } else {
                setAiMessage(`Damage dealt: ${result.passedTests}/${result.totalTests} tests passed. Keep improving your code!`);
            }
        } catch (error: any) {
            setAiMessage(error.response?.data?.error || 'Execution failed. Try again.');
        } finally {
            setIsRunning(false);
        }
    };

    const askAi = async () => {
        if (!challenge) return;

        setIsAiLoading(true);
        try {
            const { review } = await api.reviewCode(code, challenge.title);
            setAiMessage(review);
        } catch {
            setAiMessage('Neural link error. Cannot connect to Architect.');
        } finally {
            setIsAiLoading(false);
        }
    };

    const getHint = async () => {
        if (!challenge) return;

        setIsAiLoading(true);
        try {
            const { hint } = await api.getHint(challenge.description, code);
            setAiMessage(hint);
        } catch {
            setAiMessage('Cannot retrieve hint at this moment.');
        } finally {
            setIsAiLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-dark-300">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="h-screen flex items-center justify-center bg-dark-300">
                <p className="text-slate-500">Challenge not found</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-dark-300">
            {/* Victory Overlay */}
            {showVictory && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-6" />
                        <h2 className="text-4xl font-black italic uppercase mb-4">
                            <span className="text-primary">Victory!</span>
                        </h2>
                        <p className="text-slate-400 mb-8">
                            Bug eliminated. System restored.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => router.push('/dashboard')}>
                                Return to Dashboard
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Top Bar */}
            <div className="bg-dark-100 border-b border-white/10 px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <ChevronLeft />
                    </button>
                    <div className="font-black italic uppercase text-sm tracking-widest flex items-center gap-2">
                        <AlertCircle size={16} className="text-danger" />
                        Arena: <span className="text-primary">{challenge.title}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={getHint}
                        disabled={isAiLoading}
                    >
                        {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : '💡'} Hint
                    </Button>
                    <Button
                        variant="accent"
                        size="sm"
                        onClick={askAi}
                        disabled={isAiLoading}
                    >
                        {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} AI Review
                    </Button>
                    <Button
                        size="sm"
                        onClick={runCode}
                        disabled={isRunning}
                    >
                        {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Run Code
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Side */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-1/2 flex flex-col border-r border-white/10"
                >
                    {/* Challenge Description */}
                    <div className="p-4 bg-dark-200 border-b border-white/10">
                        <h3 className="font-bold text-sm mb-2">{challenge.title}</h3>
                        <p className="text-slate-400 text-xs">{challenge.description}</p>
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1">
                        <MonacoEditor
                            height="100%"
                            language={challenge.language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Output Console */}
                    <div className="h-1/4 bg-dark-300 border-t border-white/10 p-4 font-mono text-xs overflow-y-auto">
                        <div className="text-slate-500 mb-2 uppercase font-bold tracking-widest">Output Console</div>
                        {executionResult && (
                            <div className="space-y-1">
                                <div className={executionResult.success ? 'text-primary' : 'text-yellow-400'}>
                                    &gt; Tests: {executionResult.passedTests}/{executionResult.totalTests} passed
                                </div>
                                <div className="text-slate-400">
                                    &gt; Execution time: {executionResult.executionTime}ms
                                </div>
                                {executionResult.testResults.slice(0, 3).map((test, i) => (
                                    <div key={i} className={test.passed ? 'text-green-400' : 'text-red-400'}>
                                        &gt; Test {i + 1}: {test.passed ? '✓ Passed' : '✗ Failed'}
                                        {!test.passed && test.input !== '[hidden]' && (
                                            <span className="text-slate-500 ml-2">
                                                (expected: {test.expectedOutput}, got: {test.actualOutput})
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Visual Side */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-1/2 flex flex-col relative bg-gradient-to-b from-dark-200 to-dark-300"
                >
                    {/* Battle Visuals */}
                    <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
                        <div
                            className="absolute inset-0 opacity-10 pointer-events-none cyber-grid"
                        />

                        {/* Enemy Bug */}
                        <div className="relative mb-20 group">
                            <div className="absolute inset-0 bg-danger/20 blur-3xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000" />
                            <Bug
                                size={120}
                                className={`text-danger drop-shadow-[0_0_20px_rgba(255,0,85,0.7)] ${isRunning ? 'animate-ping' : 'animate-bounce'
                                    } ${bugHp <= 0 ? 'opacity-30' : ''}`}
                            />
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 text-center">
                                <div className="text-[10px] font-bold uppercase mb-1 text-white">
                                    {challenge.title.replace(' ', '_')}
                                </div>
                                <ProgressBar value={bugHp} max={100} color="danger" size="md" />
                            </div>
                        </div>

                        {/* Player Icon */}
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-primary/10 border-2 border-primary rounded-2xl flex items-center justify-center text-primary">
                                    <Zap size={40} />
                                </div>
                                <span className="mt-2 font-black italic uppercase text-[10px]">
                                    {character?.name || 'Player'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* AI Mentor Chat */}
                    <div className="p-6 bg-dark-100 border-t border-white/10 m-4 rounded-2xl relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0 border border-accent/30">
                                <Cpu size={20} />
                            </div>
                            <div className="flex-1 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="text-[10px] font-black uppercase text-accent tracking-widest mb-1 sticky top-0 bg-dark-100 pb-1">
                                    Architect AI Mentor
                                </div>
                                <p className="text-slate-300 text-xs italic leading-relaxed whitespace-pre-wrap">
                                    {isAiLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 size={12} className="animate-spin" />
                                            Thinking...
                                        </span>
                                    ) : (
                                        aiMessage
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
