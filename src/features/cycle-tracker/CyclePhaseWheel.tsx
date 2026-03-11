'use client';

import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Flower2, Heart } from 'lucide-react';

interface PhaseWheelProps {
    currentPhase: string;
    day: number;
    totalDays: number;
}

const phaseDefinitions = [
    { name: 'Menstrual', color: 'text-primary-600', bg: 'bg-primary-500', icon: Heart, startPct: 0 },
    { name: 'Follicular', color: 'text-accent-600', bg: 'bg-accent-500', icon: Flower2, startPct: 0.18 },
    { name: 'Ovulatory', color: 'text-primary-500', bg: 'bg-primary-400', icon: Sun, startPct: 0.45 },
    { name: 'Luteal', color: 'text-accent-700', bg: 'bg-accent-600', icon: Moon, startPct: 0.55 },
];

export default function CyclePhaseWheel({ currentPhase, day, totalDays }: PhaseWheelProps) {
    const circumference = 911;
    const progress = Math.min(day / totalDays, 1);

    return (
        <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
            {/* Outer Ring with Gradient Shadow */}
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary-500/5 to-accent-500/5 blur-2xl" />
            
            <svg className="absolute w-full h-full -rotate-90 drop-shadow-sm">
                <circle
                    cx="160"
                    cy="160"
                    r="145"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-primary-500/5"
                />
                <motion.circle
                    cx="160"
                    cy="160"
                    r="145"
                    fill="none"
                    stroke="url(#cycleGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * circumference} ${circumference}`}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray: `${progress * circumference} ${circumference}` }}
                    transition={{ duration: 2, ease: "circOut" }}
                />
                <defs>
                    <linearGradient id="cycleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Inner Content - The "Living" Heart */}
            <motion.div 
                animate={{ 
                    boxShadow: ["0 0 20px rgba(236, 72, 153, 0.1)", "0 0 40px rgba(236, 72, 153, 0.2)", "0 0 20px rgba(236, 72, 153, 0.1)"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative z-10 text-center bg-white/80 backdrop-blur-xl rounded-full w-64 h-64 flex flex-col items-center justify-center border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]"
            >
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-5 rounded-[2.5rem] bg-linear-to-br from-primary-50 to-accent-50 mb-4 cursor-pointer"
                >
                    <Sparkles className="w-10 h-10 text-primary-600" />
                </motion.div>
                
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-2">
                    Cycle Day
                </div>
                <div className="flex items-baseline gap-1">
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-br from-primary-900 to-primary-700 tracking-tighter"
                    >
                        {day}
                    </motion.span>
                </div>
                <div className="text-xs font-bold text-foreground/40 mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                    {currentPhase} Phase
                </div>
            </motion.div>

            {/* Interactive Phase Markers — dynamic based on totalDays */}
            {phaseDefinitions.map((phase, i) => {
                const angle = phase.startPct * 360;
                const isActive = currentPhase === phase.name;

                return (
                    <motion.div
                        key={phase.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            position: 'absolute',
                            transform: `rotate(${angle}deg) translateY(-145px)`,
                        }}
                        className="group cursor-help"
                    >
                        <motion.div 
                            whileHover={{ scale: 1.4 }}
                            className={`p-2.5 rounded-full transition-all duration-500 ${isActive ? `${phase.bg} text-white shadow-lg ring-8 ring-primary-500/10` : 'bg-white text-foreground/20 hover:text-primary-500 hover:shadow-md'}`}
                            style={{ transform: `rotate(-${angle}deg)` }}
                        >
                            <phase.icon className="w-5 h-5" />
                            
                            {/* Tooltip */}
                            <div className="absolute left-1/2 -top-12 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="bg-primary-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                                    {phase.name}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
}

