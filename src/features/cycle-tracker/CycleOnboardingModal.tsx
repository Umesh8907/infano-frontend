'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ChevronRight, CheckCircle2, Info } from 'lucide-react';
import { cycleTrackerService } from '@/services/cycle-tracker.service';

interface CycleOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CycleOnboardingModal({ isOpen, onClose, onSuccess }: CycleOnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [data, setData] = useState({
        lastPeriodStart: new Date().toISOString().split('T')[0],
        periodLength: 5,
        usualCycleLength: 28,
    });

    // Reset form whenever modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSaved(false);
            setSaving(false);
            setData({
                lastPeriodStart: new Date().toISOString().split('T')[0],
                periodLength: 5,
                usualCycleLength: 28,
            });
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await cycleTrackerService.onboard(data);
            setSaved(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Failed to onboard user:', error);
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-primary-950/20 backdrop-blur-md"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl shadow-primary-500/10 overflow-hidden border border-primary-500/5"
            >
                {/* Header Image/Pattern */}
                <div className="h-24 bg-linear-to-br from-primary-500 to-accent-500 opacity-10 absolute top-0 left-0 right-0" />

                <div className="relative p-10 pt-16">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-8 p-2 text-foreground/20 hover:text-primary-600 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="mb-10 text-center">
                        {saved ? (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <p className="text-xl font-black text-foreground">Welcome Aboard! ✓</p>
                                <p className="text-foreground/50 text-sm">Your cycle profile is ready.</p>
                            </motion.div>
                        ) : (
                            <>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-50 px-3 py-1 rounded-full">Step {step} of 3</span>
                                <h2 className="text-3xl font-black text-foreground mt-4">
                                    {step === 1 ? 'Last Period' : step === 2 ? 'Period Duration' : 'Cycle Rhythm'}
                                </h2>
                                <p className="text-foreground/40 text-sm mt-2">Help us set up your personal tracker.</p>
                            </>
                        )}
                    </div>

                    {!saved && (
                        <div className="min-h-[280px]">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block pl-2">When did it start?</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 group-focus-within:scale-110 transition-transform" />
                                                <input
                                                    type="date"
                                                    value={data.lastPeriodStart}
                                                    onChange={(e) => setData({ ...data, lastPeriodStart: e.target.value })}
                                                    className="w-full pl-16 pr-8 py-5 bg-primary-50 border-2 border-transparent focus:border-primary-500 rounded-3xl font-bold text-foreground outline-hidden transition-all text-lg"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-primary-50/50 rounded-2xl flex gap-3 items-start border border-primary-500/10">
                                            <Info className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-primary-900/60 leading-relaxed">
                                                Knowing your start date helps us calculate your current phase and next prediction.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setStep(2)}
                                            className="w-full py-5 bg-primary-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            Next Step <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="space-y-8 text-center"
                                    >
                                        <div className="space-y-4">
                                            <div className="text-6xl font-black text-primary-600 tracking-tighter">
                                                {data.periodLength} <span className="text-xl text-foreground/30 ml-[-8px]">days</span>
                                            </div>
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block">How many days does it usually last?</label>
                                        </div>
                                        
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={data.periodLength}
                                            onChange={(e) => setData({ ...data, periodLength: parseInt(e.target.value) })}
                                            className="w-full h-3 bg-primary-100 rounded-full appearance-none cursor-pointer accent-primary-600"
                                        />
                                        
                                        <div className="flex justify-between text-[10px] font-black text-foreground/20 uppercase px-2">
                                            <span>Light (1-2)</span>
                                            <span>Normal (5)</span>
                                            <span>Long (10)</span>
                                        </div>

                                        <div className="flex gap-4">
                                            <button onClick={() => setStep(1)} className="flex-1 py-5 font-bold text-foreground/40 text-lg">Back</button>
                                            <button
                                                onClick={() => setStep(3)}
                                                className="flex-3 py-5 bg-primary-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-primary-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                            >
                                                Next Step <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="space-y-8 text-center"
                                    >
                                        <div className="space-y-4">
                                            <div className="text-6xl font-black text-accent-600 tracking-tighter">
                                                {data.usualCycleLength} <span className="text-xl text-foreground/30 ml-[-12px]">days</span>
                                            </div>
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block">Average length of your entire cycle?</label>
                                        </div>
                                        
                                        <input
                                            type="range"
                                            min="21"
                                            max="35"
                                            value={data.usualCycleLength}
                                            onChange={(e) => setData({ ...data, usualCycleLength: parseInt(e.target.value) })}
                                            className="w-full h-3 bg-accent-100 rounded-full appearance-none cursor-pointer accent-accent-600"
                                        />
                                        
                                        <div className="flex justify-between text-[10px] font-black text-foreground/20 uppercase px-2">
                                            <span>Short (21)</span>
                                            <span>Normal (28)</span>
                                            <span>Long (35)</span>
                                        </div>

                                        <div className="flex gap-4">
                                            <button onClick={() => setStep(2)} className="flex-1 py-5 font-bold text-foreground/40 text-lg">Back</button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={saving}
                                                className="flex-3 py-5 bg-primary-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-primary-500/20 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                            >
                                                {saving ? 'Creating Profile...' : 'Complete Setup'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
