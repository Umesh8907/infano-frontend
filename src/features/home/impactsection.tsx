"use client";

import Image from "next/image";
import { FaUsers } from "react-icons/fa";
import { Check } from "lucide-react";
import { m } from "framer-motion";

export default function ImpactSection() {
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
    <section className="relative py-24 bg-[#F7EDE9] overflow-hidden">

      {/* Background Blob */}
      <m.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="absolute left-0 bottom-0 pointer-events-none"
      >
        <Image
          src="/homeassets/bgblob.png"
          alt="bg"
          width={2270}
          height={2270}
        />
      </m.div>

      {/* Star Decorations */}
      <m.div
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
        className="absolute md:right-28 right-10 top-35 opacity-80"
      >
        <Image
          src="/homeassets/stars.png"
          alt="stars"
          width={240}
          height={240}
        />
      </m.div>

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Heading */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >

          <p className="text-[20px] md:text-[22px] text-[#2B2B2B] font-nunito">
            Trusted by parents of girls aged 10–17
          </p>

          <h2 className="text-[32px] sm:text-[42px] md:text-[48px] font-semibold font-termes text-[#2B2B2B] leading-tight mt-2 sm:whitespace-pre-line lg:whitespace-nowrap">
            Millions of girls grow up navigating silence.
          </h2>

          <p className="mt-3 text-[#2B2B2B] font-nunito">
            Infano.Care exists so no girl has to grow up unprepared.<br />
            Every number below represents a girl who didn’t have to figure it out alone.
          </p>

        </m.div>

        {/* GRID */}
        <div className="relative grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT COLUMN */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col gap-6 md:z-0"
          >

            {/* Video Card */}
            <m.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="bg-white rounded-xl shadow-[2px_4px_18.6px_0px_#B60A002E] p-4"
            >

              <div className="relative">

                <Image
                  src="/homeassets/video-thumb.png"
                  alt="video"
                  width={500}
                  height={300}
                  className="rounded-lg w-full"
                />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <m.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-[#4B1F80] w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg cursor-pointer"
                  >
                    ▶
                  </m.div>
                </div>

              </div>

              <h3 className="mt-4 text-[34px] font-semibold text-[#2B2B2B] font-termes">
                Watch how girls find their voice
              </h3>

              <p className="text-[20px] text-[#2B2B2B] mt-1 font-nunito">
                Real stories of confidence, understanding, and support.
              </p>

            </m.div>

            {/* Text Card — overlaps stat cards on lg+ only */}
            <m.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="bg-white rounded-xl shadow-[2px_4px_18.6px_0px_#B60A002E] p-6 relative z-0 lg:w-[130%] lg:-mr-[30%]"
            >

              <h3 className="text-[24px] md:text-[28px] lg:text-[34px] font-semibold text-[#2B2B2B] mb-4 font-termes">
                Not everything that matters can be measured.
              </h3>

              <ul className="space-y-3 text-[#2B2B2B] font-nunito">

                {[
                  "A 13-year-old who asked her first question without fear.",
                  "A mother who didn't have to Google in panic.",
                  "A girl who learned that “no” is a full sentence.",
                ].map((text, idx) => (
                  <m.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2 text-[16px] md:text-[18px]"
                  >
                    <Check className="text-[#F37147] w-[24px] h-[20px] mt-1 flex-shrink-0" />
                    {text}
                  </m.li>
                ))}

              </ul>

            </m.div>

          </m.div>

          {/* RIGHT COLUMN — stat cards on top via z-index */}
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10"
          >

            <div className="grid grid-cols-2 gap-6">

              <StatCard
                title="Girls 
                      Supported"
                value="2000+"
                desc="From first periods to first boundaries"
                index={0}
              />

              <StatCard
                title="Schools 
                & Institutions"
                value="10+"
                desc="Classrooms where silence was replaced with understanding."
                index={1}
              />

              <StatCard
                title="Parents 
                Engaged"
                value="1000+"
                desc="Homes speaking the same language of care."
                index={2}
              />

              <StatCard
                title="Programs &
                Communities"
                value="50+"
                desc="CSR, NGOs, and government initiatives."
                index={3}
              />

            </div>

            {/* CTA */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-10 flex justify-end"
            >
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-purple w-full sm:w-auto font-nunito"
              >
                I want this for my daughter →
              </m.button>
            </m.div>

          </m.div>

        </div>

      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  desc,
  index,
}: {
  title: string;
  value: string;
  desc: string;
  index: number;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.01, transition: { duration: 0.3, ease: "easeOut" as const } }}
      className="bg-[#F7E9E6] rounded-xl p-4 md:p-6 shadow-[3px_3px_25.1px_0px_#B60A002E]"
    >

      {/* Icon + Title on same line */}
      <div className="flex items-center gap-3 mb-3">
        <FaUsers className="text-[#E39E9A] text-4xl md:text-5xl lg:text-6xl flex-shrink-0" />
        <p className="text-[14px] md:text-[16px] lg:text-[20px] text-[#2B2B2B] font-termes leading-tight whitespace-pre-line">{title}</p>
      </div>

      <h3 className="text-[36px] md:text-[44px] lg:text-[55px] font-semibold text-[#2B2B2B] font-nunito leading-none">
        {value}
      </h3>

      <p className="text-[12px] md:text-[14px] lg:text-[16px] text-[#2B2B2B] mt-1 font-nunito">
        {desc}
      </p>

    </m.div>
  );
}
