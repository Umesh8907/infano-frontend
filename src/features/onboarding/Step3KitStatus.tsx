'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Package, Lock, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { loadRazorpayScript } from '@/utils/razorpay';
import api from '@/services/api';
import { useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import StatusDialog, { DialogType } from '@/components/shared/StatusDialog';

interface Step3KitStatusProps {
    onContinue: (method: 'activate' | 'purchase') => void;
}

export default function Step3KitStatus({ onContinue }: Step3KitStatusProps) {
    const [method, setMethod] = useState<'activate' | 'purchase'>('activate');
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const router = useRouter();

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

    // Form states
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        address: '',
        email: user?.email || '',
        activationCode: '',
    });

    const handleDialogClose = () => {
        if (dialog.shouldRedirect) {
            router.push('/login');
        }
        setDialog({ ...dialog, isOpen: false });
    };

    const handlePurchase = async () => {
        if (!formData.address) {
            setDialog({
                isOpen: true,
                title: 'Address Required',
                message: 'Please provide a shipping address so we can send your kit!',
                type: 'warning'
            });
            return;
        }

        setIsProcessing(true);
        const res = await loadRazorpayScript();

        if (!res) {
            setDialog({
                isOpen: true,
                title: 'System Error',
                message: 'Razorpay SDK failed to load. Please check your internet connection and try again.',
                type: 'error'
            });
            setIsProcessing(false);
            return;
        }

        try {
            const { data } = await api.post('/orders/purchase', {
                ...formData,
                kitId: 'seedling-01', // Standard kit ID
            });

            const { order, razorpayKeyId } = data;

            const options = {
                key: razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: 'Infano',
                description: 'Kit Purchase',
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        await api.post('/orders/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        onContinue('purchase');
                    } catch (err) {
                        setDialog({
                            isOpen: true,
                            title: 'Verification Failed',
                            message: 'We couldn\'t verify your payment. If the amount was debited, please contact support.',
                            type: 'error'
                        });
                    }
                },
                prefill: {
                    name: formData.fullName,
                    contact: formData.phone,
                    email: formData.email,
                },
                theme: { color: '#f49b82' },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            const isConflict = err.response?.status === 409;
            setDialog({
                isOpen: true,
                title: isConflict ? 'Account Exists' : 'Purchase Failed',
                message: err.response?.data?.message || 'Failed to initiate purchase. Please try again later.',
                type: isConflict ? 'info' : 'error',
                shouldRedirect: isConflict
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleActivate = async () => {
        if (!formData.activationCode) {
            setDialog({
                isOpen: true,
                title: 'Code Required',
                message: 'Please enter your kit activation code to proceed.',
                type: 'warning'
            });
            return;
        }

        setIsProcessing(true);
        try {
            await api.post('/kits/activate', {
                code: formData.activationCode,
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
            });
            onContinue('activate');
        } catch (err: any) {
            const isConflict = err.response?.status === 409;
            setDialog({
                isOpen: true,
                title: isConflict ? 'Already Active' : 'Activation Failed',
                message: err.response?.data?.message || 'Invalid activation code. Please double-check it.',
                type: isConflict ? 'info' : 'error',
                shouldRedirect: isConflict
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-12">
            <StatusDialog
                isOpen={dialog.isOpen}
                onClose={handleDialogClose}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                buttonText={dialog.shouldRedirect ? "Go to Login" : "Continue"}
            />

            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-[#4a3e3e]">Kit Status</h2>
                <p className="text-text-dim font-medium">Let's set up your journey—tell us where you are starting from.</p>
            </div>

            <div className="max-w-4xl mx-auto onboarding-card overflow-hidden">
                {/* Toggle Grid */}
                <div className="grid grid-cols-2">
                    <button
                        onClick={() => setMethod('activate')}
                        className={`p-8 text-left transition-all flex items-center gap-4 ${method === 'activate' ? 'bg-[#fff9f5] border-b-2 border-primary-500' : 'bg-white text-foreground/30'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === 'activate' ? 'bg-primary-500 text-white' : 'bg-primary-100/50'}`}>
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold">I already have a Kit</h4>
                            <p className="text-xs">Activate your digital journey</p>
                        </div>
                    </button>
                    <button
                        onClick={() => setMethod('purchase')}
                        className={`p-8 text-left transition-all flex items-center gap-4 ${method === 'purchase' ? 'bg-[#fff9f5] border-b-2 border-primary-100' : 'bg-white text-foreground/30'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === 'purchase' ? 'bg-[#f49b82] text-white' : 'bg-primary-100/50'}`}>
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#f49b82]">I want to purchase a Kit</h4>
                            <p className="text-xs">Get the complete physical kit</p>
                        </div>
                    </button>
                </div>

                <div className="p-12">
                    {method === 'activate' ? (
                        <div className="space-y-8 max-w-xl mx-auto">
                            <div className="space-y-4">
                                <h4 className="text-xl font-bold text-text-main">Enter your kit activation code</h4>
                                <input
                                    type="text"
                                    placeholder="XXXX-XXXX"
                                    value={formData.activationCode}
                                    onChange={(e) => setFormData({ ...formData, activationCode: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-primary-100 outline-none focus:border-primary-500 text-2xl font-black tracking-widest uppercase text-center text-text-main"
                                />
                                <p className="text-xs text-text-dim text-center">You'll find this inside your kit or by scanning the QR code.</p>
                            </div>

                            <div className="space-y-4 text-text-main">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-primary-100"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-primary-100"
                                />
                                <input
                                    type="text"
                                    placeholder="Email address (optional)"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-primary-100"
                                />
                            </div>

                            <button
                                onClick={handleActivate}
                                disabled={isProcessing}
                                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Activate My Journey'}
                            </button>

                            <div className="flex items-center justify-center gap-6 pt-4 text-[10px] font-bold text-text-dim uppercase tracking-wider">
                                <div className="flex items-center gap-1"><Lock className="w-3 h-3" /> Private & Secure</div>
                                <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Health Expert Approved</div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[#fff9f5]/50 p-10 rounded-[2.5rem]">
                                <div className="w-full aspect-square bg-white rounded-3xl shadow-sm flex items-center justify-center text-8xl border border-primary-100/50">📦</div>
                                <div className="space-y-4">
                                    <h4 className="text-2xl font-black text-text-main">The Infano Care Kit</h4>
                                    <ul className="text-sm space-y-2 text-text-muted">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-500" /> Awkward Age Guidebook</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-500" /> Reusable Pads & Reflection Journal</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-500" /> Gigi Mascot Keychain</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-500" /> Digital Platform Access</li>
                                    </ul>
                                    <div className="pt-6 border-t border-primary-100/50 flex items-baseline gap-4">
                                        <span className="text-4xl font-black text-primary-600">₹1,999</span>
                                        <div className="text-xs text-text-dim leading-tight">
                                            <p className="font-bold">Free Shipping</p>
                                            <p>Delivered in 5-7 days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 max-w-2xl mx-auto pt-4 text-text-main">
                                <h4 className="font-bold text-lg">Delivery Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-4 rounded-xl border border-primary-100" />
                                    <input type="text" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 rounded-xl border border-primary-100" />
                                </div>
                                <textarea
                                    placeholder="Shipping Address"
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-primary-100 resize-none"
                                />
                                <input type="text" placeholder="Email (Optional)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 rounded-xl border border-primary-100" />
                            </div>

                            <div className="max-w-xl mx-auto space-y-6">
                                <button
                                    onClick={handlePurchase}
                                    disabled={isProcessing}
                                    className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-4"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            Proceed to Secure Payment
                                            <CreditCard className="w-6 h-6" />
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-4 grayscale opacity-40">
                                    <img src="/api/placeholder/40/20" alt="UPI" />
                                    <img src="/api/placeholder/40/20" alt="Visa" />
                                    <img src="/api/placeholder/40/20" alt="Mastercard" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
