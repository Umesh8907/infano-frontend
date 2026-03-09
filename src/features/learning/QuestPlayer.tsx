'use client';

import { useState, useEffect, useMemo } from 'react';
import { Quest, QuestItemType, UserProgress } from '@/types/learning';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Trophy, Loader2, Sparkles, X, Heart, Save, Play, Info, Check, ChevronRight, Droplet, Droplets, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import StatusDialog, { DialogType } from '@/components/shared/StatusDialog';
import { useQuery } from '@tanstack/react-query';

import { learningService } from '@/services/learning.service';

interface QuestPlayerProps {
    quest: Quest;
    journeyId: string;
}

export default function QuestPlayer({ quest, journeyId }: QuestPlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);
    const [reflection, setReflection] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [hasResumed, setHasResumed] = useState(false);

    const currentItem = quest.items[currentIndex];
    const currentItemId = currentItem?._id || (currentItem as any)?.id;

    // Learning Cards State
    const [lastUnlockedCardIndex, setLastUnlockedCardIndex] = useState(0);

    // Knowledge Check State
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const router = useRouter();

    // Fetch live progress
    const { data: progress, refetch: refetchProgress } = useQuery({
        queryKey: ['progress', journeyId],
        queryFn: () => learningService.getProgress(journeyId),
    });

    // Helper to get current quest progress
    const currentQuestProgress = useMemo(() => {
        return progress?.questProgress?.find(qp => qp.questId === quest._id);
    }, [progress, quest._id]);

    // Resume logic: Prefer last viewed item (backend), otherwise first uncompleted item
    useEffect(() => {
        if (progress && !hasResumed) {
            const completedItemIds = new Set(currentQuestProgress?.completedItems?.map(ci => ci.itemId) || []);
            const firstUncompletedIndex = quest.items.findIndex(item => !completedItemIds.has(item._id || (item as any).id));

            const lastViewedId = currentQuestProgress?.lastViewedItemId;
            const lastViewedIndex = lastViewedId
                ? quest.items.findIndex(item => (item._id || (item as any).id) === lastViewedId)
                : -1;

            if (lastViewedIndex !== -1) {
                setCurrentIndex(lastViewedIndex);
            } else if (firstUncompletedIndex !== -1 && firstUncompletedIndex !== 0) {
                setCurrentIndex(firstUncompletedIndex);
            }
            setHasResumed(true);
        }
    }, [progress, hasResumed, currentQuestProgress, quest.items]);

    // Persist last viewed activity so reopening resumes exactly where the user left off
    useEffect(() => {
        if (!hasResumed) return;
        if (!currentItemId) return;

        // Fire-and-forget; failing this shouldn't block the UI
        learningService
            .setLastViewedItem(journeyId, quest._id, currentItemId)
            .catch(() => { });
    }, [hasResumed, currentItemId, journeyId, quest._id]);

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

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === quest.items.length - 1;

    const handleNext = async () => {
        setIsCompleting(true);
        try {
            // Save progress for the current item
            await learningService.completeItem(journeyId, quest._id, currentItem._id || (currentItem as any).id);
            await refetchProgress();

            if (isLast) {
                setIsFinishing(true);
                setTimeout(() => router.back(), 2500);
                return;
            }

            setReflection('');
            setHasSaved(false);
            setSelectedOption(null);
            setShowFeedback(false);
            setLastUnlockedCardIndex(0);
            setCurrentIndex(prev => prev + 1);
        } catch (err: any) {
            setDialog({
                isOpen: true,
                title: 'Progress Error',
                message: err.response?.data?.message || 'We couldn\'t save your progress. Please try again.',
                type: 'error'
            });
        } finally {
            setIsCompleting(false);
        }
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
                itemId: currentItem?._id || (currentItem as any).id,
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
        <div className="fixed inset-0 bg-bg-peach z-50 flex flex-col onboarding-flow-container text-text-main">
            <StatusDialog
                isOpen={dialog.isOpen}
                onClose={() => setDialog({ ...dialog, isOpen: false })}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
            />

            {/* Top Progress Bar */}
            <div className="p-4 flex items-center gap-6 border-b border-primary-500/5 bg-white/50 backdrop-blur-md">
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

            <div className="flex-1 flex overflow-hidden">
                {/* Content Area */}
                <main className="flex-1 relative flex items-center justify-center px-4 md:px-10 lg:px-16 py-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentItem?._id || currentIndex}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full  onboarding-card p-8 md:p-12 lg:p-14 min-h-[520px] md:min-h-[580px] flex flex-col justify-center relative overflow-hidden"
                        >
                            {/* Background Accent */}
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                <Sparkles className="w-64 h-64" />
                            </div>

                            <div className="relative z-10 space-y-8">


                                <h2 className="text-4xl font-black text-text-main leading-tight flex flex-col gap-2">
                                    <span className="text-primary-500 text-sm font-black uppercase tracking-widest block mb-1">
                                        {currentItem?.title}
                                    </span>
                                    {currentItem?.content?.subtitle && (
                                        <span className="text-xl font-bold text-text-muted italic block">
                                            {currentItem.content.subtitle}
                                        </span>
                                    )}
                                </h2>

                                <div className="text-lg text-text-muted leading-relaxed max-w-2xl">
                                    {currentItem?.type === 'story_hook' && (
                                        <div className="space-y-6">
                                            <div className="prose prose-lg text-text-muted max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                                {currentItem.content?.text?.split('\n').map((para: string, idx: number) => (
                                                    para.trim() && <p key={idx} className="mb-4">{para}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {currentItem?.type === 'video_activity' && (
                                        <div className="space-y-6">
                                            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl relative group">
                                                {currentItem.content?.videoUrl ? (
                                                    <iframe
                                                        src={currentItem.content.videoUrl}
                                                        title={currentItem.title}
                                                        className="w-full h-full border-0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                                                        <Play className="w-16 h-16 mb-4 opacity-20" />
                                                        <p className="font-bold">Video Player</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100">
                                                <p className="text-sm font-medium text-primary-800 whitespace-pre-line">
                                                    {currentItem.content?.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {currentItem?.type === 'learning_cards' && (
                                        <div className="w-full py-4">
                                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory custom-scrollbar justify-start md:justify-center">
                                                {(currentItem.content?.cards || []).map((card: any, idx: number) => {
                                                const isUnlocked = idx <= lastUnlockedCardIndex;
                                                const isNextToUnlock = idx === lastUnlockedCardIndex + 1;
                                                // Only blur cards that are beyond the next unlockable one
                                                const isLocked = idx > lastUnlockedCardIndex + 1;
                                                const isPreviewLocked = !isUnlocked && isNextToUnlock;

                                                return (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className={`relative p-10 rounded-3xl md:rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden shrink-0 w-full max-w-3xl md:max-w-4xl snap-center ${isLocked
                                                            ? 'bg-white/40 border-primary-100/50 opacity-60 grayscale'
                                                            : isPreviewLocked
                                                                ? 'bg-white border-primary-200 shadow-xl shadow-primary-500/10'
                                                                : 'bg-white border-primary-200 shadow-xl shadow-primary-500/5'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-8">
                                                            <div className={`w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 ${isLocked
                                                                ? 'bg-primary-50 text-primary-300'
                                                                : isPreviewLocked
                                                                    ? 'bg-primary-500/10 text-primary-600 border border-primary-500/10'
                                                                    : 'bg-primary-500 text-white'
                                                                }`}>
                                                                {(isLocked || isPreviewLocked) ? <Lock className="w-8 h-8" /> : (
                                                                    <>
                                                                        {idx === 0 && <Heart className="w-10 h-10" />}
                                                                        {idx === 1 && <Sparkles className="w-10 h-10" />}
                                                                        {idx === 2 && <Play className="w-10 h-10 fill-current" />}
                                                                        {idx === 3 && <Info className="w-10 h-10" />}
                                                                        {idx === 4 && <Droplet className="w-10 h-10" />}
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`text-2xl font-black mb-2 tracking-tight ${(isLocked || isPreviewLocked) ? 'text-text-muted' : 'text-primary-600'}`}>
                                                                    {card.title}
                                                                </h4>
                                                                {isUnlocked ? (
                                                                    <motion.p
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        className="text-text-main font-semibold leading-relaxed text-lg"
                                                                    >
                                                                        {card.content}
                                                                    </motion.p>
                                                                ) : (
                                                                    <p className="text-text-dim italic font-medium">
                                                                        {isPreviewLocked
                                                                            ? 'Ready to unlock — tap Unlock to reveal it.'
                                                                            : 'Complete previous phases to reveal this secret...'}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="shrink-0 pt-1">
                                                                {isNextToUnlock && (
                                                                    <button
                                                                        onClick={() => setLastUnlockedCardIndex(idx)}
                                                                        className="px-6 py-3 bg-primary-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 active:scale-95 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
                                                                    >
                                                                        Unlock <ArrowRight className="w-4 h-4" />
                                                                    </button>
                                                                )}

                                                                {isUnlocked && (
                                                                    <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-accent-500/20">
                                                                        <Check className="w-5 h-5" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {isLocked && (
                                                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10 pointer-events-none" />
                                                        )}
                                                    </motion.div>
                                                );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {currentItem?.type === 'insight' && (
                                        <div className="flex flex-col items-center text-center space-y-8 py-8">
                                            <div className="w-24 h-24 bg-accent-500/10 rounded-full flex items-center justify-center text-accent-500">
                                                <Sparkles className="w-12 h-12" />
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-2xl font-bold text-text-main leading-relaxed italic">
                                                    "{currentItem.content?.fullInsight || currentItem.content?.text}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {currentItem?.type === 'mini_challenge' && (
                                        <div className="space-y-6 pt-4">
                                            <div className="p-6 bg-primary-50 rounded-3xl border border-primary-100 italic text-primary-800">
                                                "{currentItem.content?.question || 'What are your thoughts on this?'}"
                                            </div>

                                            <div className="relative">
                                                <textarea
                                                    value={reflection}
                                                    onChange={(e) => setReflection(e.target.value)}
                                                    placeholder={currentItem.content?.placeholder || "Write your reflection here..."}
                                                    className="w-full p-8 rounded-4xl border-2 border-primary-100 focus:border-primary-500 outline-none min-h-[200px] text-text-main transition-all placeholder:text-text-dim"
                                                    disabled={hasSaved}
                                                />
                                                {hasSaved && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-4xl flex flex-col items-center justify-center text-primary-600"
                                                    >
                                                        <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mb-4">
                                                            <Heart className="w-8 h-8 fill-white" />
                                                        </div>
                                                        <p className="font-black text-xl">Reflection Saved!</p>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {!hasSaved && (
                                                <button
                                                    onClick={handleSaveReflection}
                                                    disabled={!reflection.trim() || isSaving}
                                                    className="btn-primary px-8 py-4 flex items-center gap-3 ml-auto rounded-2xl"
                                                >
                                                    {isSaving ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                                                    Save to Journal
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {currentItem?.type === 'knowledge_check' && (
                                        <div className="space-y-6 pt-4">
                                            <p className="text-xl font-bold text-text-main">
                                                {currentItem.content?.questions?.[0]?.question || 'Select the correct answer:'}
                                            </p>
                                            <div className="grid grid-cols-1 gap-3">
                                                {(currentItem.content?.questions?.[0]?.options || []).map((opt: string, i: number) => {
                                                    const isCorrectIndex = i === currentItem.content?.questions?.[0]?.correctOptionIndex;
                                                    const isSelected = selectedOption === i;

                                                    let stateClass = 'border-primary-100 hover:border-primary-300';
                                                    if (showFeedback) {
                                                        if (isCorrectIndex) stateClass = 'border-accent-500 bg-accent-50 text-accent-700';
                                                        else if (isSelected) stateClass = 'border-red-500 bg-red-50 text-red-700';
                                                        else stateClass = 'opacity-50 border-primary-50';
                                                    } else if (isSelected) {
                                                        stateClass = 'border-primary-500 bg-primary-50';
                                                    }

                                                    return (
                                                        <button
                                                            key={i}
                                                            disabled={showFeedback}
                                                            onClick={() => {
                                                                setSelectedOption(i);
                                                                setShowFeedback(true);
                                                            }}
                                                            className={`p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group ${stateClass}`}
                                                        >
                                                            <span>{opt}</span>
                                                            {showFeedback && isCorrectIndex && <Check className="w-5 h-5" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <AnimatePresence>
                                                {showFeedback && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`p-6 rounded-2xl flex gap-4 ${selectedOption === currentItem.content?.questions?.[0]?.correctOptionIndex
                                                            ? 'bg-accent-50 text-accent-800 border border-accent-100'
                                                            : 'bg-primary-50 text-primary-800 border border-primary-100'
                                                            }`}
                                                    >
                                                        <Info className="w-6 h-6 shrink-0" />
                                                        <p className="text-sm font-medium leading-relaxed">
                                                            {currentItem.content?.questions?.[0]?.feedback || "That's an interesting perspective! Here is some more information..."}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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

                {/* Right Navigation Panel */}
                <aside className="w-96 glass-dark bg-white/40 backdrop-blur-xl border-l border-primary-500/10 flex-col hidden lg:flex">
                    <div className="p-8 border-b border-primary-500/5">
                        <h3 className="text-xl font-black text-text-main flex items-center gap-3">
                            <Trophy className="w-5 h-5 text-primary-500" />
                            Quest Roadmap
                        </h3>
                        <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-2">
                            Step {currentIndex + 1} of {quest.items.length}
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {quest.items.map((item, idx) => {
                            const itemId = item._id || (item as any).id;
                            const isPersistentCompleted = currentQuestProgress?.completedItems?.some(ci => ci.itemId === itemId);
                            const isCurrent = idx === currentIndex;
                            const isPast = idx < currentIndex || isPersistentCompleted;
                            const isFuture = idx > currentIndex && !isPersistentCompleted;

                            return (
                                <button
                                    key={itemId || idx}
                                    onClick={() => {
                                        // Allow jumping back, or jumping to uncompleted but available items
                                        if (idx <= currentIndex || isPersistentCompleted) setCurrentIndex(idx);
                                    }}
                                    disabled={isFuture && !isPersistentCompleted}
                                    className={`w-full p-4 rounded-2xl flex items-start gap-4 transition-all text-left group ${isCurrent
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                        : isPast
                                            ? 'hover:bg-primary-50 text-text-main'
                                            : 'opacity-40 cursor-not-allowed text-text-muted'
                                        }`}
                                >
                                    <div className={`mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${isCurrent
                                        ? 'border-white text-white'
                                        : isPast
                                            ? 'border-accent-500 bg-accent-500 text-white'
                                            : 'border-primary-200 text-primary-400'
                                        }`}>
                                        {isPast ? <Check className="w-3 h-3" /> : idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold truncate ${isCurrent ? 'text-white' : 'text-text-main'}`}>
                                            {item.title}
                                        </p>
                                        <p className={`text-[10px] uppercase tracking-widest font-black mt-0.5 ${isCurrent ? 'text-white/60' : 'text-text-dim'}`}>
                                            {item.type.replace('_', ' ')}
                                        </p>
                                    </div>
                                    {isCurrent && <ChevronRight className="w-4 h-4 text-white opacity-40" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-8 bg-primary-500/5 border-t border-primary-500/5">
                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary-600">
                            <span>Quest XP Reward</span>
                            <span>{quest.xpReward} XP</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Footer Navigation */}
            <footer className="p-8 border-t border-primary-500/5 flex items-center justify-between bg-white/50 backdrop-blur-md">
                <button
                    onClick={handleBack}
                    className="px-8 py-4 glass rounded-2xl font-bold flex items-center gap-3 hover:bg-white/50 transition-all text-text-muted"
                >
                    <ArrowLeft className="w-5 h-5" />
                    {isFirst ? 'Exit Quest' : 'Go Back'}
                </button>

                <button
                    onClick={handleNext}
                    disabled={
                        isCompleting ||
                        (currentItem?.type === 'mini_challenge' && !hasSaved) ||
                        (currentItem?.type === 'knowledge_check' && !showFeedback) ||
                        (currentItem?.type === 'learning_cards' && lastUnlockedCardIndex < (currentItem.content?.cards || []).length - 1)
                    }
                    className={`px-12 py-4 rounded-2xl font-black text-lg transition-all flex items-center gap-3 group ${(isCompleting || (currentItem?.type === 'mini_challenge' && !hasSaved) || (currentItem?.type === 'knowledge_check' && !showFeedback) || (currentItem?.type === 'learning_cards' && lastUnlockedCardIndex < (currentItem.content?.cards || []).length - 1))
                        ? 'bg-primary-100 text-primary-300 cursor-not-allowed'
                        : 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 hover:bg-primary-600 active:scale-95'
                        }`}
                >
                    {isCompleting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                        <>
                            {isFirst && currentIndex === 0 && currentItem?.title?.includes('Periods &') ? 'Start My Journey' : (isLast ? 'Finish Adventure' : 'Continue')}
                            {!isLast && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </>
                    )}
                </button>
            </footer>
        </div>
    );
}
