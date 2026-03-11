'use client';

import { useEffect, useState, useCallback } from 'react';
import { cycleTrackerService, CycleStatus, DailyLogData } from '@/services/cycle-tracker.service';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, Calendar, Plus, Play, Sparkles, Heart, Zap, Wind, CheckCircle2 } from 'lucide-react';
import CyclePhaseWheel from '@/features/cycle-tracker/CyclePhaseWheel';
import LogDailyModal from '@/features/cycle-tracker/LogDailyModal';
import CycleOnboardingModal from '@/features/cycle-tracker/CycleOnboardingModal';
import EducationCard from '@/features/cycle-tracker/EducationCard';
import Link from 'next/link';

export default function CycleTrackerPage() {
    const [status, setStatus] = useState<CycleStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [education, setEducation] = useState<any[]>([]);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [todayLog, setTodayLog] = useState<DailyLogData | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            const [res, eduRes] = await Promise.all([
                cycleTrackerService.getDashboard(),
                cycleTrackerService.getEducation(),
            ]);
            setStatus(res);
            setEducation(eduRes);
        } catch (err) {
            console.error('Failed to fetch cycle status:', err);
        } finally {
            setLoading(false);
        }
        // Fetch today's log independently — 404 just means no log yet
        try {
            const logRes = await cycleTrackerService.getTodayLog();
            setTodayLog(logRes ?? null);
        } catch {
            setTodayLog(null);
        }
    }, []);

    const handleLogSuccess = useCallback(async () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        await fetchStatus();
    }, [fetchStatus]);

    const moodLabels: Record<string, string> = { happy: '😊 Happy', calm: '😌 Calm', neutral: '😐 Neutral', low: '😔 Low', stressed: '😫 Stressed' };

    const handleResetData = async () => {
        if (!window.confirm('Are you sure you want to clear ALL your cycle and logging history? This cannot be undone.')) return;
        
        setIsResetting(true);
        try {
            await cycleTrackerService.resetData();
            await fetchStatus();
        } catch (err) {
            console.error('Failed to reset data:', err);
        } finally {
            setIsResetting(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Loading your rhythm...</p>
            </div>
        );
    }

    if (!status || status.status === 'NO_DATA') {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-12 rounded-4xl text-center border-primary-500/10"
                >
                    <div className="w-24 h-24 bg-primary-100 rounded-4xl flex items-center justify-center mx-auto mb-8 text-primary-600">
                        <Calendar className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground mb-4">Meet Cycle Companion</h1>
                    <p className="text-xl text-foreground/60 mb-12 max-w-xl mx-auto">
                        Your friendly guide to understanding your body's unique rhythm.
                        Set up your profile to get personalized predictions.
                    </p>
                    <button
                        onClick={() => setIsOnboardingOpen(true)}
                        className="px-12 py-5 rounded-3xl bg-primary-600 text-white font-black text-xl shadow-xl shadow-primary-500/20 hover:scale-105 transition-all"
                    >
                        Get Started
                    </button>
                </motion.div>

                <CycleOnboardingModal
                    isOpen={isOnboardingOpen}
                    onClose={() => setIsOnboardingOpen(false)}
                    onSuccess={fetchStatus}
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground mb-2">Cycle Companion</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                        <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">AI-Powered Rhythm Tracking</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 rounded-2xl glass hover:text-primary-600 transition-all">
                        <Info className="w-5 h-5" />
                    </button>
                    <Link href="/dashboard/cycle-tracker/calendar" className="p-3 rounded-2xl glass hover:text-primary-600 transition-all flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="hidden md:inline font-bold text-sm">Calendar</span>
                    </Link>
                    <button
                        onClick={() => setIsLogModalOpen(true)}
                        className="px-6 py-3 rounded-2xl bg-primary-600 text-white font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/10"
                    >
                        <Plus className="w-5 h-5" />
                        Log Daily
                    </button>
                </div>
            </header>

            {/* Hero Section: Rhythm Wheel & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center order-2 lg:order-1">
                    <CyclePhaseWheel
                        currentPhase={status.phase}
                        day={status.cycleDay}
                        totalDays={status.cycleLength || 28}
                    />
                </div>

                <div className="space-y-8 order-1 lg:order-2">
                    <div className="glass p-10 rounded-4xl bg-white border-primary-500/10 relative overflow-hidden group">
                        <Sparkles className="absolute -top-6 -right-6 w-32 h-32 text-primary-500/5 group-hover:scale-110 transition-transform" />

                        <div className="space-y-6 relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2">Current Status</p>
                                <h2 className="text-5xl font-black text-foreground leading-tight">
                                    {status.status === 'ACTIVE' ? `Day ${status.cycleDay} of ${status.phase}` : 'Ready to Start'}
                                </h2>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Predicted Period</p>
                                    <p className="text-lg font-black text-foreground">
                                        {status.nextPeriodDate ? new Date(status.nextPeriodDate).toLocaleDateString('default', { day: 'numeric', month: 'short' }) : 'TBD'}
                                    </p>
                                </div>
                                <div className="w-px h-10 bg-primary-500/10" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Confidence</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className={`w-3 h-1.5 rounded-full ${i < Math.round(status.predictionConfidence * 3) ? 'bg-primary-500' : 'bg-primary-100'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-black text-primary-600">{Math.round(status.predictionConfidence * 100)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-primary-50 rounded-3xl border border-primary-500/5 space-y-2">
                                <div className="flex items-center gap-2 text-primary-600">
                                    <Info className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">Daily Wisdom</span>
                                </div>
                                <p className="text-sm text-primary-900 font-bold leading-relaxed">{status.tips?.[0] || 'Keep logging to see personalized daily tips!'}</p>
                            </div>

                            <Link href="#education" className="flex items-center gap-2 text-primary-600 font-bold text-sm hover:gap-3 transition-all">
                                <Play className="w-3 h-3 fill-current" /> Learn more
                            </Link>

                            {status.predictionConfidence < 0.6 && (
                                <div className="mt-4 p-4 bg-primary-50 rounded-2xl flex items-center gap-3 border border-primary-500/10">
                                    <Info className="w-5 h-5 text-primary-500" />
                                    <p className="text-xs text-primary-900 leading-tight">
                                        <span className="font-black uppercase block mb-1">AI Note</span>
                                        {status.reason || 'Calculated based on adolescent trends. Consistency improves accuracy.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Logs Overlay */}
            <div className="glass p-10 rounded-[3rem] border-primary-500/10 mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-foreground">Today's Support</h3>
                    <button
                        onClick={() => setIsLogModalOpen(true)}
                        className="text-xs font-black text-primary-600 uppercase tracking-widest px-4 py-2 bg-primary-50 rounded-xl hover:bg-primary-100 transition-all"
                    >
                        {todayLog ? 'Edit Logs' : '+ Add Log'}
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/40 border border-primary-500/5 p-6 rounded-4xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-3">
                            <Heart className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-foreground/40 text-[10px] uppercase tracking-wider">Mood</span>
                        <span className="font-bold text-foreground mt-1">
                            {todayLog?.mood ? moodLabels[todayLog.mood] : 'Not logged'}
                        </span>
                    </div>
                    <div className="bg-white/40 border border-primary-500/5 p-6 rounded-4xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-3">
                            <Zap className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-foreground/40 text-[10px] uppercase tracking-wider">Energy</span>
                        <span className="font-bold text-foreground mt-1">
                            {todayLog?.energy != null ? `${todayLog.energy} / 10` : 'Not logged'}
                        </span>
                    </div>
                    <div className="bg-white/40 border border-primary-500/5 p-6 rounded-4xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-3">
                            <Wind className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-foreground/40 text-[10px] uppercase tracking-wider">Symptoms</span>
                        <span className="font-bold text-foreground mt-1 text-center text-xs leading-snug">
                            {todayLog?.symptoms && todayLog.symptoms.length > 0 ? todayLog.symptoms.join(', ') : 'None'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Education Section */}
            {education.length > 0 && (
                <div id="education" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-foreground">Learn & Understand</h2>
                        <Link href="/dashboard/cycle-tracker/education" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {education.map(card => (
                            <EducationCard key={card._id} card={card} />
                        ))}
                    </div>
                </div>
            )}

            <LogDailyModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSuccess={handleLogSuccess}
            />

            <CycleOnboardingModal
                isOpen={isOnboardingOpen}
                onClose={() => setIsOnboardingOpen(false)}
                onSuccess={handleLogSuccess}
            />
            {/* Reset Data Footer */}
            <div className="pt-12 border-t border-primary-500/5 text-center">
                <button 
                    onClick={handleResetData}
                    disabled={isResetting}
                    className="text-[10px] font-black uppercase tracking-widest text-foreground/20 hover:text-red-500 transition-all disabled:opacity-50"
                >
                    {isResetting ? 'Resetting...' : 'Reset Tracker Data'}
                </button>
            </div>
        </div>
    );
}
