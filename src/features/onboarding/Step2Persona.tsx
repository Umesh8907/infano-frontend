'use client';

import { motion } from 'framer-motion';
import { User, Users, ArrowRight } from 'lucide-react';

interface Step2PersonaProps {
    onContinue: (persona: 'parent' | 'student') => void;
}

export default function Step2Persona({ onContinue }: Step2PersonaProps) {
    return (
        <div className="text-center space-y-12">
            <div className="space-y-4">
                <h2 className="text-4xl font-black text-[#4a3e3e]">Who Is This For?</h2>
                <p className="text-text-dim font-medium">Help us personalize the experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <motion.div
                    whileHover={{ y: -10 }}
                    onClick={() => onContinue('parent')}
                    className="onboarding-card p-12 cursor-pointer group hover:border-[#f49b82] transition-all"
                >
                    <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-500 mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <Users className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">I am a parent/caregiver</h3>
                    <p className="text-text-muted text-sm leading-relaxed">Supporting my daughter's growth journey</p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -10 }}
                    onClick={() => onContinue('student')}
                    className="onboarding-card p-12 cursor-pointer group hover:border-[#f49b82] transition-all"
                >
                    <div className="w-24 h-24 bg-[#fee2d5]/30 rounded-3xl flex items-center justify-center text-[#f49b82] mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <User className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">I am a teen/young adult</h3>
                    <p className="text-text-muted text-sm leading-relaxed">Exploring my personal growth journey</p>
                </motion.div>
            </div>

            <div className="max-w-xl mx-auto pt-12">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-text-dim mb-8 flex items-center justify-center gap-4 before:h-px before:flex-1 before:bg-primary-100 after:h-px after:flex-1 after:bg-primary-100">
                    What You Get
                </div>
                <div className="grid grid-cols-2 gap-8 text-left">
                    <div className="space-y-3">
                        <h5 className="font-bold text-sm text-primary-600">Parents Get</h5>
                        <ul className="text-xs space-y-2 text-text-muted">
                            <li>• Guidance on sensitive topics</li>
                            <li>• Peace of mind</li>
                            <li>• Progress insights</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h5 className="font-bold text-sm text-primary-600">She Gets</h5>
                        <ul className="text-xs space-y-2 text-text-muted">
                            <li>• Safe learning platform</li>
                            <li>• Emotional support</li>
                            <li>• Expert-led community</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
