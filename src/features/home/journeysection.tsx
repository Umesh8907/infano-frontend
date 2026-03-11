"use client";
import { Check } from "lucide-react";
import Image from "next/image";
import { m } from "framer-motion";

const items = [
  {
    id: 1,
    title: "Physical Trust: The Care Kit",
    subtitle: "A first friend. Something she can hold",
    desc: `Before conversations begin, trust must exist. The Infano Care Kit is designed to arrive gently into a girl's life—normalizing body changes, emotions, and questions without pressure or fear.`,
    features: [
      "“The Awkward Age book”",
      "Reusable menstrual care",
      "Period Tracking Journal",
    ],
    image: "/homeassets/care-kit.png",
    reverse: false,
  },
  {
    id: 2,
    title: "Structured Growth: Digital Learning Journeys",
    subtitle: "Growing up explained—one stage at a time",
    desc: `Infano’s digital learning is not school. It's life literacy. Short, expert-backed lessons designed around how girls actually think, feel, and grow.`,
    features: [
      "Stage-wise journeys (10–12, 13–15)",
      "Gynecologist & psychologist designed",
    ],
    image: "/homeassets/digital-learning.png",
    reverse: true,
  },
  {
    id: 3,
    title: "Human Guidance: Infano PeerLine",
    subtitle: "When she doesn’t want to ask a parent",
    desc: `PeerLine offers trained peer mentors who understand—not therapy, not judgment—just someone safe to talk to.`,
    features: [
      "Moderated conversations",
      "Safe mentorship spaces",
    ],
    image: "/homeassets/peerline.png",
    reverse: false,
  },
];

export default function JourneySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = (reverse: boolean) => ({
    hidden: { opacity: 0, x: reverse ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  });

  return (
    <section className="py-24 bg-[#FFFFFF] overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-14 px-4 py-4"
        >
          <p className="text-[20px] md:text-[22px] text-[#2B2B2B] font-nunito font-semibold">
            One Brand. One Journey. Many touchpoints.
          </p>

          <h2 className="text-[32px] sm:text-[42px] md:text-[48px] font-semibold font-termes text-[#2B2B2B] leading-tight mt-2 ">
            Growing up doesn’t happen in parts. So why does support?
          </h2>

          <p className="text-[16px] md:text-[18px] text-[#2B2B2B] font-nunito mt-2 sm:whitespace-pre-line lg:whitespace-nowrap">
            Infano.Care supports the entire journey—body, mind, confidence,
            and belonging—under one trusted brand.
          </p>
        </m.div>

        {/* Cards */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-10"
        >

          {items.map((item) => (
            <m.div
              key={item.id}
              variants={itemVariants(item.reverse)}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className={`relative bg-[#FFF9F9] rounded-2xl shadow-sm border border-[#F0E6E2] p-8 flex flex-col md:flex-row items-center gap-10 mb-8 ${item.reverse ? "md:flex-row-reverse" : ""}`}
            >
              {/* Number Badge */}
              <m.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="absolute -left-7 top-10 w-15 h-15 rounded-full flex items-center justify-center text-[#B60A00] font-semibold text-lg shadow-md"
                style={{
                  background: "radial-gradient(circle, #FFFFFF 0%, #F4779A 100%)",
                }}
              >
                {item.id}
              </m.div>

              {/* Text */}
              <div className="flex-1 px-4 py-4">

                <h3 className="text-[20px] md:text-[22px] text-[#2B2B2B] font-semibold">
                  {item.title}
                </h3>

                <p className="text-lg text-[#2B2B2B] mt-1 font-nunito font-semibold">
                  {item.subtitle}
                </p>

                <p className="text-md text-[#2B2B2B] mt-4 leading-relaxed font-nunito">
                  {item.desc}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-[#2B2B2B]">
                  {item.features.map((f, i) => (
                    <m.span
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2 font-nunito"
                    >
                      <Check className="text-[#F37147] w-[24px] h-[20px] mt-1 flex-shrink-0" />
                      {f}
                    </m.span>
                  ))}
                </div>

              </div>

              {/* Image */}
              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={380}
                  height={260}
                  className="rounded-lg object-cover"
                />
              </m.div>

            </m.div>
          ))}
        </m.div>
        {/* Final CTA */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >

          <h2 className="text-[36px] md:text-[42px] font-termes text-[#2B2B2B] font-semibold">
            Infano.Care doesn’t step in once.
          </h2>

          <p className="mt-3 text-lg text-[#2B2B2B] font-nunito">
            It stays—through every question, every change, and every becoming.
          </p>

          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-purple w-full sm:w-auto mt-6"
          >
            See How Her Journey Unfolds →
          </m.button>

        </m.div>
      </div>
    </section>
  );
}
