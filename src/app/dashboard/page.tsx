'use client';

import { useState, useEffect } from "react";
import DailyCheckInCard from "@/features/dashboard/DailyCheckInCard";
import CycleStatusCard from "@/features/dashboard/CycleStatusCard";
import JourneyProgressOverview from "@/features/dashboard/JourneyProgressOverview";
import InsightCard from "@/features/dashboard/InsightCard";
import { cycleTrackerService } from "@/services/cycle-tracker.service";

export default function DashboardPage() {
    const [insights, setInsights] = useState<any[]>([]);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const data = await cycleTrackerService.getInsights();
            setInsights(data);
        } catch (error) {
            console.error("Failed to fetch insights:", error);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Main Tracker & Daily Action Stacked */}
            <div className="flex flex-col gap-8 items-stretch">
                <DailyCheckInCard onSuccess={fetchInsights} />
                <CycleStatusCard />
            </div>

            {/* AI Insights Section */}
            {insights.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-8 bg-primary-500 rounded-full" />
                        <h2 className="text-2xl font-black text-foreground">Your Personalized Insights</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {insights.map((insight, i) => (
                            <InsightCard 
                                key={insight._id || i}
                                title={insight.title}
                                summary={insight.summary}
                                advice={insight.advice}
                                type={insight.type}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Sub Stats & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <JourneyProgressOverview />
                </div>
                <div className="space-y-6">
                    {[
                        { label: 'Total XP', value: '1,250', color: 'text-primary-600', icon: '✨' },
                        { label: 'Streak', value: '7 Days', color: 'text-accent-600', icon: '🔥' },
                    ].map((stat, i) => (
                        <div key={i} className="glass p-8 rounded-4xl border-primary-500/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{stat.label}</span>
                                <span className="text-xl">{stat.icon}</span>
                            </div>
                            <div className={`text-4xl font-black ${stat.color}`}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

