'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldCheck, CheckCircle2, Star, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { onboardingService } from '@/services/onboarding.service';

const MOODS = [
    { label: 'Happy', emoji: '😊', color: 'bg-yellow-100' },
    { label: 'Okay', emoji: '😐', color: 'bg-blue-50' },
    { label: 'Confused', emoji: '😕', color: 'bg-orange-100' },
    { label: 'Low', emoji: '😔', color: 'bg-indigo-50' },
    { label: 'Calm', emoji: '😌', color: 'bg-green-100' },
    { label: 'Worried', emoji: '😟', color: 'bg-red-50' },
];

const INTERESTS = [
    { id: 'period', label: 'My Period Journey', icon: '🩸', color: 'bg-rose-50' },
    { id: 'puberty', label: 'My Puberty Journey', icon: '✨', color: 'bg-amber-50' },
    { id: 'emotions', label: 'Understand my emotions', icon: '🧠', color: 'bg-emerald-50' },
    { id: 'friendships', label: 'Make better friendships', icon: '🤝', color: 'bg-sky-50' },
];

interface OnboardingModalProps {
    onComplete: () => void;
    mode?: 'onboarding' | 'check-in';
}

export default function OnboardingModal({ onComplete, mode = 'onboarding' }: OnboardingModalProps) {
    const [step, setStep] = useState(mode === 'check-in' ? 4 : 1);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const nextStep = () => {
        if (mode === 'check-in' && step === 4) {
            handleComplete();
            return;
        }
        setStep(s => s + 1);
    };

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            if (selectedMood) {
                await onboardingService.logMood(selectedMood);
            }
            if (selectedInterests.length > 0) {
                await onboardingService.completeOnboarding(selectedInterests);
            }
            onComplete();
        } catch (error) {
            console.error('Onboarding failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const variations = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-4xl glass bg-white/90 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]"
            >
                {/* Visual Area (Gigi Illustration) */}
                <div className="w-full md:w-1/2 bg-linear-to-br from-primary-50 to-secondary-50 p-12 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary-200 blur-3xl animate-pulse" />
                        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary-200 blur-3xl animate-pulse delay-700" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="relative z-10 w-full aspect-square max-w-[320px]"
                        >
                            {/* In a real app, these would be the specific character images from the screenshots */}
                            <img
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${step === 1 ? 'welcome' : step === 2 ? 'gigi' : 'safe'}&backgroundColor=transparent`}
                                alt="Gigi"
                                className="w-full h-full object-contain"
                            />
                            {step === 1 && (
                                <motion.div
                                    animate={{ rotate: [0, 20, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -top-4 -right-4 text-4xl"
                                >
                                    👋
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Content Area */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            variants={variations}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-8"
                        >
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-foreground">Welcome 💛</h2>
                                    <p className="text-foreground/60 text-lg leading-relaxed">
                                        You're stepping into a safe space made just for you.
                                    </p>
                                    <button
                                        onClick={nextStep}
                                        className="btn-primary w-full py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary-500/20"
                                    >
                                        Begin My Journey
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-foreground">Hi, I'm Gigi. 🌼</h2>
                                    <p className="text-foreground/60 text-lg leading-relaxed">
                                        I'm here to walk with you as you learn about your body, your feelings, and your strengths.
                                    </p>
                                    <p className="text-foreground/40 text-sm italic">
                                        You can go at your own pace — there's no pressure here.
                                    </p>
                                    <button
                                        onClick={nextStep}
                                        className="btn-primary w-full py-4 rounded-2xl text-lg font-bold"
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black text-foreground">This is your safe space</h2>
                                        <ShieldCheck className="w-8 h-8 text-primary-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-foreground/70">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            <span>Your reflections are private</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-foreground/70">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            <span>You can share only when you choose</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-foreground/70">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            <span>You are always supported</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={nextStep}
                                        className="btn-primary w-full py-4 rounded-2xl text-lg font-bold"
                                    >
                                        I Feel Safe Here
                                    </button>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-foreground">
                                            {mode === 'check-in' ? 'Welcome back! 🌼' : 'How are you feeling today?'}
                                        </h2>
                                        <p className="text-foreground/40 text-sm">(You can change this anytime.)</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {MOODS.map(mood => (
                                            <button
                                                key={mood.label}
                                                onClick={() => setSelectedMood(mood.label)}
                                                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedMood === mood.label
                                                    ? 'border-primary-500 bg-primary-50 scale-[1.02]'
                                                    : 'border-transparent bg-foreground/5 hover:bg-foreground/10'
                                                    }`}
                                            >
                                                <span className="text-2xl">{mood.emoji}</span>
                                                <span className="font-bold text-sm">{mood.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={nextStep}
                                        disabled={!selectedMood}
                                        className="btn-primary w-full py-4 rounded-2xl text-lg font-bold disabled:opacity-50 disabled:grayscale transition-all"
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-foreground">What would you like to explore first?</h2>
                                        <p className="text-foreground/40 text-sm">Choose one or more.</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {INTERESTS.map(interest => (
                                            <button
                                                key={interest.id}
                                                onClick={() => toggleInterest(interest.id)}
                                                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedInterests.includes(interest.id)
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-transparent bg-foreground/5 hover:bg-foreground/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white shadow-sm">
                                                        {interest.icon}
                                                    </span>
                                                    <span className="font-bold">{interest.label}</span>
                                                </div>
                                                {selectedInterests.includes(interest.id) && (
                                                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleComplete}
                                        disabled={selectedInterests.length === 0 || isSubmitting}
                                        className="btn-primary w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ready to Start!'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
