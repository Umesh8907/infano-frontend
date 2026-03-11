'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Wind, Zap, Smile, Droplets, Check } from 'lucide-react';
import { cycleTrackerService, DailyLogData } from '@/services/cycle-tracker.service';

interface LogDailyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const flowLevels = [
    { id: 'none', label: 'None', color: 'bg-primary-100 text-primary-600' },
    { id: 'light', label: 'Light', color: 'bg-primary-200 text-primary-700' },
    { id: 'medium', label: 'Medium', color: 'bg-primary-400 text-white' },
    { id: 'heavy', label: 'Heavy', color: 'bg-primary-600 text-white' },
];

const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
    { id: 'low', emoji: '😔', label: 'Low' },
    { id: 'stressed', emoji: '😫', label: 'Stressed' },
];

const commonSymptoms = [
    'Cramps', 'Headache', 'Bloating', 'Acne', 'Backache', 'Tiredness'
];

export default function LogDailyModal({ isOpen, onClose, onSuccess }: LogDailyModalProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<DailyLogData>({
        flowLevel: 'none',
        mood: 'neutral',
        energy: 5,
        symptoms: [],
        lifestyleTriggers: [],
    });

    const handleSubmit = async () => {
        try {
            await cycleTrackerService.logDailyData(data);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to log data:', error);
        }
    };

    const toggleSymptom = (symptom: string) => {
        setData(prev => ({
            ...prev,
            symptoms: prev.symptoms?.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...(prev.symptoms || []), symptom]
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary-950/20 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-xl glass rounded-4xl p-10 bg-white border-primary-500/10 shadow-2xl overflow-hidden"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-primary-50 transition-all text-foreground/40 hover:text-primary-600"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-10 text-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-50 px-3 py-1 rounded-full">Step {step} of 3</span>
                            <h2 className="text-3xl font-black text-foreground mt-4">
                                {step === 1 ? 'How is your flow?' : step === 2 ? 'How do you feel?' : 'Any symptoms?'}
                            </h2>
                        </div>

                        <div className="min-h-[300px]">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {flowLevels.map((lvl) => (
                                            <button
                                                key={lvl.id}
                                                onClick={() => {
                                                    setData({ ...data, flowLevel: lvl.id as any });
                                                    setStep(2);
                                                }}
                                                className={`p-8 rounded-4xl border-2 transition-all flex flex-col items-center gap-3 ${data.flowLevel === lvl.id ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-transparent bg-primary-50 hover:bg-primary-100'}`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${lvl.color}`}>
                                                    <Droplets className="w-6 h-6" />
                                                </div>
                                                <span className="font-bold text-lg">{lvl.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <div className="flex justify-between items-center gap-2">
                                        {moods.map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setData({ ...data, mood: m.id as any })}
                                                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${data.mood === m.id ? 'bg-primary-500 text-white scale-110 shadow-lg' : 'hover:bg-primary-50'}`}
                                            >
                                                <span className="text-3xl">{m.emoji}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${data.mood === m.id ? 'text-white' : 'text-foreground/40'}`}>{m.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-primary-50 p-6 rounded-4xl space-y-4">
                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-primary-600">
                                            <span>Low Energy</span>
                                            <span>Energy Level</span>
                                            <span>Full Power</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" max="10" 
                                            value={data.energy}
                                            onChange={(e) => setData({ ...data, energy: parseInt(e.target.value) })}
                                            className="w-full accent-primary-600"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-foreground/40">Back</button>
                                        <button onClick={() => setStep(3)} className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black transition-all hover:scale-105">Next</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <div className="flex flex-wrap gap-3">
                                        {commonSymptoms.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => toggleSymptom(s)}
                                                className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 ${data.symptoms?.includes(s) ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-primary-500/10 text-foreground/60 hover:bg-primary-50'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Mood notes... (optional)"
                                        value={data.notes}
                                        onChange={(e) => setData({ ...data, notes: e.target.value })}
                                        className="w-full bg-primary-50 border border-primary-500/10 p-6 rounded-4xl min-h-[120px] focus:outline-hidden focus:ring-2 ring-primary-500/20"
                                    />
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(2)} className="flex-1 py-4 font-bold text-foreground/40">Back</button>
                                        <button onClick={handleSubmit} className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-500/30 transition-all hover:scale-105">Save Log</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
