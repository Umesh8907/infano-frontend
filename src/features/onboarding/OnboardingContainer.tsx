'use client';

import { useState } from 'react';
import Stepper from './Stepper';
import Step1Introduction from './Step1Introduction';
import Step2Persona from './Step2Persona';
import KitActivationForm from '../kit-activation/KitActivationForm'; // We'll adapt this later
import Step3KitStatus from './Step3KitStatus';
import Step4Success from './Step4Success';
import { AnimatePresence, motion } from 'framer-motion';

export default function OnboardingContainer() {
    const [step, setStep] = useState(1);
    const [persona, setPersona] = useState<'parent' | 'student' | null>(null);
    const [method, setMethod] = useState<'activate' | 'purchase'>('activate');
    const [summaryData, setSummaryData] = useState<any>(null);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(1, prev - 1));

    const handlePersonaSelect = (p: 'parent' | 'student') => {
        setPersona(p);
        nextStep();
    };

    const handleStatusComplete = (m: 'activate' | 'purchase', data?: any) => {
        setMethod(m);
        setSummaryData(data);
        nextStep();
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
            <Stepper currentStep={step} totalSteps={4} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    {step === 1 && <Step1Introduction onContinue={nextStep} />}
                    {step === 2 && <Step2Persona onContinue={handlePersonaSelect} />}
                    {step === 3 && <Step3KitStatus onContinue={handleStatusComplete} />}
                    {step === 4 && <Step4Success method={method} summaryData={summaryData} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
