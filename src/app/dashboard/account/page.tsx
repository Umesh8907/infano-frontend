'use client';

import { useAppSelector } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { onboardingService } from '@/services/onboarding.service';
import { User, Mail, Phone, MapPin, Loader2, Sparkles, Building, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountPage() {
    const { user: authUser } = useAppSelector((state) => state.auth);

    // Fetch full profile to get interests, address, etc.
    const { data: profile, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: onboardingService.getUserProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const user = profile || authUser;

    if (isLoading && !authUser) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-text-muted">Unable to load profile information.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <header className="mb-10">
                <h1 className="text-4xl font-black text-text-main mb-2">My Account</h1>
                <p className="text-text-muted font-medium">Manage your personal information and preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-1 glass p-8 rounded-3xl border border-primary-500/10 flex flex-col items-center text-center space-y-6"
                >
                    <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-primary-400 to-accent-400 p-[3px] shadow-xl shadow-primary-500/20">
                        <div className="w-full h-full rounded-[20px] bg-surface flex items-center justify-center text-primary-600">
                            <User className="w-12 h-12" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-text-main">{user.fullName || 'User'}</h2>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-black uppercase tracking-widest">
                            {user.role === 'admin' ? <Briefcase className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                            {user.role || 'Student'}
                        </div>
                    </div>

                    <div className="w-full h-px bg-primary-500/10" />

                    <div className="w-full space-y-4 text-left">
                        <div className="flex border-b border-primary-500/5 pb-2 border-dashed">
                            <span className="text-text-dim text-xs font-bold uppercase tracking-widest w-24">Gender</span>
                            <span className="text-text-main text-sm font-semibold capitalize">{user.gender || 'Not specified'}</span>
                        </div>
                        <div className="flex border-b border-primary-500/5 pb-2 border-dashed">
                            <span className="text-text-dim text-xs font-bold uppercase tracking-widest w-24">Status</span>
                            <span className="text-green-500 text-sm font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Active
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Details Section */}
                <div className="md:col-span-2 space-y-8">
                    {/* Contact Information */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass p-8 rounded-3xl border border-primary-500/10"
                    >
                        <h3 className="text-lg font-black text-text-main mb-6 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-primary-500" />
                            Contact Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" /> Phone Number
                                </label>
                                <p className="text-text-main font-semibold p-4 rounded-xl bg-white/50 border border-transparent">
                                    {user.phone || 'Not provided'}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" /> Email Address
                                </label>
                                <p className="text-text-main font-semibold p-4 rounded-xl bg-white/50 border border-transparent truncate">
                                    {user.email || 'Not provided'}
                                </p>
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" /> Address
                                </label>
                                <p className="text-text-main font-semibold p-4 rounded-xl bg-white/50 border border-transparent">
                                    {user.address || 'No address provided'}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Interests & Preferences */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-8 rounded-3xl border border-accent-500/10"
                    >
                        <h3 className="text-lg font-black text-text-main mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-accent-500" />
                            Learning Interests
                        </h3>

                        <div className="flex flex-wrap gap-3">
                            {user.selectedInterests && user.selectedInterests.length > 0 ? (
                                user.selectedInterests.map((interest: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-4 py-2 rounded-xl bg-accent-50 text-accent-700 border border-accent-100 text-sm font-bold capitalize transition-all hover:scale-105 cursor-default"
                                    >
                                        {interest.replace('-', ' ')}
                                    </span>
                                ))
                            ) : (
                                <p className="text-text-muted text-sm italic p-4 rounded-xl bg-white/50 w-full text-center">
                                    You haven't selected any specific learning interests yet.
                                </p>
                            )}
                        </div>
                    </motion.section>

                    {/* Read-Only Notice */}
                    <p className="text-xs text-center text-text-dim/60 font-semibold px-4 pt-4">
                        To update your profile information, please contact your administrator.
                    </p>
                </div>
            </div>
        </div>
    );
}
