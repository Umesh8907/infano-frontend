import { Journey } from '@/types/learning';
import { motion } from 'framer-motion';
import { Play, Star, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface JourneyCardProps {
    journey: Journey;
    index: number;
}

export default function JourneyCard({ journey, index }: JourneyCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            <div className="glass overflow-hidden rounded-[2.5rem] border-primary-500/10 hover:border-primary-500/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-primary-500/5 group">
                {/* Thumbnail Area */}
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={journey.thumbnailUrl || '/api/placeholder/400/300'}
                        alt={journey.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* XP Tag */}
                    <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold text-primary-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-primary-600" />
                        {journey.totalXP} XP
                    </div>

                    {/* Category Tag */}
                    {journey.category && (
                        <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-semibold text-foreground/60">
                            {journey.category}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                        {journey.title}
                    </h3>
                    <p className="text-foreground/40 text-sm line-clamp-2 mb-8 leading-relaxed">
                        {journey.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-foreground/30 text-xs font-bold uppercase tracking-wider">
                            <BookOpen className="w-4 h-4" />
                            <span>Available Now</span>
                        </div>

                        <Link href={`/dashboard/journeys/${journey.slug || journey._id}`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-colors"
                            >
                                <Play className="w-5 h-5 fill-white" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
