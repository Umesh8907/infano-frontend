'use client';

import { motion } from 'framer-motion';
import { Sparkles, Package, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import KitActivationForm from './KitActivationForm';
import KitPurchaseForm from './KitPurchaseForm';

export default function OnboardingSelection() {
    const [view, setView] = useState<'selection' | 'activate' | 'purchase'>('selection');

    if (view === 'activate') {
        return <KitActivationForm onBack={() => setView('selection')} />;
    }

    if (view === 'purchase') {
        return <KitPurchaseForm onBack={() => setView('selection')} />;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-primary-100 rounded-[2rem] flex items-center justify-center text-primary-600 mx-auto mb-6 shadow-lg shadow-primary-500/10"
                >
                    <Sparkles className="w-10 h-10" />
                </motion.div>
                <h1 className="text-5xl font-black mb-4 tracking-tight">One Step Away from <span className="gradient-text">Magic</span></h1>
                <p className="text-foreground/40 text-lg font-medium max-w-md mx-auto">To enter the learning garden, you'll need an active Infano Kit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Option 1: Activate */}
                <motion.div
                    whileHover={{ y: -8 }}
                    className="glass p-10 rounded-[3rem] border-primary-500/10 shadow-xl flex flex-col items-center text-center group cursor-pointer"
                    onClick={() => setView('activate')}
                >
                    <div className="w-16 h-16 bg-accent-500/10 rounded-2xl flex items-center justify-center text-accent-600 mb-8 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">I have a Physical Kit</h3>
                    <p className="text-foreground/50 mb-10 leading-relaxed text-sm">Use the 10-digit activation code found inside your physical box to unlock your journey.</p>
                    <button className="w-full py-4 bg-white border border-primary-500/10 rounded-2xl font-bold text-primary-600 hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                        Activate Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>

                {/* Option 2: Purchase */}
                <motion.div
                    whileHover={{ y: -8 }}
                    className="glass p-10 rounded-[3rem] border-primary-500/10 shadow-xl flex flex-col items-center text-center group cursor-pointer"
                    onClick={() => setView('purchase')}
                >
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-8 group-hover:scale-110 transition-transform">
                        <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">I want a New Kit</h3>
                    <p className="text-foreground/50 mb-10 leading-relaxed text-sm">Don't have a kit yet? Purchase our "Seedling Discovery" kit to get started with hands-on experiments.</p>
                    <button className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/20 hover:bg-primary-600 hover:scale-105 transition-all flex items-center justify-center gap-2">
                        Order My Kit
                        <Zap className="w-4 h-4 fill-current" />
                    </button>
                </motion.div>
            </div>

            <div className="mt-16 text-center">
                <button className="text-foreground/30 font-bold tracking-widest uppercase text-xs hover:text-primary-600 transition-colors">
                    Contact Support if you're stuck
                </button>
            </div>
        </div>
    );
}
