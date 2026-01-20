'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cpu, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { api } from '@/lib/api';
import { getRarityColor } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, Button } from '@/components/ui';

interface Item {
    _id: string;
    name: string;
    description: string;
    type: string;
    rarity: string;
    price: number;
    effects: Array<{ type: string; value: number }>;
}

export default function ShopPage() {
    const router = useRouter();
    const { isAuthenticated, character, fetchCharacter } = useGameStore();
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const loadShop = async () => {
            try {
                await fetchCharacter();
                const { items } = await api.getShopItems();
                setItems(items);
            } catch (error) {
                console.error('Failed to load shop:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadShop();
    }, [isAuthenticated, router, fetchCharacter]);

    const handlePurchase = async (itemId: string) => {
        setPurchaseLoading(itemId);
        try {
            await api.purchaseItem(itemId);
            await fetchCharacter();
            alert('Item purchased successfully!');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Purchase failed');
        } finally {
            setPurchaseLoading(null);
        }
    };

    const getItemIcon = (type: string) => {
        switch (type) {
            case 'WEAPON': return <Zap className="w-8 h-8" />;
            case 'ARMOR': return <Cpu className="w-8 h-8" />;
            default: return <AlertCircle className="w-8 h-8" />;
        }
    };

    if (!isAuthenticated) return null;

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
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase mb-2">
                            Item <span className="text-accent">Black Market</span>
                        </h2>
                        <p className="text-slate-400 italic">
                            Upgrade your hardware for faster code execution.
                        </p>
                    </div>
                    <div className="bg-dark-100 p-4 border border-white/10 rounded-xl flex items-center gap-4">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Credit Balance:</span>
                        <span className="text-2xl font-mono text-yellow-400">{character?.gold || 0} CQ</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group hover:border-accent/50">
                                <div className={`
                  w-16 h-16 bg-accent/10 text-accent rounded-xl 
                  flex items-center justify-center mb-6 
                  border border-accent/20
                `}>
                                    {getItemIcon(item.type)}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-black italic uppercase">{item.name}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getRarityColor(item.rarity)}`}>
                                        {item.rarity}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mb-4 italic">{item.description}</p>

                                {/* Effects */}
                                <div className="mb-6 space-y-1">
                                    {item.effects.map((effect, i) => (
                                        <div key={i} className="text-xs text-primary">
                                            +{effect.value}% {effect.type.replace('_', ' ')}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => handlePurchase(item._id)}
                                    isLoading={purchaseLoading === item._id}
                                    disabled={(character?.gold || 0) < item.price}
                                >
                                    Buy: {item.price} CQ
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="italic">Shop is empty.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
