"use client";

import Image from "next/image";
import { m } from "framer-motion";

type CardData = {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    bg: string;
};

const cards: CardData[] = [
    {
        title: "At 10,\nquestions begin",
        subtitle: "questions she doesn't \nyet have the words for.",
        description:
            "Why does my body feel different?\nIs something wrong with me?\n\nWho can I ask?",
        image: "/homeassets/age10.png",
        bg: "bg-[#FFEFEE]",
    },
    {
        title: "At 13,\n her body changes.",
        subtitle:
            "Before the world explains it.\nBefore she understands it.",
        description:
            "For many girls, this is where\nconfusion turns into shame.",
        image: "/homeassets/age13.png",
        bg: "bg-[#F2CFCD7D]",
    },
    {
        title: "At 15,\nconfidence wavers\npressure peaks.",
        subtitle: "Her body is watched.\nHe emotions are questioned.",
        description:
            "Most girls stop asking questions\nbecause they don’t feel safe asking.",
        image: "/homeassets/age15.png",
        bg: "bg-[#F2CFCD]",
    },
];

export default function GrowingWithHer() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const },
        },
    };

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-r from-primary-100 via-white to-primary-100">

            {/* LEFT BG SHAPE */}
            <m.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 0.8, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="absolute left-0 bottom-0 pointer-events-none"
            >
                <Image
                    src="/homeassets/leftimage.png"
                    alt="bg-shape"
                    width={500}
                    height={500}
                    className="animate-pulse"
                />
            </m.div>

            {/* RIGHT BG SHAPE */}
            <m.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 0.8, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="absolute right-0 top-0 pointer-events-none"
            >
                <Image
                    src="/homeassets/rightimage.png"
                    alt="bg-shape"
                    width={500}
                    height={500}
                    className="animate-pulse"
                />
            </m.div>

            <div className="relative max-w-7xl mx-auto px-6">

                {/* Heading */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-14 max-w-xl text-center md:text-left mx-auto md:mx-0"
                >
                    <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-termes text-[#2B2B2B] leading-tight">
                        Growing With Her
                    </h2>

                    <p className="mt-3 text-[18px] sm:text-[22px] text-[#2B2B2B] font-nunito lg:whitespace-nowrap">
                        She is expected to know who she is without ever being taught how.
                    </p>
                </m.div>

                {/* Cards */}
                <m.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center"
                >

                    {cards.map((card, index) => (
                        <m.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.01 }}
                            transition={{ duration: 0.3, ease: "easeOut" as const }}
                            className={`${card.bg} rounded-[20px] shadow-[10px_4px_25.1px_0px_#B60A002E] px-6 pt-6 pb-5 flex flex-col w-full max-w-[360px] mx-auto`}
                        >

                            {/* Title */}
                            <h3 className="text-[30px] leading-[130%] font-termes text-[#2B2B2B] whitespace-pre-line">
                                {card.title}
                            </h3>

                            {/* Subtitle */}
                            {card.subtitle && (
                                <p className="text-[22px] text-[#2B2B2B] mt-2 font-nunito leading-[150%] whitespace-pre-line">
                                    {card.subtitle}
                                </p>
                            )}

                            {/* Image */}
                            <div className="mt-5">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    width={330}
                                    height={200}
                                    className="rounded-lg w-full object-cover"
                                />
                            </div>

                            {/* Description */}
                            <p className="text-[16px] text-[#2B2B2B] mt-4 leading-[150%] font-nunito whitespace-pre-line">
                                {card.description}
                            </p>

                        </m.div>
                    ))}
                </m.div>

                {/* Bottom Section */}
                <m.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between mt-20 gap-8 text-center md:text-left"
                >

                    <p className="text-[28px] sm:text-[36px] text-[#2B2B2B] leading-relaxed max-w-xl font-termes">
                        And the world still expects strength <br />
                        But no one prepared her for it.
                    </p>

                    <div className="flex flex-col items-center md:items-end gap-2">
                        <m.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-purple w-full sm:w-auto"
                        >
                            Start Her Journey →
                        </m.button>

                        <p className="text-[18px] text-[#2B2B2B] font-nunito">
                            Explore what support looks like at her age
                        </p>
                    </div>

                </m.div>
            </div>
        </section>
    );
}
