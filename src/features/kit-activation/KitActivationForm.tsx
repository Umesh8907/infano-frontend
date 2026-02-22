'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2, QrCode } from 'lucide-react';
import api from '@/services/api';

interface KitActivationFormProps {
    onBack: () => void;
}

export default function KitActivationForm({ onBack }: KitActivationFormProps) {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/kits/activate', { code });
            setStatus('success');
            // Redirect to dashboard after a short delay
            setTimeout(() => window.location.href = '/dashboard', 2000);
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.response?.data?.message || 'Invalid activation code');
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 rounded-[3.5rem] text-center max-w-md mx-auto border-accent-500/20"
            >
                <div className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-accent-500/40">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-black mb-4">Kit Activated!</h2>
                <p className="text-foreground/50 text-lg mb-8">Welcome to the garden, Explorer. Your adventure is ready.</p>
                <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-accent-600" />
                    <span className="font-bold tracking-widest uppercase text-xs text-foreground/40">Entering Dashboard...</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-12 rounded-[3.5rem] max-w-xl mx-auto border-primary-500/10 shadow-2xl relative overflow-hidden"
        >
            {/* Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <QrCode className="w-32 h-32" />
            </div>

            <button
                onClick={onBack}
                className="flex items-center gap-2 text-foreground/40 hover:text-primary-600 font-bold transition-colors mb-10 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Change Method
            </button>

            <div className="mb-10">
                <h2 className="text-4xl font-black mb-3">Activate Your Kit</h2>
                <p className="text-foreground/50">Enter the 10-digit code found on your physical Infano card.</p>
            </div>

            <form onSubmit={handleActivate} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest ml-1 text-foreground/40">Activation Code</label>
                    <input
                        type="text"
                        required
                        placeholder="INF-XXXX-XXXX"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="w-full px-6 py-5 rounded-2xl bg-white border border-primary-500/10 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none text-2xl font-bold tracking-widest text-center uppercase"
                    />
                    {status === 'error' && (
                        <p className="text-red-500 text-sm font-bold ml-1">{errorMessage}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading' || code.length < 8}
                    className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {status === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Unlock My Adventure'}
                </button>
            </form>

            <div className="mt-12 p-6 bg-primary-500/5 rounded-3xl border border-primary-500/10">
                <div className="flex gap-4">
                    <div className="text-2xl">💡</div>
                    <div>
                        <h5 className="font-bold text-sm mb-1">Where is my code?</h5>
                        <p className="text-xs text-foreground/40 leading-relaxed">Check the white envelope inside your physical kit. The code is printed on the "Parent Welcome" card.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
