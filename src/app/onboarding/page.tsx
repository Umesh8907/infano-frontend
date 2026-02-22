import type { Metadata } from "next";
import OnboardingContainer from "@/features/onboarding/OnboardingContainer";

export const metadata: Metadata = {
    title: "Start Your Journey | Onboarding",
    description: "Set up your Infano account, activate your kit, and join the modern learning garden.",
};

export default function OnboardingPage() {
    return (
        <main className="onboarding-flow-container min-h-screen flex items-center justify-center py-24 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary-100/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />

            <OnboardingContainer />
        </main>
    );
}
