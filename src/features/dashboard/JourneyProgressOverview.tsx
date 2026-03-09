'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { learningService } from '@/services/learning.service';

type StepStatus = 'completed' | 'current' | 'locked';

interface JourneyStep {
    id: string;
    title: string;
    subtitle: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
    {
        id: 'first-step',
        title: 'First Step',
        subtitle: 'You explored this step — amazing!',
    },
    {
        id: 'understanding-body',
        title: 'Understanding My Body',
        subtitle: "You're here right now.",
    },
    {
        id: 'feelings-toolkit',
        title: 'My Feelings Toolkit',
        subtitle: 'Coming up soon on your journey…',
    },
    {
        id: 'confidence-sparks',
        title: 'Confidence Sparks',
        subtitle: 'Coming up on your journey…',
    },
    {
        id: 'friendship-compass',
        title: 'Friendship Compass',
        subtitle: 'Coming up on your journey…',
    },
];

function getStepStatus(currentIndex: number, stepIndex: number): StepStatus {
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'locked';
}

export default function JourneyProgressOverview() {
    const { data: overview, isLoading } = useQuery({
        queryKey: ['progress-overview'],
        queryFn: () => learningService.getLatestProgressOverview(),
    });

    const totalSteps = JOURNEY_STEPS.length;

    const {
        currentStepIndex,
        unlockedSteps,
        progressPercent,
    } = useMemo(() => {
        if (!overview || !overview.totalQuests) {
            return {
                currentStepIndex: 0,
                unlockedSteps: 1,
                progressPercent: 0,
            };
        }

        const completedRatio = Math.min(
            1,
            overview.completedQuests / overview.totalQuests,
        );

        if (overview.isJourneyCompleted || completedRatio === 1) {
            return {
                currentStepIndex: totalSteps - 1,
                unlockedSteps: totalSteps,
                progressPercent: 100,
            };
        }

        const rawIndex = completedRatio * totalSteps;
        const idx = Math.max(0, Math.min(totalSteps - 1, Math.ceil(rawIndex) - 1));

        const unlocked = Math.max(1, idx + 1);
        const percent = Math.round(completedRatio * 100);

        return {
            currentStepIndex: idx,
            unlockedSteps: unlocked,
            progressPercent: percent,
        };
    }, [overview, totalSteps]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-[3rem] p-8 md:p-10 bg-linear-to-b from-[#FFE6F3]/80 via-[#FFF6EC]/80 to-white border-primary-500/10 shadow-xl relative overflow-hidden"
        >
            {/* Soft glow background accents */}
            <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-primary-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-accent-200/30 blur-3xl" />

            <div className="relative space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black tracking-[0.25em] uppercase text-foreground/40">
                            My Journey Home
                        </p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                                My Growth Path
                            </h2>
                            <span className="text-2xl" aria-hidden="true">
                                🌱
                            </span>
                        </div>
                        <p className="text-foreground/50 text-sm md:text-base max-w-xl">
                            Every step you take helps you grow stronger.
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-500 animate-pulse" />
                            <span>
                                {unlockedSteps} / {totalSteps} steps unlocked
                            </span>
                        </div>
                        <div className="w-full md:w-64 h-2 rounded-full bg-white/60 border border-white/60 overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="h-full bg-linear-to-r from-primary-400 via-secondary-300 to-accent-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Journey path */}
                <div className="relative mt-4">
                    {/* Glowing path line */}
                    <div className="absolute left-6 right-6 top-10 md:top-12 h-1 rounded-full bg-linear-to-r from-primary-200 via-accent-200 to-primary-200 opacity-70 blur-[1px]" />
                    <div className="absolute left-6 right-6 top-10 md:top-12 h-0.5 rounded-full bg-white/80" />

                    <div className="relative flex justify-between gap-4 md:gap-6">
                        {JOURNEY_STEPS.map((step, index) => {
                            const status = getStepStatus(currentStepIndex, index);
                            const isCompleted = status === 'completed';
                            const isCurrent = status === 'current';

                            return (
                                <div
                                    key={step.id}
                                    className="flex-1 min-w-0 flex flex-col items-center text-center gap-3"
                                >
                                    {/* Step marker */}
                                    <div
                                        className={[
                                            'w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg border-2',
                                            isCompleted && 'bg-primary-500 text-white border-primary-400',
                                            isCurrent &&
                                            'bg-white text-primary-600 border-primary-300 shadow-primary-500/30',
                                            status === 'locked' &&
                                            'bg-white/60 text-foreground/30 border-foreground/10',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                    >
                                        {isCompleted && <CheckCircle2 className="w-7 h-7" />}
                                        {isCurrent && <span className="text-2xl">😊</span>}
                                        {status === 'locked' && <Lock className="w-6 h-6" />}
                                    </div>

                                    {/* Labels */}
                                    <div className="space-y-1 max-w-[7.5rem] md:max-w-[9rem]">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/35">
                                            Step {index + 1}
                                        </p>
                                        <p className="text-xs md:text-sm font-semibold text-foreground truncate">
                                            {step.title}
                                        </p>
                                        <p className="text-[10px] md:text-[11px] text-foreground/45 leading-snug line-clamp-2">
                                            {step.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
                    <p className="text-xs md:text-sm text-foreground/50 max-w-md">
                        {overview ? (
                            <>
                                You&apos;re currently on{' '}
                                <span className="font-semibold text-primary-600">
                                    {overview.journeyTitle}
                                </span>
                                . Keep going to unlock the next chapter of your journey.
                            </>
                        ) : (
                            <>
                                You haven&apos;t started a journey yet. Pick one to begin your growth
                                path.
                            </>
                        )}
                    </p>

                    <div className="flex gap-3">
                        <Link href={overview ? `/dashboard/journeys/${overview.journeySlug}` : '/dashboard/journeys'}>
                            <button className="px-6 py-3 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-[0.18em] bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all hover:-translate-y-0.5">
                                {overview ? 'Continue Journey' : 'Start a Journey'}
                            </button>
                        </Link>
                        <Link href="/dashboard/journeys">
                            <button className="px-6 py-3 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-[0.18em] bg-white/80 text-foreground/70 border border-primary-500/10 hover:border-primary-500/30 hover:text-primary-700 transition-all hover:-translate-y-0.5">
                                Browse Adventures
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
