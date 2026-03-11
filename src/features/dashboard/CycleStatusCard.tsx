'use client';

import { useEffect, useState } from 'react';
import { cycleTrackerService, CycleStatus } from '@/services/cycle-tracker.service';
import { Droplets, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CycleStatusCard() {
    const [status, setStatus] = useState<CycleStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await cycleTrackerService.getDashboard();
                setStatus(data);
            } catch (error) {
                console.error('Failed to fetch cycle status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) {
        return <div className="glass p-8 rounded-3xl animate-pulse h-40" />;
    }

    if (!status || status.status === 'NO_DATA') {
        return (
            <div className="glass p-8 rounded-3xl bg-linear-to-br from-primary-500/5 to-accent-500/5 border-primary-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                        <Droplets className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Start your Cycle Journey</h3>
                        <p className="text-foreground/60">Log your first period to get AI predictions.</p>
                    </div>
                </div>
                <Link 
                    href="/dashboard/cycle-tracker"
                    className="px-6 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                    Log Period <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl bg-linear-to-br from-primary-500/10 to-accent-500/10 border-primary-500/20 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden"
        >
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Droplets className="w-32 h-32 text-primary-600" />
            </div>

            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">{status.phase} Phase</span>
                </div>
                <h3 className="text-3xl font-black text-foreground mb-1">Day {status.cycleDay}</h3>
                <p className="text-foreground/60 text-sm">of your rhythm</p>
            </div>

            <div className="flex flex-col justify-center border-x border-primary-500/10 px-8">
                <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-accent-600" />
                    <span className="text-sm font-bold text-foreground/80">Next Prediction</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                    {status.predictedNextPeriod ? new Date(status.predictedNextPeriod).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 'Calculating...'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-16 h-1 bg-foreground/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-accent-500" 
                            style={{ width: `${(status.confidence || 0) * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-foreground/40 uppercase">Confidence</span>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <span className="text-xs font-bold text-foreground/40 uppercase mb-3 px-1 text-right">Daily Tip</span>
                <div className="bg-white/50 p-4 rounded-2xl border border-primary-500/5 text-sm font-medium italic text-primary-800 leading-relaxed text-right">
                    "{status.tips?.[0] || 'Listen to your body today.'}"
                </div>
                <Link 
                    href="/dashboard/cycle-tracker"
                    className="mt-4 text-primary-600 font-bold text-sm flex items-center justify-end gap-1 hover:gap-2 transition-all"
                >
                    Open Tracker <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}
