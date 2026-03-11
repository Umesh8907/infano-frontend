'use client';

import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

interface InsightCardProps {
    title: string;
    summary: string;
    advice: string;
    type: 'symptom_alert' | 'lifestyle_tip' | 'mood_pattern';
}

export default function InsightCard({ title, summary, advice, type }: InsightCardProps) {
    const isSymptom = type === 'symptom_alert';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden glass rounded-4xl p-8 border-primary-500/10 hover:border-primary-500/30 transition-all duration-500 shadow-sm hover:shadow-xl"
        >
            {/* Animated Background Glow */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-20 transition-all duration-700 group-hover:opacity-40 ${isSymptom ? 'bg-primary-400' : 'bg-accent-400'}`} />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${isSymptom ? 'bg-primary-50 text-primary-600' : 'bg-accent-50 text-accent-600'}`}>
                        {isSymptom ? <Sparkles className="w-6 h-6" /> : <Lightbulb className="w-6 h-6" />}
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 block mb-1">
                            Daily AI Insight
                        </span>
                        <h3 className="text-xl font-black text-foreground">{title}</h3>
                    </div>
                </div>

                <p className="text-foreground/60 leading-relaxed mb-6 font-medium">
                    {summary}
                </p>

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-primary-500/5 group-hover:bg-white/80 transition-colors">
                    <p className="text-sm font-bold text-primary-900 leading-relaxed">
                        {advice}
                    </p>
                </div>

                <button className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-600 group/btn">
                    Learn More 
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
            </div>
        </motion.div>
    );
}
