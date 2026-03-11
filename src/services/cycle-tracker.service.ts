import api from './api';

export interface CycleStatus {
    status: 'NO_DATA' | 'ACTIVE';
    cycleDay: number;
    phase: string;
    nextPeriodDate?: string;
    predictionConfidence: number;
    reason?: string;
    tips: string[];
    message?: string;
}

export interface DailyLogData {
    date?: string;
    flowLevel?: 'none' | 'light' | 'medium' | 'heavy';
    mood?: 'happy' | 'calm' | 'neutral' | 'low' | 'stressed';
    energy?: number;
    symptoms?: string[];
    notes?: string;
    lifestyleTriggers?: string[];
}

export const cycleTrackerService = {
    getDashboard: async (): Promise<CycleStatus> => {
        const response = await api.get('/cycle-tracker/dashboard');
        return response.data;
    },

    logDailyData: async (data: DailyLogData) => {
        const response = await api.post('/cycle-tracker/log', data);
        return response.data;
    },

    getInsights: async () => {
        const response = await api.get('/cycle-tracker/insights');
        return response.data;
    },

    getCalendar: async () => {
        const response = await api.get('/cycle-tracker/calendar');
        return response.data;
    },

    getEducation: async () => {
        const response = await api.get('/cycle-tracker/education');
        return response.data;
    },

    updateCycle: async (cycleId: string, updateData: any) => {
        const response = await api.patch(`/cycle-tracker/cycle/${cycleId}`, updateData);
        return response.data;
    }
};
