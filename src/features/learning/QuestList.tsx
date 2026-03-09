import { Quest, UserProgress } from '@/types/learning';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, Play, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { learningService } from '@/services/learning.service';

interface QuestListProps {
    quests: Quest[];
    journeyId: string;
}

export default function QuestList({ quests, journeyId }: QuestListProps) {
    // Fetch live progress - always fresh so quest completion status updates immediately on return
    const { data: progress } = useQuery({
        queryKey: ['progress', journeyId],
        queryFn: () => learningService.getProgress(journeyId),
        staleTime: 0,           // always consider data stale
        refetchOnWindowFocus: true,  // refetch when user returns to this tab/page
    });


    // Sorting quests by order just in case
    const sortedQuests = [...quests].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Your Quest Roadmap</h2>
                <div className="flex items-center gap-2 text-foreground/40 font-bold uppercase text-xs tracking-tighter">
                    <span>{quests.length} Quests Total</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {sortedQuests.map((quest, i) => {
                    const qProgress = progress?.questProgress?.find(qp => qp.questId === quest._id);
                    const isCompleted = qProgress?.isCompleted || false;
                    const hasStarted = (qProgress?.completedItems?.length || 0) > 0;

                    // Locked if not the first quest and the previous quest is not completed
                    let isLocked = false;
                    if (i > 0) {
                        const prevQuest = sortedQuests[i - 1];
                        const prevQProgress = progress?.questProgress?.find(qp => qp.questId === prevQuest._id);
                        isLocked = !prevQProgress?.isCompleted;
                    }

                    return (
                        <motion.div
                            key={quest._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative glass p-6 rounded-3xl border-primary-500/10 flex items-center justify-between transition-all ${isLocked ? 'opacity-50 grayscale pointer-events-none' : 'hover:border-primary-500/30'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${isCompleted ? 'bg-accent-500/10 text-accent-600' : 'bg-primary-500/10 text-primary-600'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-xl font-bold">{quest.title}</h4>
                                        {isCompleted && (
                                            <span className="px-2 py-0.5 bg-accent-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Done</span>
                                        )}
                                        {!isCompleted && hasStarted && (
                                            <span className="px-2 py-0.5 bg-primary-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest animate-pulse">In Progress</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-foreground/40 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                                            {quest.xpReward} XP
                                        </span>
                                        <span>•</span>
                                        <span>{quest.items.length} Activities</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {isLocked ? (
                                    <Lock className="w-6 h-6 text-foreground/20 mr-4" />
                                ) : (
                                    <Link href={`/dashboard/quests/${quest.slug || quest._id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${isCompleted
                                                ? 'bg-accent-50 text-accent-600 border border-accent-100 hover:bg-accent-500 hover:text-white'
                                                : hasStarted
                                                    ? 'bg-primary-500 text-white shadow-primary-500/20'
                                                    : 'bg-white border border-primary-500/10 hover:bg-primary-500 hover:text-white'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <>
                                                    <Play className="w-4 h-4 fill-current" />
                                                    Replay
                                                </>
                                            ) : hasStarted ? (
                                                <>
                                                    <ArrowRight className="w-4 h-4" />
                                                    Resume Quest
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 fill-current" />
                                                    Start Quest
                                                </>
                                            )}
                                        </motion.button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
