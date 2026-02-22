'use client';

import { useQuery } from '@tanstack/react-query';
import { learningService } from '@/services/learning.service';
import { useParams } from 'next/navigation';
import QuestPlayer from '@/features/learning/QuestPlayer';
import { Loader2 } from 'lucide-react';

export default function QuestPlayerPage() {
    const params = useParams();
    const questId = params.id as string;

    const { data: quest, isLoading } = useQuery({
        queryKey: ['quest', questId],
        queryFn: () => learningService.getQuestById(questId),
        enabled: !!questId,
    });

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-surface flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto" />
                    <p className="font-bold tracking-widest uppercase text-xs text-foreground/40">Preparing Adventure...</p>
                </div>
            </div>
        );
    }

    if (!quest) return <div>Quest not found</div>;

    return <QuestPlayer quest={quest} />;
}
