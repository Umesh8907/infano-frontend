'use client';

import { motion } from 'framer-motion';

interface StepperProps {
    currentStep: number;
    totalSteps: number;
}

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
    return (
        <div className="flex items-center justify-center gap-4 mb-12">
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center">
                    <motion.div
                        initial={false}
                        animate={{
                            backgroundColor: i + 1 <= currentStep ? '#f49b82' : '#fee2d5',
                            scale: i + 1 === currentStep ? 1.2 : 1,
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${i + 1 <= currentStep ? 'text-white' : 'text-primary-600'
                            }`}
                    >
                        {i + 1}
                    </motion.div>
                    {i < totalSteps - 1 && (
                        <div className="w-12 h-[2px] bg-primary-100 mx-2">
                            <motion.div
                                initial={false}
                                animate={{ width: i + 1 < currentStep ? '100%' : '0%' }}
                                className="h-full bg-primary-500"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
