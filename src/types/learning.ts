export enum QuestItemType {
    STORY_HOOK = 'story_hook',
    KNOWLEDGE_CHECK = 'knowledge_check',
    VIDEO_ACTIVITY = 'video_activity',
    LEARNING_CARDS = 'learning_cards',
    MINI_CHALLENGE = 'mini_challenge',
    INSIGHT = 'insight',
}

export interface QuestItem {
    id: string;
    _id?: string;
    title: string;
    type: QuestItemType;
    content: any;
    order: number;
    xpReward: number;
}

export interface Quest {
    id: string;
    _id: string;
    slug: string;
    title: string;
    description: string;
    order: number;
    xpReward: number;
    isActive: boolean;
    journeyId: string;
    items: QuestItem[];
}

export interface Journey {
    id: string;
    _id: string;
    slug: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    totalXP: number;
    isActive: boolean;
    category?: string;
}

export interface UserProgress {
    userId: string;
    journeyId: string;
    totalXp: number;
    isJourneyCompleted: boolean;
    questProgress: {
        questId: string;
        lastViewedItemId?: string;
        lastViewedAt?: string;
        isCompleted: boolean;
        completedItems: {
            itemId: string;
            isCompleted: boolean;
            completedAt: string;
            submissionData?: any;
        }[];
    }[];
}

export interface JourneyProgressOverview {
    journeyId: string;
    journeySlug: string;
    journeyTitle: string;
    journeyDescription: string;
    thumbnailUrl?: string;
    totalQuests: number;
    completedQuests: number;
    totalXp: number;
    isJourneyCompleted: boolean;
}
