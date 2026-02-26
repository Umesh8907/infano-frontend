import { motion } from "framer-motion";
import DailyCheckInCard from "@/features/dashboard/DailyCheckInCard";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <DailyCheckInCard />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Stats */}
                {[
                    { label: 'Total XP', value: '1,250', color: 'bg-primary-500' },
                    { label: 'Quests Done', value: '12', color: 'bg-accent-600' },
                    { label: 'Badges', value: '5', color: 'bg-primary-600' },
                ].map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border-primary-500/10 shadow-sm">
                        <div className="text-foreground/40 text-sm font-bold mb-1 uppercase tracking-wider">{stat.label}</div>
                        <div className={`text-4xl font-black ${stat.color === 'bg-primary-500' ? 'text-primary-600' : stat.color === 'bg-accent-600' ? 'text-accent-600' : 'text-primary-700'}`}>
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass p-8 rounded-4xl min-h-[400px] border-primary-500/5 flex items-center justify-center text-center">
                <div>
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">🌱</div>
                    <h2 className="text-2xl font-bold mb-2">Your Current Journey</h2>
                    <p className="text-foreground/40 max-w-sm">You haven't started any learning journeys yet. Let's find something exciting to learn!</p>
                    <button className="mt-8 px-8 py-3 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:scale-105 transition-all">
                        Browse Journeys
                    </button>
                </div>
            </div>
        </div>
    );
}
