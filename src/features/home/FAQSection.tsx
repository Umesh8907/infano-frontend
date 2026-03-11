"use client";

import { useState } from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { m, AnimatePresence } from "framer-motion";

type FAQ = {
    question: string;
    answer: string;
};

const faqData: FAQ[] = [
    {
        question: "Is this too early for my daughter?",
        answer: `Most parents ask this.

Infano.Care is designed to meet girls exactly where they are—not ahead of them.

Our content is stage-wise (10–13, 14–16, 17–18), emotionally aligned, and created with gynecologists and psychologists.

Preparation is not pressure. It’s protection.`,
    },
    {
        question: "Will this replace conversations at home?",
        answer:
            "No. Infano.Care is designed to support parents, not replace them. It helps start healthy conversations.",
    },
    {
        question: "How is the content created?",
        answer:
            "All our content is created with experts including gynecologists, psychologists, and educators.",
    },
    {
        question: "Is the platform safe for girls?",
        answer:
            "Yes. Safety and emotional well-being are central to everything we build.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" as const },
        },
    };

    return (
        <section className="py-24 bg-[#FFF8F8]">
            <div className="max-w-4xl mx-auto px-6">

                {/* Heading */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-[32px] sm:text-[42px] md:text-[48px] font-semibold font-termes text-[#2B2B2B] leading-tight mt-2">
                        Frequently Asked Questions
                    </h2>

                    <p className="text-[18px] md:text-[20px] text-[#2B2B2B] max-w-xl mx-auto font-nunito font-semibold">
                        Because clarity builds confidence.
                    </p>
                </m.div>

                {/* FAQ Items */}
                <m.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="space-y-6"
                >
                    {faqData.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <m.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -4, scale: 1.005 }}
                                transition={{ duration: 0.3, ease: "easeOut" as const }}
                                className={`rounded-2xl p-6 transition-colors duration-300 ${isOpen
                                    ? "bg-[#E8C7C3]"
                                    : "bg-white shadow-sm"
                                    }`}
                            >
                                {/* Question */}
                                <button
                                    onClick={() => toggle(index)}
                                    className="flex items-center justify-between w-full text-left"
                                >
                                    <h3 className="text-[20px] md:text-[22px] text-[#2B2B2B] font-nunito">
                                        {faq.question}
                                    </h3>

                                    <m.span
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-red-500"
                                    >
                                        {isOpen ? (
                                            <MinusCircleIcon className="h-6 w-6" />
                                        ) : (
                                            <PlusCircleIcon className="h-6 w-6" />
                                        )}
                                    </m.span>
                                </button>

                                {/* Answer */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <m.div
                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                            animate={{ height: "auto", opacity: 1, marginTop: 20 }}
                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" as const }}
                                            className="overflow-hidden"
                                        >
                                            <div className="text-[16px] md:text-[18px] text-[#2B2B2B] font-nunito leading-relaxed whitespace-pre-line border-t border-[#D6A9A5] pt-4">
                                                {faq.answer}
                                            </div>
                                        </m.div>
                                    )}
                                </AnimatePresence>
                            </m.div>
                        );
                    })}
                </m.div>

                {/* Bottom Text */}
                <m.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center text-[20px] md:text-[22px] mt-14 text-[#000000]"
                >
                    If you’re still wondering, that’s okay.{" "}
                    <span className="underline cursor-pointer">
                        We’re here to help.
                    </span>
                </m.div>
            </div>
        </section>
    );
}
