"use client";

import Image from "next/image";
import { BsShieldFillCheck } from "react-icons/bs";
import { m } from "framer-motion";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <section className="w-full bg-gradient-to-r from-primary-100 via-white to-primary-100 pt-16 pb-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <m.div
          className="space-y-6 text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative">
            <m.div
              variants={itemVariants}
              className="absolute -top-10 left-4 sm:left-10 md:left-0"
            >
              <Image
                src="/homeassets/stars.png"
                alt="stars"
                width={80}
                height={80}
              />
            </m.div>

            <m.h1
              variants={itemVariants}
              className="text-[32px] sm:text-[42px] md:text-[48px] font-termes text-[#2B2B2B] leading-tight"
            >
              Girls are expected to become strong women.
              <br />
              But no one teaches them how.
            </m.h1>
          </div>

          <m.p
            variants={itemVariants}
            className="text-[#2B2B2B] text-base font-nunito md:text-lg leading-relaxed max-w-[500px] mx-auto md:mx-0"
          >
            Infano.Care is a lifecycle empowerment platform for adolescent
            and young adult girls. We help them grow into confident,
            capable women without silence, shame, or sudden adulthood.
          </m.p>

          {/* Buttons */}
          <m.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2"
          >
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-purple w-full sm:w-auto"
            >
              Start Her Journey →
            </m.button>

            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-orange w-full sm:w-auto"
            >
              Explore by Age
            </m.button>
          </m.div>

          {/* Feature Box */}
          <m.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 w-full sm:w-fit mx-auto md:mx-0"
          >
            <div className="flex flex-col gap-4 text-[#2B2B2B] text-sm sm:text-base md:text-lg font-nunito text-left">
              {[
                "Designed with doctors, psychologists & educators",
                "Safe & Moderated",
                "Age-appropriate",
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src="/homeassets/sheildcheckicon.png"
                      alt="Shield Check Icon"
                      width={20}
                      height={20}
                      className="sm:w-[24px] sm:h-[24px]"
                    />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </m.div>
        </m.div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center md:justify-end items-center mt-8 md:mt-0">
          {/* TAGS ABOVE GIRL */}
          <div className="absolute right-0 md:right-[30px] top-[-40px] md:top-[-60px] flex flex-col gap-6 md:gap-10 z-20">
            <m.span
              variants={floatingVariants}
              animate="animate"
              className="bg-[#FFDDDD] text-sm px-3 py-1 rounded-full text-[#000000] shadow-sm cursor-default"
            >
              #YourPathYourPace
            </m.span>

            <m.span
              animate={{
                y: [0, 10, 0],
                transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="bg-[#FFDDDD] text-sm px-3 py-1 rounded-full text-[#000000] shadow-sm ml-20 cursor-default"
            >
              #Community
            </m.span>
          </div>

          {/* STAR IMAGE */}
          <m.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="absolute top-[-55px] left-[-10px]"
          >
            <Image
              src="/homeassets/star.png"
              alt="stars"
              width={110}
              height={40}
            />
          </m.div>

          {/* MESSAGE BOX */}
          <m.div
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute top-[-40px] sm:top-[-40px] md:top-[-50px] left-[-20px] sm:left-0 md:left-8 z-10"
          >
            <Image
              src="/homeassets/message.box.png"
              alt="message"
              width={260}
              height={260}
              className="w-[180px] sm:w-[220px] md:w-[260px]"
            />
          </m.div>

          {/* GIRL IMAGE */}
          <m.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 w-[80%] sm:w-[85%] md:w-full max-w-[450px] md:max-w-none sm:translate-y-4 md:translate-y-0 md:translate-x-10"
          >
            <Image
              src="/homeassets/hero-girl.png"
              alt="Infano Assistant"
              width={520}
              height={520}
              priority
              className="object-contain"
            />
          </m.div>
        </div>
      </div>
    </section>
  );
}
