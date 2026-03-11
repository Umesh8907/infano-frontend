'use client';

import { motion } from 'framer-motion';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';

interface EducationCardProps {
    card: {
        title: string;
        category: string;
        content: string;
        icon: string;
    };
}

export default function EducationCard({ card }: EducationCardProps) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-4xl bg-white/40 border-primary-500/5 hover:border-primary-500/20 transition-all cursor-pointer group"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600/60">{card.category}</span>
                </div>
                <Sparkles className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary-600 transition-colors">{card.title}</h3>
            <p className="text-sm text-foreground/60 line-clamp-2 mb-6">{card.content}</p>
            
            <div className="flex items-center text-xs font-bold text-primary-600 gap-1 group-hover:gap-2 transition-all">
                Read Story <ChevronRight className="w-3 h-3" />
            </div>
        </motion.div>
    );
}
