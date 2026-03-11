'use client';

import { LayoutDashboard, BookOpen, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Topbar from '@/components/dashboard/Topbar';
import { useState, useEffect } from 'react';
import { onboardingService } from '@/services/onboarding.service';
import OnboardingModal from '@/features/onboarding/OnboardingModal';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [modalMode, setModalMode] = useState<'onboarding' | 'check-in'>('onboarding');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const user = await onboardingService.getUserProfile();
                if (!user.isOnboarded) {
                    setModalMode('onboarding');
                    setShowOnboarding(true);
                } else {
                    const todayCheckIn = await onboardingService.getTodayCheckIn();
                    if (!todayCheckIn) {
                        setModalMode('check-in');
                        setShowOnboarding(true);
                    }
                }
            } catch (error) {
                console.error('Failed to check status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();
    }, []);

    const navItems = [
        { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Cycle Tracker', icon: Sparkles, href: '/dashboard/cycle-tracker' },
        { name: 'Journeys', icon: BookOpen, href: '/dashboard/journeys' },
        { name: 'Achievements', icon: Trophy, href: '/dashboard/achievements' },
    ];

    return (
        <div className="min-h-screen bg-surface flex">
            {/* Sidebar */}
            <aside className="w-72 glass border-r border-primary-500/10 flex flex-col p-6 sticky top-0 h-screen shrink-0">
                <div className="mb-12">
                    <h2 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">INFANO</h2>
                    <p className="text-[10px] text-foreground/40 font-bold tracking-widest uppercase">Student Hub</p>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary-500/5 transition-all text-foreground/60 hover:text-primary-600"
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">{item.name}</span>
                        </Link>
                    ))}
                </nav>

            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar />
                <main className="flex-1 p-8 pt-0 overflow-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>

            {showOnboarding && (
                <OnboardingModal
                    mode={modalMode}
                    onComplete={() => setShowOnboarding(false)}
                />
            )}
        </div>
    );
}
