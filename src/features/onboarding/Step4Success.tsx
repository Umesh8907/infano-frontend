'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package, Heart } from 'lucide-react';

interface Step4SuccessProps {
    method: 'activate' | 'purchase';
}

export default function Step4Success({ method }: Step4SuccessProps) {
    return (
        <div className="max-w-4xl mx-auto onboarding-card overflow-hidden text-center p-16 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#f49b82]" />

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                className="w-24 h-24 bg-[#f49b82] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-[#f49b82]/30"
            >
                <CheckCircle2 className="w-12 h-12" />
            </motion.div>

            <div className="space-y-4 mb-12">
                <h2 className="text-4xl font-black text-[#4a3e3e]">
                    {method === 'purchase' ? 'Payment Successful!' : 'Kit Activated!'}
                    <br />
                    <span className="text-[#f49b82]">Welcome to Your Journey 🌸</span>
                </h2>
                <p className="text-foreground/50 text-lg max-w-lg mx-auto">
                    {method === 'purchase'
                        ? "You're all set! Your Care Kit is on its way, and your digital growth platform is ready for you to explore."
                        : "Your kit has been linked to your account. You've unlocked the full digital experience."
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="text-left space-y-4">
                    <div className="flex items-center gap-3 text-[#f49b82] font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        Order placed
                    </div>
                    <div className="flex items-center gap-3 text-[#f49b82] font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        Estimated delivery: 5-7 days
                    </div>
                    <div className="flex items-center gap-3 text-[#f49b82] font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        Account created successfully
                    </div>
                </div>

                <div className="bg-[#fff9f5] p-6 rounded-3xl border border-primary-100 text-left">
                    <h5 className="font-black text-xs uppercase tracking-widest text-[#f49b82] mb-4">Order Summary</h5>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-bold">Care Kit</span>
                            <span className="text-foreground/40">Included</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Shipping</span>
                            <span className="text-foreground/40">Included</span>
                        </div>
                        <hr className="border-primary-100" />
                        <div className="flex justify-between font-black text-primary-600">
                            <span>Order ID</span>
                            <span>INF12345</span>
                        </div>
                    </div>
                </div>
            </div>

            <motion.button
                onClick={() => window.location.href = '/dashboard'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-16 py-5 text-xl flex items-center gap-3 mx-auto shadow-2xl shadow-primary-500/20"
            >
                Start Your Digital Journey
                <ArrowRight className="w-6 h-6" />
            </motion.button>

            <div className="mt-12 flex items-center justify-center gap-2 text-foreground/40 text-sm font-medium">
                <Heart className="w-4 h-4 fill-[#f49b82] text-[#f49b82]" />
                Your journey is private, secure, and guided by experts.
            </div>
        </div>
    );
}
