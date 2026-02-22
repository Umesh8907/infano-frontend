'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Package, ShieldCheck, Zap, CreditCard } from 'lucide-react';
import api from '@/services/api';
import { loadRazorpayScript } from '@/utils/razorpay';
import { useAppSelector } from '@/store';

interface Kit {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

const mockKit: Kit = {
    id: 'seedling-01',
    name: 'Seedling Discovery Kit',
    description: 'Perfect for ages 5-8. Includes 5 hands-on experiments, a Storybook, and digital access to all "Plant Life" journeys.',
    price: 1999, // in INR
    image: '/api/placeholder/400/300',
};

interface KitPurchaseFormProps {
    onBack: () => void;
}

export default function KitPurchaseForm({ onBack }: KitPurchaseFormProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAppSelector((state) => state.auth);

    const handlePurchase = async () => {
        setIsProcessing(true);
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setIsProcessing(false);
            return;
        }

        try {
            // 1. Create Order in Backend
            const { data: order } = await api.post('/orders/purchase', {
                kitId: mockKit.id,
            });

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Should be in env
                amount: order.amount,
                currency: order.currency,
                name: 'Infano Learning',
                description: `Purchase of ${mockKit.name}`,
                image: '/logo.png',
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify Payment in Backend
                    try {
                        await api.post('/orders/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        // Success! Refresh user state or redirect
                        alert('Payment Successful! Your journey begins now.');
                        window.location.href = '/dashboard';
                    } catch (err) {
                        alert('Verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user?.fullName || '',
                    contact: user?.phone || '',
                },
                theme: {
                    color: '#6366f1', // Primary color
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to initiate purchase');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
        >
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-foreground/40 hover:text-primary-600 font-bold transition-colors mb-10 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Options
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Visual Preview */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary-100/50 rounded-[4rem] blur-2xl z-0" />
                    <div className="relative z-10 glass rounded-[3.5rem] overflow-hidden border-primary-500/10 shadow-2xl">
                        <img src={mockKit.image} alt={mockKit.name} className="w-full h-80 object-cover" />
                        <div className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="px-4 py-1 bg-primary-500/10 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest">Featured Kit</span>
                                <div className="flex items-center gap-1 text-accent-600">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-xs font-bold">Safe & Eco-friendly</span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black">{mockKit.name}</h2>
                            <p className="text-foreground/50 text-sm leading-relaxed">{mockKit.description}</p>
                        </div>
                    </div>
                </div>

                {/* Pricing & Checkout */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="text-foreground/40 font-bold tracking-widest uppercase text-xs">Final Price</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-primary-600">₹{mockKit.price}</span>
                            <span className="text-foreground/20 line-through text-xl font-bold">₹2,499</span>
                        </div>
                        <p className="text-accent-600 text-xs font-bold">Save 20% + Free Shipping included! 🚚</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 glass rounded-2xl border-primary-500/5 hover:border-primary-500/20 transition-all">
                            <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-600">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div className="text-xs font-semibold">Instant dashboard unlock after payment</div>
                        </div>
                        <div className="flex items-center gap-4 p-4 glass rounded-2xl border-primary-500/5 hover:border-primary-500/20 transition-all">
                            <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center text-accent-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <div className="text-xs font-semibold">Physical box delivered in 3-5 working days</div>
                        </div>
                    </div>

                    <button
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className="w-full py-5 bg-primary-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-primary-500/30 hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                    >
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                Complete Secure Payment
                                <CreditCard className="w-6 h-6" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-40">
                        <img src="/api/placeholder/60/20" alt="UPI" />
                        <img src="/api/placeholder/60/20" alt="Visa" />
                        <img src="/api/placeholder/60/20" alt="Mastercard" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
