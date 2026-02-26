import api from './api';

export const onboardingService = {
    completeOnboarding: async (interests: string[]) => {
        const { data } = await api.patch('/users/me/onboarding', { interests });
        return data;
    },

    logMood: async (mood: string, note?: string) => {
        const { data } = await api.post('/check-in/mood', { mood, note });
        return data;
    },

    getTodayCheckIn: async () => {
        try {
            const { data } = await api.get('/check-in/today');
            return data;
        } catch (error) {
            return null;
        }
    },

    getUserProfile: async () => {
        const { data } = await api.get('/users/me');
        return data;
    }
};
