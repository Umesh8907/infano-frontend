'use client';

import { motion } from 'framer-motion';
import { Rocket, Sparkles, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';

export default function Hero() {
    const router = useRouter();
    const { token, user } = useAppSelector((state) => state.auth);

    const handleStartJourney = () => {
        if (!token) {
            router.push('/login');
        } else if (user && !user.isDashboardActive) {
            router.push('/onboarding');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4">
            {/* Animated Background Elements */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary-100 rounded-full blur-[100px] opacity-50 z-0"
            />
            <motion.div
                animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent-500 rounded-full blur-[120px] opacity-30 z-0"
            />

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary-500/20 text-primary-600 font-medium text-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>The Next Generation of Learning</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-tight"
                    aria-label="Infano: Where Imagination Meets Education"
                >
                    Infano: Where <span className="gradient-text">Imagination</span> <br />
                    Meets Education.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-xl text-foreground/60 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    Experience Infano's gamified learning garden. Unlock kits, complete quests, and earn rewards on your journey to mastery.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center"
                >
                    <button
                        onClick={handleStartJourney}
                        className="px-8 py-4 bg-primary-500 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-primary-500/20 hover:bg-primary-600 hover:scale-105 transition-all flex items-center gap-2 group"
                    >
                        <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        Start Journey
                    </button>
                    <button
                        onClick={handleStartJourney}
                        className="px-8 py-4 glass rounded-2xl font-semibold text-lg hover:bg-white/50 transition-all flex items-center gap-2 group"
                    >
                        <BookOpen className="w-5 h-5 opacity-60" />
                        Activate Kit
                    </button>
                </motion.div>
            </div>

            {/* Floating Elements - Visual Fluff */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-[10%] glass p-4 rounded-2xl hidden lg:block border-primary-500/10 shadow-lg"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        ⭐
                    </div>
                    <div>
                        <div className="text-sm font-bold">New Badge!</div>
                        <div className="text-xs text-foreground/50 text-left">Explorer Level 1</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
