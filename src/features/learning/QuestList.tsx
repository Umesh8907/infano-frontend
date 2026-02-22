import { Quest } from '@/types/learning';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, Play, Star } from 'lucide-react';
import Link from 'next/link';

interface QuestListProps {
    quests: Quest[];
    journeyId: string;
}

export default function QuestList({ quests, journeyId }: QuestListProps) {
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
                    const isLocked = false; // logic will come from progress later
                    const isCompleted = false;

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
                                    <h4 className="text-xl font-bold mb-1">{quest.title}</h4>
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
                                    <Link href={`/dashboard/quests/${quest._id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-3 bg-white border border-primary-500/10 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-primary-500 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            Start Quest
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
