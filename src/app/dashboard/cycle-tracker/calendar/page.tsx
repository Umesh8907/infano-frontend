'use client';

import { useEffect, useState, useMemo } from 'react';
import { cycleTrackerService } from '@/services/cycle-tracker.service';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, Heart, Zap, Wind, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CycleCalendarPage() {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isEditMode, setIsEditMode] = useState(false);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveConfirm, setSaveConfirm] = useState<string | null>(null);
    const [dashboard, setDashboard] = useState<any>(null);

    const fetchData = async () => {
        try {
            const [calRes, dashRes] = await Promise.all([
                cycleTrackerService.getCalendar(),
                cycleTrackerService.getDashboard(),
            ]);
            setData(calRes);
            setDashboard(dashRes);
        } catch (err) {
            console.error('Failed to fetch calendar data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMarkDate = async (type: 'start' | 'end') => {
        if (!selectedDate || !data?.cycles?.length) return;
        const latestCycle = data.cycles[0];
        setSaving(true);
        try {
            await cycleTrackerService.updateCycle(latestCycle._id, {
                [type === 'start' ? 'startDate' : 'endDate']: selectedDate.toISOString(),
            });
            setSaveConfirm(type === 'start' ? 'Period start marked!' : 'Period end marked!');
            setTimeout(() => setSaveConfirm(null), 2500);
            await fetchData();
        } catch (err) {
            console.error('Failed to update cycle:', err);
        } finally {
            setSaving(false);
        }
    };

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, fullDate: null });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, fullDate: new Date(year, month, i) });
        }
        return days;
    }, [viewDate]);

    const getDayData = (date: Date | null) => {
        if (!date || !data) return null;
        const dateStr = date.toISOString().split('T')[0];
        
        // Find if this date falls within any cycle period or prediction
        const cycle = data.cycles.find((c: any) => {
            const start = new Date(c.startDate).toISOString().split('T')[0];
            const end = c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : null;
            const predicted = c.predictedNextDate ? new Date(c.predictedNextDate).toISOString().split('T')[0] : null;

            if (dateStr === start) return true;
            if (end && dateStr > start && dateStr <= end) return true;
            if (predicted && dateStr === predicted) return true;
            return false;
        });

        const log = data.logs.find((l: any) => new Date(l.date).toISOString().split('T')[0] === dateStr);
        
        return { cycle, log };
    };

    const getDayStatus = (date: Date | null) => {
        const dData = getDayData(date);
        if (!dData || !date) return null;
        
        const dateStr = date.toISOString().split('T')[0];
        const { cycle, log } = dData;

        if (cycle) {
            const start = new Date(cycle.startDate).toISOString().split('T')[0];
            const end = cycle.endDate ? new Date(cycle.endDate).toISOString().split('T')[0] : null;
            const predicted = cycle.predictedNextDate ? new Date(cycle.predictedNextDate).toISOString().split('T')[0] : null;

            if (dateStr === start) return 'period-start';
            if (end && dateStr > start && dateStr <= end) return 'period-active';
            if (predicted && dateStr === predicted) return 'period-predicted';
        }
        // Check ovulation window from dashboard
        if (dashboard?.ovulationWindowStart && dashboard?.ovulationWindowEnd) {
            const ovStart = new Date(dashboard.ovulationWindowStart).toISOString().split('T')[0];
            const ovEnd = new Date(dashboard.ovulationWindowEnd).toISOString().split('T')[0];
            if (dateStr >= ovStart && dateStr <= ovEnd) return 'ovulation';
        }
        if (log) return 'logged';
        return null;
    };

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

    const selectedDayData = getDayData(selectedDate);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/cycle-tracker" className="p-3 rounded-2xl glass hover:bg-primary-500/5 transition-all">
                        <ChevronLeft className="w-6 h-6 text-foreground/60" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-foreground">Cycle Calendar</h1>
                        <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">History & Predictions</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all ${isEditMode ? 'bg-primary-600 text-white shadow-lg' : 'glass text-foreground/60'}`}
                >
                    {isEditMode ? 'Finish Editing' : 'Edit Dates'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-2 glass rounded-4xl p-10 bg-white border-primary-500/10">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-foreground">
                            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} 
                                className="p-3 rounded-xl hover:bg-primary-50 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} 
                                className="p-3 rounded-xl hover:bg-primary-50 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-foreground/40">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((d, i) => {
                            const status = getDayStatus(d.fullDate);
                            const isSelected = selectedDate?.toDateString() === d.fullDate?.toDateString();
                            const isToday = d.fullDate?.toDateString() === new Date().toDateString();

                            return (
                                <button 
                                    key={i} 
                                    onClick={() => d.fullDate && setSelectedDate(d.fullDate)}
                                    className={`
                                        aspect-square rounded-2xl flex items-center justify-center text-sm font-bold relative transition-all
                                        ${!d.day ? 'opacity-0 cursor-default' : 'bg-primary-50/30 hover:bg-primary-100'}
                                        ${status === 'period-start' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 font-black scale-110 z-10' : ''}
                                        ${status === 'period-active' ? 'bg-primary-200 text-primary-900 font-black' : ''}
                                        ${status === 'period-predicted' ? 'border-2 border-dashed border-primary-400 text-primary-600 bg-white' : ''}
                                        ${status === 'ovulation' ? 'bg-teal-50 text-teal-700 border border-teal-300' : ''}
                                        ${isSelected && !status ? 'ring-4 ring-primary-500/20 bg-primary-100 border border-primary-500/10' : ''}
                                        ${isSelected ? 'ring-4 ring-primary-500 ring-offset-1' : ''}
                                        ${isToday && !status && !isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                                        ${isEditMode && d.day ? 'hover:scale-105 active:scale-95' : ''}
                                    `}
                                    disabled={!d.day}
                                >
                                    {d.day}
                                    {status === 'logged' && (
                                        <div className="absolute bottom-2 w-1.5 h-1.5 bg-accent-500 rounded-full" />
                                    )}
                                    {status === 'ovulation' && (
                                        <div className="absolute bottom-2 w-1.5 h-1.5 bg-teal-400 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-12 pt-8 border-t border-primary-500/5 flex flex-wrap gap-6 justify-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                            <div className="w-4 h-4 rounded-md bg-primary-500" /> Period Day
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                            <div className="w-4 h-4 rounded-md border-2 border-dashed border-primary-400" /> Prediction
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                            <div className="w-4 h-4 rounded-md bg-teal-100 border border-teal-300" /> Ovulation Window
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                            <div className="w-4 h-4 rounded-md bg-accent-500" /> Daily Log
                        </div>
                    </div>
                </div>

                {/* Day Details Panel */}
                <div className="space-y-6">
                    <div className="glass rounded-4xl p-8 bg-white border-primary-500/10 min-h-[400px]">
                        <h3 className="text-lg font-black text-foreground mb-6">Day Details</h3>
                        {selectedDate ? (
                            <div className="space-y-6">
                                <div className="pb-6 border-b border-primary-500/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">
                                        {selectedDate.toLocaleDateString('default', { weekday: 'long' })}
                                    </p>
                                    <p className="text-xl font-black text-foreground">
                                        {selectedDate.toLocaleDateString('default', { day: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                                
                                {selectedDayData?.log ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600">
                                                    <Heart className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-foreground/60">Mood</span>
                                            </div>
                                            <span className="text-sm font-black text-primary-600 capitalize">{selectedDayData.log.mood}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                                    <Zap className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-foreground/60">Energy</span>
                                            </div>
                                            <div className="flex gap-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < (selectedDayData.log.energy / 2) ? 'bg-accent-500' : 'bg-primary-100'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        {selectedDayData.log.notes && (
                                            <div className="p-4 bg-primary-50 rounded-2xl italic text-xs text-foreground/60 border border-primary-500/5">
                                                "{selectedDayData.log.notes}"
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-200 mb-4">
                                            <Zap className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm text-foreground/40 font-bold mb-6">No logs for this day</p>
                                        <button className="px-6 py-2 bg-primary-50 text-primary-600 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary-100 transition-all">
                                            + Add Log Entry
                                        </button>
                                    </div>
                                )}

                                {isEditMode && (
                                    <div className="mt-8 pt-8 border-t border-primary-500/10 space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">Period Management</p>
                                        {saveConfirm && (
                                            <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl text-primary-700 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {saveConfirm}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => handleMarkDate('start')}
                                                disabled={saving}
                                                className="py-3 px-4 bg-primary-500 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10 disabled:opacity-60"
                                            >
                                                {saving ? 'Saving...' : 'Mark Start'}
                                            </button>
                                            <button 
                                                onClick={() => handleMarkDate('end')}
                                                disabled={saving}
                                                className="py-3 px-4 bg-white border border-primary-500/20 text-primary-600 rounded-xl text-xs font-bold disabled:opacity-60"
                                            >
                                                {saving ? 'Saving...' : 'Mark End'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[200px] text-foreground/20 italic text-sm">
                                <CalendarIcon className="w-10 h-10 mb-2 opacity-50" />
                                Select a day to see details
                            </div>
                        )}
                    </div>
                    
                    {/* Informational Card */}
                    <div className="p-8 rounded-4xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
                        <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
                        <h4 className="font-black text-lg mb-2 relative z-10">Did you know?</h4>
                        <p className="text-xs text-white/80 leading-relaxed relative z-10">
                            Tracking consistently for 3 cycles improves AI accuracy by 40%. You're doing great on your journey to body awareness!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
