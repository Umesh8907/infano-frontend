"use client";

import Image from "next/image";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { m } from "framer-motion";

const experts = [
  {
    name: "Dr. Aanya Sharma",
    role: "Adolescent Gynaecologist",
    description:
      "Specializing in adolescent health and menstrual education, Dr. Aanya ensures every Infano lesson is medically accurate, age-appropriate, and empowering rather than intimidating.",
  },
  {
    name: "Dr. Aanya Sharma",
    role: "Adolescent Gynaecologist",
    description:
      "Specializing in adolescent health and menstrual education, Dr. Aanya ensures every Infano lesson is medically accurate, age-appropriate, and empowering rather than intimidating.",
  },
  {
    name: "Dr. Aanya Sharma",
    role: "Adolescent Gynaecologist",
    description:
      "Specializing in adolescent health and menstrual education, Dr. Aanya ensures every Infano lesson is medically accurate, age-appropriate, and empowering rather than intimidating.",
  },
];

export default function ExpertsSection() {
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
    <section className="relative py-24 bg-[#FFEBE5] overflow-hidden">

      {/* Background */}
      <Image
        src="/homeassets/h.png"
        alt="bg"
        fill
        className="object-cover opacity-40"
      />

      <div className="relative max-w-[1350px] mx-auto px-6">

        {/* Heading */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[20px] md:text-[22px] text-[#2B2B2B] font-nunito font-semibold">Meet the Experts</p>

          <h2 className="text-[32px] sm:text-[42px] md:text-[48px] font-semibold font-termes text-[#2B2B2B] leading-tight mt-2">
            The Backbone
          </h2>

          <p className="mt-4 text-[16px] md:text-[18px] text-[#2B2B2B] max-w-xl mx-auto font-nunito">
            Experts from different specialties join hands to
            support<br />young girls as they grow into confident women.
          </p>
        </m.div>

        {/* Cards */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-center gap-8 flex-wrap"
        >
          {experts.map((expert, index) => (
            <m.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="bg-white w-[400px] h-[500px] rounded-[16px] border border-[#E5E5E5] overflow-hidden shadow-sm"
            >

              {/* Top Section */}
              <div className="flex items-center gap-6 p-6">

                <m.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Image
                    src="/homeassets/doctor.png"
                    alt="doctor"
                    width={170}
                    height={230}
                    className="object-contain"
                  />
                </m.div>

                <div>
                  <h3 className="text-[30px] font-semibold text-[#2B2B2B] leading-tight">
                    {expert.name}
                  </h3>

                  <p className="text-[20px] text-[#7C7C7C] font-semibold mt-2">
                    {expert.role}
                  </p>
                </div>

              </div>

              {/* Divider */}
              <m.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="border-t border-[#E5582B]"
              />

              {/* Bottom Section */}
              <div className="p-6">

                <p className="text-[16px] text-[#2B2B2B] font-nunito leading-relaxed">
                  {expert.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[16px] text-[#000000] font-medium font-semibold font-nunito">
                  <ShieldCheckIcon className="h-6 w-6 text-[#E5582B] " />
                  Medical Accuracy Verified
                </div>

              </div>
            </m.div>
          ))}
        </m.div>

        {/* Bottom text */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-[20px] md:text-[24px] text-[#2B2B2B] font-nunito font-semibold">
            Built with experts. Delivered with empathy.
          </h3>

          <p className="mt-4 text-[16px] md:text-[18px] text-[#2B2B2B] max-w-xl mx-auto font-nunito">
            Infano.Care is where medical science meets emotional understanding —
            so girls receive guidance that is accurate, age-aligned, and deeply human.
          </p>
        </m.div>

      </div>
    </section>
  );
}
