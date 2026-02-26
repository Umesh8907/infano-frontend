'use client';

import { useQuery } from '@tanstack/react-query';
import { learningService } from '@/services/learning.service';
import { useParams, useRouter } from 'next/navigation';
import QuestList from '@/features/learning/QuestList';
import { ArrowLeft, Loader2, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JourneyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const idOrSlug = params.slug as string;

    const { data: journey, isLoading: journeyLoading } = useQuery({
        queryKey: ['journey', idOrSlug],
        queryFn: () => learningService.getJourneyById(idOrSlug),
    });

    const { data: quests, isLoading: questsLoading } = useQuery({
        queryKey: ['quests', idOrSlug],
        queryFn: () => learningService.getQuestsByJourney(idOrSlug),
        enabled: !!idOrSlug,
    });

    if (journeyLoading || questsLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!journey) return <div>Journey not found</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-foreground/40 hover:text-primary-600 font-bold transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Adventures
            </button>

            {/* Hero Section */}
            <section className="relative rounded-[3rem] overflow-hidden min-h-[400px] flex flex-col justify-end p-12">
                <div className="absolute inset-0 z-0">
                    <img
                        src={journey.thumbnailUrl || '/api/placeholder/1200/600'}
                        className="w-full h-full object-cover"
                        alt={journey.title}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="relative z-10 text-white space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="px-4 py-1.5 glass bg-white/10 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-3 h-3 fill-primary-400 text-primary-400" />
                            {journey.totalXP} TOTAL XP
                        </div>
                        {journey.category && (
                            <div className="px-4 py-1.5 glass bg-white/10 rounded-full text-xs font-black uppercase tracking-widest">
                                {journey.category}
                            </div>
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl font-black tracking-tight"
                    >
                        {journey.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-lg max-w-2xl"
                    >
                        {journey.description}
                    </motion.p>
                </div>
            </section>

            {/* Quest List */}
            <QuestList quests={quests || []} journeyId={idOrSlug} />
        </div>
    );
}
