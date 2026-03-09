import { motion } from "framer-motion";
import DailyCheckInCard from "@/features/dashboard/DailyCheckInCard";
import JourneyProgressOverview from "@/features/dashboard/JourneyProgressOverview";

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

            <JourneyProgressOverview />
        </div>
    );
}
