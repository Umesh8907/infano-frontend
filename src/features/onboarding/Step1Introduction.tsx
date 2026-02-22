'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface Step1IntroductionProps {
    onContinue: () => void;
}

export default function Step1Introduction({ onContinue }: Step1IntroductionProps) {
    const highlights = [
        'Designed with gynecologists & psychologists',
        'Private & secure platform',
        'Trusted by parents & schools',
        'No ads / No data selling',
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <h1 className="text-5xl font-black text-[#4a3e3e] leading-tight">
                        Start Your Daughter's <br />
                        <span className="text-[#f49b82]">Safe Growth Journey</span>
                    </h1>
                    <p className="text-lg text-text-muted leading-relaxed max-w-md">
                        A science-backed developmental program with a physical care kit and a guided digital platform.
                    </p>
                </motion.div>

                <motion.button
                    onClick={onContinue}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-12 py-4 text-xl flex items-center gap-3"
                >
                    Continue
                    <ArrowRight className="w-6 h-6" />
                </motion.button>

                <div className="space-y-4 pt-4">
                    {highlights.map((text, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="flex items-center gap-3 text-text-muted font-medium"
                        >
                            <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            {text}
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
            >
                <div className="absolute -inset-10 bg-primary-100/30 rounded-full blur-3xl z-0 animate-pulse" />
                <div className="relative z-10 onboarding-card p-4 overflow-hidden border-none shadow-none">
                    {/* In a real app, this would be an illustration or image */}
                    <div className="bg-[#fee2d5]/30 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-48 h-48 bg-white rounded-3xl shadow-xl flex items-center justify-center text-8xl">📦</div>
                        <div className="space-y-2">
                            <h4 className="text-2xl font-black text-primary-600">The Care Kit</h4>
                            <p className="text-sm text-text-dim font-bold uppercase tracking-widest">Everything she needs</p>
                        </div>
                    </div>

                    {/* Character placeholder */}
                    <div className="absolute bottom-0 right-0 w-48 h-64 bg-gradient-to-t from-primary-100/50 to-transparent flex items-end justify-center text-8xl pb-4">
                        ✨
                    </div>
                </div>

                {/* Bubble Quote */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-10 -right-4 max-w-[240px] glass p-6 rounded-[2rem] rounded-bl-none text-sm leading-relaxed"
                >
                    <p className="font-bold mb-1">Dear Parents,</p>
                    <p className="text-text-muted">I will be always there to provide a safe and protective space for your daughter.</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
