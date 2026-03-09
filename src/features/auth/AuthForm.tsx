'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import StatusDialog, { DialogType } from '@/components/shared/StatusDialog';

export default function AuthForm() {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isPending, setIsPending] = useState(false);

    // Status Dialog state
    const [dialog, setDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: DialogType;
        shouldRedirect?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleDialogClose = () => {
        if (dialog.shouldRedirect) {
            router.push('/onboarding');
        }
        setDialog({ ...dialog, isOpen: false });
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            await api.post('/auth/request-otp', { phone });
            setStep('otp');
        } catch (err: any) {
            const isNotFound = err.response?.status === 404 || err.response?.data?.message?.toLowerCase().includes('not found');
            setDialog({
                isOpen: true,
                title: isNotFound ? 'New Here?' : 'Request Failed',
                message: err.response?.data?.message || 'Failed to send OTP. Please check your number.',
                type: isNotFound ? 'info' : 'error',
                shouldRedirect: isNotFound
            });
        } finally {
            setIsPending(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            const { data } = await api.post('/auth/verify-otp', { phone, otp });
            dispatch(setCredentials({ user: data.user, token: data.accessToken }));
            router.push('/dashboard');
        } catch (err: any) {
            setDialog({
                isOpen: true,
                title: 'Invalid Code',
                message: err.response?.data?.message || 'That code doesn\'t look right. Please try again.',
                type: 'error'
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <StatusDialog
                isOpen={dialog.isOpen}
                onClose={handleDialogClose}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                buttonText={dialog.shouldRedirect ? "Continue to Onboarding" : "Continue"}
            />

            <AnimatePresence mode="wait">
                {step === 'phone' ? (
                    <motion.div
                        key="phone-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="glass p-8 rounded-3xl border-primary-500/10 shadow-2xl"
                    >
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2 text-text-main">Welcome Back</h2>
                            <p className="text-text-muted">Enter your phone number to sign in or create an account.</p>
                        </div>

                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1 text-text-main">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim font-medium">+91</span>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="99999 99999"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white border border-primary-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none text-lg font-medium tracking-wider text-text-main"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending || phone.length < 10}
                                className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/20 hover:bg-primary-600 disabled:opacity-50 disabled:hover:scale-100 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Send Verification Code
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp-step"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass p-8 rounded-3xl border-primary-500/10 shadow-2xl"
                    >
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-accent-500/10 rounded-2xl flex items-center justify-center text-accent-600 mb-4">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2 text-text-main">Verify Code</h2>
                            <p className="text-text-muted">
                                We sent a 4-digit code to <span className="font-bold text-text-main">+91 {phone}</span>
                            </p>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1 text-text-main">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={4}
                                    placeholder="0000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-4 rounded-2xl bg-white border border-primary-100 focus:border-accent-600 focus:ring-4 focus:ring-accent-600/5 transition-all outline-none text-center text-3xl font-bold tracking-[0.5em] text-text-main"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending || otp.length < 4}
                                className="w-full py-4 bg-accent-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-accent-600/20 hover:bg-accent-700 disabled:opacity-50 disabled:hover:scale-100 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Verify & Continue
                                        <Sparkles className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('phone')}
                                className="w-full text-center text-sm font-semibold text-text-dim hover:text-primary-600 transition-colors"
                            >
                                Change Phone Number
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
