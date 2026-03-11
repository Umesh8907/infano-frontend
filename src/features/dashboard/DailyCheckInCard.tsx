'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onboardingService } from '@/services/onboarding.service';
import { Loader2 } from 'lucide-react';

const MOODS = [
    { label: 'Calm', emoji: '😌', color: 'bg-green-100' },
    { label: 'Okay', emoji: '😐', color: 'bg-blue-50' },
    { label: 'Confused', emoji: '😕', color: 'bg-orange-100' },
    { label: 'Stressed', emoji: '😣', color: 'bg-red-50' },
    { label: 'Low', emoji: '😔', color: 'bg-indigo-50' },
];

interface DailyCheckInCardProps {
    onSuccess?: () => void;
}

export default function DailyCheckInCard({ onSuccess }: DailyCheckInCardProps) {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);

    useEffect(() => {
        const fetchTodayStatus = async () => {
            try {
                const checkIn = await onboardingService.getTodayCheckIn();
                if (checkIn) {
                    setHasCheckedIn(true);
                    setSelectedMood(checkIn.mood);
                }
            } catch (error) {
                console.error('Failed to fetch check-in status:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTodayStatus();
    }, []);

    const handleMoodSelect = async (mood: string) => {
        if (hasCheckedIn) return;
        setIsSubmitting(true);
        try {
            await onboardingService.logMood(mood);
            setSelectedMood(mood);
            setHasCheckedIn(true);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to log mood:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="w-full h-48 glass rounded-[2.5rem] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative glass bg-white/70 rounded-[3rem] overflow-hidden shadow-xl border border-primary-500/5 mb-8"
        >
            {/* Header Content with Gradient */}
            <div className="p-8 pb-4 bg-linear-to-br from-[#9D8BFF]/20 via-[#F49B82]/10 to-transparent">
                <h2 className="text-3xl font-black text-foreground mb-1">
                    Good morning ☀️, welcome back.
                </h2>
                <p className="text-foreground/60 text-lg">It's nice to see you again.</p>
            </div>

            <div className="p-8 pt-4 flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                        <p className="text-xl font-bold text-foreground/80">
                            {hasCheckedIn ? 'Thank you for sharing. Every feeling is valid.' : 'How are you feeling right now?'}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {MOODS.map((mood) => (
                                <button
                                    key={mood.label}
                                    onClick={() => handleMoodSelect(mood.label)}
                                    disabled={isSubmitting || (hasCheckedIn && selectedMood !== mood.label)}
                                    className={`px-6 py-3 rounded-full border-2 transition-all flex items-center gap-2 group ${selectedMood === mood.label
                                            ? 'border-primary-500 bg-primary-50 scale-[1.05] shadow-lg shadow-primary-500/10'
                                            : hasCheckedIn
                                                ? 'border-foreground/5 bg-foreground/5 opacity-50 cursor-default'
                                                : 'border-transparent bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/10'
                                        }`}
                                >
                                    <span className="text-xl">{mood.emoji}</span>
                                    <span className="font-bold text-sm tracking-tight">{mood.label}</span>
                                    {isSubmitting && selectedMood === mood.label && (
                                        <Loader2 className="w-3 h-3 animate-spin text-primary-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Character Illustration */}
                <div className="relative w-48 h-48 shrink-0 hidden md:block">
                    <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=checkin&backgroundColor=transparent`}
                        alt="Gigi"
                        className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                </div>
            </div>

            {/* Subtle sparkling bottom edge if checked in */}
            {hasCheckedIn && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="h-1.5 w-full bg-linear-to-r from-primary-400 via-secondary-300 to-accent-300 origin-left"
                />
            )}
        </motion.div>
    );
}
