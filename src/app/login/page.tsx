import type { Metadata } from "next";
import AuthForm from "@/features/auth/AuthForm";
import { motion } from "framer-motion";

export const metadata: Metadata = {
    title: "Login | Secure Access to Your Garden",
    description: "Sign in to your Infano account to continue your learning journey and track your progress.",
};

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden px-4">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary-100/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent-500/20 rounded-full blur-[120px]" />

            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight gradient-text mb-2">INFANO</h1>
                    <p className="text-foreground/40 font-medium tracking-widest uppercase text-xs">Modern Learning Garden</p>
                </div>

                <AuthForm />

                <p className="mt-8 text-sm text-foreground/40 max-w-xs text-center leading-relaxed">
                    By continuing, you agree to our <span className="underline hover:text-primary-600 cursor-pointer">Terms of Service</span> and <span className="underline hover:text-primary-600 cursor-pointer">Privacy Policy</span>.
                </p>
            </div>
        </main>
    );
}
