'use client';

import { useAppSelector } from '@/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import StatusDialog from './StatusDialog';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { token, user } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const pathname = usePathname();
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

    useEffect(() => {
        if (!token && pathname.startsWith('/dashboard')) {
            router.push('/login');
            return;
        }

        if (token && user && !user.isDashboardActive) {
            // If they are trying to access dashboard or root, show modal instead of silent redirect
            if (pathname.startsWith('/dashboard') || pathname === '/') {
                setShowEnrollmentModal(true);
            }
        }
    }, [token, user, pathname, router]);

    const handleContinueToOnboarding = () => {
        setShowEnrollmentModal(false);
        router.push('/onboarding');
    };

    // Prevent flashing content while redirecting to login
    if (!token && pathname.startsWith('/dashboard')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fffafa]">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <StatusDialog
                isOpen={showEnrollmentModal}
                onClose={handleContinueToOnboarding}
                title="Not Enrolled Yet"
                message="It looks like you haven't started your journey. Please onboard to unlock your learning garden."
                type="info"
                buttonText="Continue to Onboarding"
            />
            {children}
        </>
    );
}
