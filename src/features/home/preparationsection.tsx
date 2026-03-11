"use client";

import Image from "next/image";
import { m } from "framer-motion";

export default function PreparationSection() {
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
        <section className="py-24 bg-[#FFFFFF] flex justify-center">

            <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative bg-[#412C5A] max-w-[1200px] w-full rounded-[32px] px-4 md:px-12 py-16 overflow-hidden mx-2 md:mx-6"
            >

                {/* Right Illustration */}
                <m.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="absolute right-12 bottom-0 hidden min-[925px]:block"
                >
                    <Image
                        src="/homeassets/girl.png"
                        alt="girl"
                        width={320}
                        height={420}
                        className="object-contain"
                    />
                </m.div>

                {/* Content */}
                <m.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-[720px] flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0 self-center"
                >

                    {/* Heading */}
                    <m.h2
                        variants={itemVariants}
                        className="text-[34px] font-semibold text-[#F0F0F0] leading-tight font-termes"
                    >
                        Most parents wait until something goes wrong
                    </m.h2>

                    <m.p
                        variants={itemVariants}
                        className="text-[#E5E5E5] mt-2 text-lg font-nunito self-center"
                    >
                        Infano.Care exists for before.
                    </m.p>

                    {/* Cards */}
                    <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 mt-10 w-full">

                        {/* Late Support */}
                        <m.div
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-[#6A5A7E] text-white p-6 rounded-xl w-full max-w-[320px] text-left font-nunito"
                        >
                            <h3 className="text-lg font-semibold mb-3">
                                When support comes late
                            </h3>

                            <ul className="space-y-2 text-sm text-[#E7E1ED]">
                                <li>• Confidence has already slipped.</li>
                                <li>• Questions turn into confusion.</li>
                                <li>• Silence has already done its damage</li>
                            </ul>
                        </m.div>

                        {/* Early Support */}
                        <m.div
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-[#F4EFF7] p-6 rounded-xl w-full max-w-[320px] border border-[#F28C8C] text-left font-nunito"
                        >
                            <h3 className="text-lg text-[#2B2B2B] font-semibold mb-3">
                                When support begins early
                            </h3>

                            <ul className="space-y-2 text-[#2B2B2B] font-nunito text-sm text-gray-600">
                                <li>• Confidence grows steadily.</li>
                                <li>• Questions become conversations.</li>
                                <li>• Girls grow up informed and secure.</li>
                            </ul>
                        </m.div>

                    </div>

                    {/* Quote */}
                    <m.div variants={itemVariants} className="self-center text-center">
                        <p className="text-[#E9D9F0] italic text-2xl mt-10 font-nunito">
                            "I wish something like this existed when I was her age."
                        </p>

                        <p className="text-[#E9D9F0] text-lg mt-1 font-nunito">
                            — Most Infano.Care Parents
                        </p>
                    </m.div>

                    {/* Button */}
                    <m.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 bg-[#F2CFCD] text-[#2B2B2B] px-6 py-3 rounded-full font-nunito self-center font-semibold"
                    >
                        Preparation is not pressure. It’s protection. →
                    </m.button>

                </m.div>

            </m.div>

        </section>
    );
}
