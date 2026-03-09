'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { Bell, Search, User as UserIcon, Menu, LogOut, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { onboardingService } from '@/services/onboarding.service';

export default function Topbar() {
    const { user: authUser } = useAppSelector((state) => state.auth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { data: profile } = useQuery({
        queryKey: ['userProfile'],
        queryFn: onboardingService.getUserProfile,
        staleTime: 5 * 60 * 1000,
    });

    const user = profile || authUser;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <header className="h-20 glass mb-8 px-8 flex items-center justify-between sticky top-0 z-30 border-b border-primary-500/10">
            {/* Search Bar */}
            <div className="flex-1 max-w-md relative group hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search your records or journeys..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-white/50 border border-transparent focus:border-primary-500/20 focus:bg-white outline-none transition-all text-sm font-medium"
                />
            </div>

            {/* Mobile Menu Placeholder (Hidden on Desktop) */}
            <button className="md:hidden p-2.5 glass rounded-xl text-foreground/60">
                <Menu className="w-6 h-6" />
            </button>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2.5 glass rounded-xl text-foreground/40 hover:text-primary-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-surface" />
                </button>

                <div className="h-10 w-px bg-primary-500/10 mx-2 hidden sm:block" />

                <div className="relative" ref={dropdownRef}>
                    <motion.button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 pl-2 group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-text-main line-clamp-1 group-hover:text-primary-600 transition-colors">{user?.fullName || 'Guest'}</p>
                            <p className="text-[10px] font-bold text-primary-500 uppercase tracking-tighter">{user?.role || 'Student'}</p>
                        </div>

                        <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-primary-400 to-accent-400 p-[2px] group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-[14px] bg-surface flex items-center justify-center text-primary-600">
                                <UserIcon className="w-5 h-5" />
                            </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-foreground/20 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-56 glass rounded-2xl border border-primary-500/10 shadow-2xl p-2 z-50 overflow-hidden"
                            >
                                <Link
                                    href="/dashboard/account"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-500/5 transition-colors text-foreground/70 hover:text-primary-600 font-semibold text-sm"
                                >
                                    <SettingsIcon className="w-4 h-4" />
                                    Account
                                </Link>
                                <div className="h-px bg-primary-500/5 my-1 mx-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/5 transition-colors text-foreground/70 hover:text-red-500 font-semibold text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
