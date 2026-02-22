'use client';

import { useQuery } from '@tanstack/react-query';
import { learningService } from '@/services/learning.service';
import JourneyCard from './JourneyCard';
import { Search, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JourneyExplorer() {
    const { data: journeys, isLoading } = useQuery({
        queryKey: ['journeys'],
        queryFn: () => learningService.getJourneys(),
    });

    return (
        <div className="space-y-12">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black mb-4 tracking-tight">Pick Your <span className="gradient-text">Adventure</span></h1>
                    <p className="text-foreground/40 text-lg font-medium">Explore worlds of science, imagination, and discovery.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                        <input
                            type="text"
                            placeholder="Search adventures..."
                            className="pl-11 pr-4 py-3 rounded-2xl glass border-primary-500/5 focus:border-primary-500/20 outline-none w-64 text-sm font-medium"
                        />
                    </div>
                    <button className="p-3 glass rounded-2xl border-primary-500/5 hover:border-primary-500/20 text-foreground/40">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {journeys?.map((journey, i) => (
                        <JourneyCard key={journey._id} journey={journey} index={i} />
                    ))}

                    {/* Empty State / Coming Soon */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="glass border-2 border-dashed border-primary-500/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center"
                    >
                        <div className="w-16 h-16 bg-surface rounded-3xl flex items-center justify-center text-3xl mb-4 grayscale">🚀</div>
                        <h4 className="text-xl font-bold mb-1">More Coming Soon</h4>
                        <p className="text-foreground/30 text-sm">We're building new worlds every week!</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
