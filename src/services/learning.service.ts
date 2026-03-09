import api from './api';
import { Journey, Quest, UserProgress, JourneyProgressOverview } from '@/types/learning';

export const learningService = {
    getJourneys: async (): Promise<Journey[]> => {
        const { data } = await api.get('/journeys');
        return data;
    },

    getJourneyById: async (id: string): Promise<Journey> => {
        const { data } = await api.get(`/journeys/${id}`);
        return data;
    },

    getQuestsByJourney: async (journeyId: string): Promise<Quest[]> => {
        const { data } = await api.get(`/quests/journey/${journeyId}`);
        return data;
    },

    getQuestById: async (id: string): Promise<Quest> => {
        const { data } = await api.get(`/quests/${id}`);
        return data;
    },

    getProgress: async (journeyId: string): Promise<UserProgress> => {
        const { data } = await api.get(`/progress/${journeyId}`);
        return data;
    },

    getLatestProgressOverview: async (): Promise<JourneyProgressOverview | null> => {
        const { data } = await api.get('/progress');
        return data;
    },

    completeItem: async (journeyId: string, questId: string, itemId: string) => {
        const { data } = await api.post(`/progress/${journeyId}/quests/${questId}/items/${itemId}/complete`);
        return data;
    },

    setLastViewedItem: async (journeyId: string, questId: string, itemId: string) => {
        const { data } = await api.post(`/progress/${journeyId}/quests/${questId}/items/${itemId}/last-viewed`);
        return data;
    },
};
