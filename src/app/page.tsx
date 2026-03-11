import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HomeHeroSection from "@/features/home/herosection";
import Card from "@/features/home/card";
import Navbar from "@/features/home/Navbar";

// Dynamic imports for below-the-fold sections
const ImpactSection = dynamic(() => import("@/features/home/impactsection"));
const JourneySection = dynamic(() => import("@/features/home/journeysection"));
const ExpertSection = dynamic(() => import("@/features/home/expertsection"));
const PreparationSection = dynamic(() => import("@/features/home/preparationsection"));
const FAQSection = dynamic(() => import("@/features/home/FAQSection"));

export const metadata: Metadata = {
  title: "Welcome to Infano | Where Imagination Meets Education",
  description: "Start your journey in the Infano learning garden. Gamified science, storytelling, and physical kits for modern students.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <HomeHeroSection />
      <Card />
      <ImpactSection />
      <JourneySection />
      <ExpertSection />
      <PreparationSection />
      <FAQSection />
    </main>
  );
}
