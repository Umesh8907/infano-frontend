import { LayoutDashboard, BookOpen, Trophy, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Journeys', icon: BookOpen, href: '/dashboard/journeys' },
        { name: 'Achievements', icon: Trophy, href: '/dashboard/achievements' },
        { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-surface flex">
            {/* Sidebar */}
            <aside className="w-72 glass border-r border-primary-500/10 flex flex-col p-6 sticky top-0 h-screen">
                <div className="mb-12">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">INFANO</h2>
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

                <button className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/5 transition-all text-foreground/40 hover:text-red-500 font-semibold">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
