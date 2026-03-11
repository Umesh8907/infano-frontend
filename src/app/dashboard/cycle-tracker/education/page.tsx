'use client';

import { useEffect, useState } from 'react';
import { cycleTrackerService } from '@/services/cycle-tracker.service';
import { motion } from 'framer-motion';
import { ChevronLeft, BookOpen, Sparkles } from 'lucide-react';
import EducationCard from '@/features/cycle-tracker/EducationCard';
import Link from 'next/link';

export default function EducationPage() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await cycleTrackerService.getAllEducation();
                setCards(res);
            } catch (err) {
                console.error('Failed to fetch education cards:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/cycle-tracker"
                    className="p-3 rounded-2xl glass hover:bg-primary-500/5 transition-all"
                >
                    <ChevronLeft className="w-6 h-6 text-foreground/60" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-foreground">Learn & Understand</h1>
                    <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">
                        Body Wisdom Library
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            {cards.length === 0 ? (
                <div className="glass p-12 rounded-4xl text-center border-primary-500/10">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-400">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <p className="text-foreground/40 font-bold">
                        No articles yet.{' '}
                        <a href="/api/cycle-tracker/seed-education" className="text-primary-600 underline">
                            Seed content
                        </a>
                    </p>
                </div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {cards.map((card, i) => (
                        <motion.div
                            key={card._id}
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <EducationCard card={card} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
