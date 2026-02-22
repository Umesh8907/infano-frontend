'use client';

import { useState } from 'react';
import { Quest, QuestItemType } from '@/types/learning';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Trophy, Loader2, Sparkles, X, Heart, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import StatusDialog, { DialogType } from '@/components/shared/StatusDialog';

interface QuestPlayerProps {
    quest: Quest;
}

export default function QuestPlayer({ quest }: QuestPlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);
    const [reflection, setReflection] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const router = useRouter();

    // Status Dialog state
    const [dialog, setDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: DialogType;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const currentItem = quest.items[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === quest.items.length - 1;

    const handleNext = () => {
        if (isLast) {
            setIsFinishing(true);
            setTimeout(() => router.back(), 2000);
            return;
        }
        setReflection('');
        setHasSaved(false);
        setCurrentIndex(prev => prev + 1);
    };

    const handleBack = () => {
        if (isFirst) {
            router.back();
            return;
        }
        setCurrentIndex(prev => prev - 1);
    };

    const handleSaveReflection = async () => {
        if (!reflection.trim()) return;
        setIsSaving(true);
        try {
            await api.post('/insights/submit', {
                questId: quest._id,
                itemId: currentItem?._id || currentItem?.id,
                response: reflection,
            });
            setHasSaved(true);
        } catch (err) {
            setDialog({
                isOpen: true,
                title: 'Journaling Error',
                message: 'We couldn\'t save your reflection right now. Please check your connection and try again.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#fffafa] z-50 flex flex-col onboarding-flow-container text-text-main">
            <StatusDialog
                isOpen={dialog.isOpen}
                onClose={() => setDialog({ ...dialog, isOpen: false })}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
            />

            {/* Top Progress Bar */}
            <div className="p-4 flex items-center gap-6">
                <button
                    onClick={() => router.back()}
                    className="p-3 hover:bg-primary-500/10 rounded-2xl text-text-dim transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex-1 h-3 bg-primary-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / quest.items.length) * 100}%` }}
                        className="h-full bg-primary-500"
                    />
                </div>

                <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl text-xs font-bold text-primary-600">
                    <Trophy className="w-4 h-4" />
                    {quest.items.reduce((acc, item) => acc + (item.xpReward || 0), 0)} TOTAL XP
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 relative flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem?.id || currentIndex}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full max-w-4xl onboarding-card p-12 min-h-[500px] flex flex-col justify-center relative overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Sparkles className="w-64 h-64" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-primary-500/10 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest">
                                    Activity {currentIndex + 1}
                                </span>
                                <span className="text-text-dim">•</span>
                                <span className="text-text-dim text-xs font-bold uppercase tracking-widest">
                                    {currentItem?.type?.replace('_', ' ')}
                                </span>
                            </div>

                            <h2 className="text-4xl font-black text-text-main leading-tight">
                                {currentItem?.title || 'Take a moment to reflect'}
                            </h2>

                            <div className="text-lg text-text-muted leading-relaxed max-w-2xl">
                                {currentItem?.type === QuestItemType.STORY_HOOK && (
                                    <p>{currentItem.content?.text || 'Loading story...'}</p>
                                )}

                                {currentItem?.type === QuestItemType.MINI_CHALLENGE && (
                                    <div className="space-y-6 pt-4">
                                        <div className="p-6 bg-primary-50 rounded-3xl border border-primary-100 italic text-primary-800">
                                            "{currentItem.content?.question || 'What are your thoughts on this?'}"
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                value={reflection}
                                                onChange={(e) => setReflection(e.target.value)}
                                                placeholder="Write your reflection here..."
                                                className="w-full p-8 rounded-[2rem] border-2 border-primary-100 focus:border-primary-500 outline-none min-h-[200px] text-text-main transition-all placeholder:text-text-dim"
                                                disabled={hasSaved}
                                            />
                                            {hasSaved && (
                                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center text-primary-600">
                                                    <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mb-4">
                                                        <Heart className="w-8 h-8 fill-white" />
                                                    </div>
                                                    <p className="font-black text-xl">Reflection Saved!</p>
                                                </div>
                                            )}
                                        </div>

                                        {!hasSaved && (
                                            <button
                                                onClick={handleSaveReflection}
                                                disabled={!reflection.trim() || isSaving}
                                                className="btn-primary px-8 py-4 flex items-center gap-3 ml-auto"
                                            >
                                                {isSaving ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                                                Save to Journal
                                            </button>
                                        )}
                                    </div>
                                )}

                                {currentItem?.type === QuestItemType.KNOWLEDGE_CHECK && (
                                    <div className="space-y-4 pt-4">
                                        <p className="font-bold text-text-main">
                                            {currentItem.content?.questions?.[0]?.question || 'Select the correct answer:'}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {(currentItem.content?.questions?.[0]?.options || ['Option A', 'Option B']).map((opt: string, i: number) => (
                                                <button key={i} className="p-6 rounded-3xl border-2 border-primary-100 hover:border-primary-500 text-left font-bold transition-all hover:bg-white active:scale-95 text-text-main">
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Success Overlay */}
                <AnimatePresence>
                    {isFinishing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-primary-500 z-50 flex flex-col items-center justify-center text-white text-center p-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                            >
                                <Trophy className="w-32 h-32 mb-8 mx-auto" />
                            </motion.div>
                            <h2 className="text-6xl font-black mb-4">Quest Complete!</h2>
                            <p className="text-white/70 text-2xl font-medium mb-12">You've earned {quest.xpReward} XP and made the garden safer!</p>
                            <div className="flex items-center gap-4">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="font-bold tracking-widest uppercase text-sm">Saving Progress...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer Navigation */}
            <footer className="p-8 border-t border-primary-500/5 flex items-center justify-between">
                <button
                    onClick={handleBack}
                    className="px-8 py-4 glass rounded-2xl font-bold flex items-center gap-3 hover:bg-white/50 transition-all text-text-muted"
                >
                    <ArrowLeft className="w-5 h-5" />
                    {isFirst ? 'Exit Quest' : 'Go Back'}
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentItem?.type === QuestItemType.MINI_CHALLENGE && !hasSaved}
                    className={`px-12 py-4 rounded-2xl font-black text-lg transition-all flex items-center gap-3 group ${(currentItem?.type === QuestItemType.MINI_CHALLENGE && !hasSaved)
                            ? 'bg-primary-100 text-primary-300 cursor-not-allowed'
                            : 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 hover:bg-primary-600 active:scale-95'
                        }`}
                >
                    {isLast ? 'Finish Adventure' : 'Continue'}
                    {!isLast && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
            </footer>
        </div>
    );
}
