import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { TbRocket } from "react-icons/tb";
import { FaSteam, FaGooglePlay, FaApple } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL;

function AboutPage() {
  const { language } = useLanguage();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pages/AboutPage`);
        const data = await res.json();
        setPageData(data);
      } catch (error) {
        console.error("AboutPage data error:", error);
      }
    };

    fetchAboutPage();
  }, []);

  const content = useMemo(() => {
    const sections = pageData?.sections || [];

    const heroFields =
      sections.find((section) => section.id === "hero")?.fields || [];

    const whatFields =
      sections.find((section) => section.id === "whatWeDo")?.fields || [];

    const ctaFields =
      sections.find((section) => section.id === "gamesCta")?.fields || [];

    const getHeroField = (id) =>
      heroFields.find((field) => field.id === id)?.value;

    const getWhatField = (id) =>
      whatFields.find((field) => field.id === id)?.value;

    const getCtaField = (id) =>
      ctaFields.find((field) => field.id === id)?.value;

    return {
      heroBackgroundText: getHeroField("backgroundText")?.[language] || "",
      heroEyebrow: getHeroField("eyebrow")?.[language] || "",
      heroTitle: getHeroField("title")?.[language] || "",
      heroDescription: getHeroField("description")?.[language] || "",

      whatEyebrow: getWhatField("eyebrow")?.[language] || "",
      whatTitle: getWhatField("title")?.[language] || "",
      platforms: getWhatField("platforms") || [],

      ctaBackground: getCtaField("backgroundImage")?.url || "",
      ctaEyebrow: getCtaField("eyebrow")?.[language] || "",
      ctaTitle: getCtaField("title")?.[language] || "",
      ctaDescription: getCtaField("description")?.[language] || "",
      ctaButtonText: getCtaField("button")?.text?.[language] || "",
      ctaButtonHref: getCtaField("button")?.href || "/games",
    };
  }, [pageData, language]);

  const renderPlatformIcon = (icon) => {
    if (icon === "pc") {
      return (
        <div className="flex items-center gap-3 text-3xl text-white">
          <FaSteam />
          <SiEpicgames />
        </div>
      );
    }

    if (icon === "mobile") {
      return (
        <div className="flex items-center gap-3 text-3xl text-white">
          <FaGooglePlay />
          <FaApple />
        </div>
      );
    }

    return <TbRocket className="text-3xl text-white" />;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0d0d0d] text-white">
      {/* HERO */}
      <section className="relative flex min-h-[82vh] items-center px-5 pt-24 sm:px-8 sm:pt-28 lg:px-16 lg:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[18vw] font-black tracking-[-0.12em] text-white/[0.025]">
            {content.heroBackgroundText}
          </h1>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1500px]">
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 text-sm uppercase tracking-[0.45em] text-[#ef4645] sm:text-base"
          >
            {content.heroEyebrow}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 42 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08 }}
            className="max-w-6xl text-5xl font-black leading-[0.88] tracking-[-0.08em] sm:text-7xl lg:text-8xl xl:text-9xl"
          >
            {content.heroTitle}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-10 max-w-2xl border-l border-[#c12030] pl-6"
          >
            <p className="text-base leading-relaxed text-white/58 sm:text-lg">
              {content.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="relative overflow-hidden px-5 pb-32 pt-10 sm:px-8 sm:pb-40 sm:pt-12 lg:px-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-white/[0.04] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1500px]">
          <div className="mb-14 mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65 }}
                className="mb-6 text-[12px] font-medium uppercase tracking-[0.42em] text-white/35"
              >
                {content.whatEyebrow}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl text-[46px] font-black leading-[0.9] tracking-[-0.075em] sm:text-[68px] lg:text-[90px]"
              >
                {content.whatTitle}
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {content.platforms.map((item, index) => (
              <motion.article
                key={item.id || index}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="group relative min-h-[440px] overflow-hidden rounded-[34px] bg-[#121212] p-7 sm:p-8"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_34%)] opacity-70" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute right-6 top-5 text-[92px] font-black leading-none tracking-[-0.12em] text-white/[0.035] transition-all duration-500 group-hover:scale-105 group-hover:text-white/[0.075] sm:text-[120px]">
                  {item.number}
                </div>

                <div className="relative z-10 flex h-full min-h-[380px] flex-col">
                  <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-3xl text-white">
                      {renderPlatformIcon(item.icon)}
                    </div>

                    <span className="text-[11px] uppercase tracking-[0.28em] text-white/28 transition-all duration-500 group-hover:text-white/60">
                      {item.number}
                    </span>
                  </div>

                  <div className="mt-auto overflow-visible">
                    <p className="mb-4 text-[12px] uppercase tracking-[0.24em] text-[#ef4645] transition-all duration-500 group-hover:translate-x-2 group-hover:tracking-[0.32em] group-hover:text-white/80">
                      {item.label?.[language]}
                    </p>

                    <h3 className="text-[38px] font-black leading-[0.92] tracking-[-0.06em] transition-all duration-500 group-hover:-translate-y-2 group-hover:text-[#ef4645] sm:text-[46px]">
                      {item.title?.[language]}
                    </h3>

                    <p className="mt-6 max-w-[360px] translate-y-5 text-[15px] leading-7 text-white/45 opacity-80 transition-all duration-700 group-hover:translate-y-0 group-hover:text-white/70 group-hover:opacity-100">
                      {item.text?.[language]}
                    </p>

                    <div className="mt-7 h-[1px] w-0 bg-[#ef4645] transition-all duration-700 group-hover:w-24" />
                  </div>
                </div>

                <div className="absolute inset-0 translate-y-full bg-white/[0.045] transition-transform duration-700 ease-out group-hover:translate-y-0" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PARALLAX CTA */}
      <section className="relative w-full overflow-hidden bg-[#0d0d0d] text-white">
        {content.ctaBackground && (
          <div
            className="absolute inset-0 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: `url(${content.ctaBackground})` }}
          />
        )}

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(13,13,13,0.25),rgba(13,13,13,0.75))]" />

        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-20 sm:px-8 md:px-10 md:py-24 lg:px-16 lg:py-28">
          <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-14">
            <div className="lg:col-span-8">
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                viewport={{ once: true, amount: 0.35 }}
                className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/45"
              >
                {content.ctaEyebrow}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05 }}
                viewport={{ once: true, amount: 0.35 }}
                className="mt-6 max-w-[850px] text-[38px] font-semibold leading-[0.96] tracking-[-0.045em] sm:text-[50px] md:text-[68px] lg:text-[82px] xl:text-[94px]"
              >
                {content.ctaTitle}
              </motion.h2>
            </div>

            <div className="lg:col-span-4 lg:flex lg:items-end">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.12 }}
                viewport={{ once: true, amount: 0.35 }}
              >
                <p className="max-w-[420px] text-[15px] leading-7 text-white/68 sm:text-[16px]">
                  {content.ctaDescription}
                </p>

                <a
                  href={content.ctaButtonHref}
                  className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0d0d0d] transition-all duration-300 hover:scale-[1.02]"
                >
                  {content.ctaButtonText}
                  <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;