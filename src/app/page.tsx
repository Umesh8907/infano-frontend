import type { Metadata } from "next";
import Hero from "@/components/shared/Hero";

export const metadata: Metadata = {
  title: "Welcome to Infano | Where Imagination Meets Education",
  description: "Start your journey in the Infano learning garden. Gamified science, storytelling, and physical kits for modern students.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Hero />

      {/* Quick Info Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24 border-t border-primary-500/5">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-500 text-center mb-12">
          Discover the Infano Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Learn by Story",
              desc: "Immerse yourself in beautiful digital stories that teach core science concepts.",
              icon: "📖"
            },
            {
              title: "Earn Rewards",
              desc: "Complete quests to earn XP and unlock 100+ unique digital and physical badges.",
              icon: "🏆"
            },
            {
              title: "Physical Kits",
              desc: "Bridge the gap between digital and physical with our curated experiment kits.",
              icon: "🛠️"
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl glass hover:border-primary-500/20 transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-foreground/50 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
