'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, XCircle, Info, ArrowRight } from 'lucide-react';

export type DialogType = 'error' | 'success' | 'info' | 'warning';

interface StatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: DialogType;
    buttonText?: string;
}

const icons = {
    error: <XCircle className="w-10 h-10 text-red-500" />,
    success: <CheckCircle2 className="w-10 h-10 text-green-500" />,
    info: <Info className="w-10 h-10 text-primary-500" />,
    warning: <AlertCircle className="w-10 h-10 text-amber-500" />,
};

const bgColors = {
    error: 'bg-red-50',
    success: 'bg-green-50',
    info: 'bg-primary-50',
    warning: 'bg-amber-50',
};

const pulseColors = {
    error: 'bg-red-500/20',
    success: 'bg-green-500/20',
    info: 'bg-primary-500/20',
    warning: 'bg-amber-500/20',
};

export default function StatusDialog({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    buttonText = 'Continue'
}: StatusDialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary-900/60 backdrop-blur-md"
                    />

                    {/* Dialog Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className={`p-10 text-center space-y-8`}>
                            {/* Icon with animated pulse */}
                            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`absolute inset-0 rounded-full ${pulseColors[type]}`}
                                />
                                <div className={`relative z-10 w-20 h-20 rounded-full ${bgColors[type]} flex items-center justify-center`}>
                                    {icons[type]}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-text-main tracking-tight">{title}</h3>
                                <p className="text-text-muted font-medium leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-4 group"
                            >
                                {buttonText}
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Visual accent bar */}
                        <div className={`h-2 w-full bg-gradient-to-r ${type === 'error' ? 'from-red-400 to-red-600' :
                                type === 'success' ? 'from-green-400 to-green-600' :
                                    type === 'warning' ? 'from-amber-400 to-amber-600' :
                                        'from-primary-400 to-primary-600'
                            }`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
