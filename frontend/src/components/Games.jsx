import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL;

function Games() {
    const heroRef = useRef(null);
    const { language } = useLanguage();
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/pages/Games`);
                const data = await res.json();
                setPageData(data);
            } catch (error) {
                console.error("Games data error:", error);
            }
        };

        fetchGames();
    }, []);

    const content = useMemo(() => {
        const sections = pageData?.sections || [];

        const heroFields = sections.find((section) => section.id === "hero")?.fields || [];
        const gamesFields = sections.find((section) => section.id === "gamesList")?.fields || [];
        const introFields = sections.find((section) => section.id === "intro")?.fields || [];
        const ctaFields = sections.find((section) => section.id === "endCta")?.fields || [];

        const getHeroField = (id) => heroFields.find((field) => field.id === id)?.value;
        const getGamesField = (id) => gamesFields.find((field) => field.id === id)?.value;
        const getIntroField = (id) => introFields.find((field) => field.id === id)?.value;
        const getCtaField = (id) => ctaFields.find((field) => field.id === id)?.value;

        return {
            heroBackground: getHeroField("backgroundImage")?.url || "",
            eyebrow: getHeroField("eyebrow")?.[language] || "",
            title: getHeroField("title")?.[language] || "",
            description: getHeroField("description")?.[language] || "",
            buttonText: getHeroField("button")?.text?.[language] || "Explore Games",
            buttonHref: getHeroField("button")?.href || "#games-showcase",
            countText: getHeroField("countText")?.[language] || "",
            introEyebrow: getIntroField("eyebrow")?.[language] || "",
            introText: getIntroField("text")?.[language] || "",
            games: getGamesField("games") || [],
            ctaEyebrow: getCtaField("eyebrow")?.[language] || "",
            ctaTitle: getCtaField("title")?.[language] || "",
            ctaButtonText: getCtaField("button")?.text?.[language] || "",
            ctaButtonHref: getCtaField("button")?.href || "/contact",
        };
    }, [pageData, language]);

    return (
        <div className="w-full overflow-hidden bg-[#0d0d0d] text-white">
            <section
                ref={heroRef}
                className="relative h-[100svh] min-h-[760px] w-full overflow-hidden"
            >
                {content.heroBackground && (
                    <div
                        className="absolute inset-0 bg-fixed bg-cover bg-center"
                        style={{ backgroundImage: `url(${content.heroBackground})` }}
                    />
                )}

                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.72))]" />

                <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] items-end px-6 pb-16 sm:px-8 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
                    <div className="max-w-[950px]">
                        <motion.p
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            className="mb-5 text-[11px] font-medium uppercase tracking-[0.34em] text-white/70 sm:text-[12px]"
                        >
                            {content.eyebrow}
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 34 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.05 }}
                            viewport={{ once: true }}
                            className="max-w-[900px] text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[54px] md:text-[72px] lg:text-[96px] xl:text-[112px]"
                        >
                            {content.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.12 }}
                            viewport={{ once: true }}
                            className="mt-6 max-w-[640px] text-[15px] leading-7 text-white/70 sm:text-[16px] md:text-[17px]"
                        >
                            {content.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 26 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.18 }}
                            viewport={{ once: true }}
                            className="mt-10 flex flex-wrap items-center gap-4"
                        >
                            <a
                                href={content.buttonHref}
                                className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#0d0d0d] transition-all duration-300 hover:scale-[1.02]"
                            >
                                {content.buttonText}
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                            </a>

                            {content.countText && (
                                <div className="text-[12px] uppercase tracking-[0.24em] text-white/45">
                                    {content.countText}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="border-t border-white/10">
                <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-8 px-6 py-16 sm:px-8 md:px-10 lg:grid-cols-12 lg:px-16 lg:py-24">
                    <div className="lg:col-span-3">
                        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/40">
                            {content.introEyebrow}
                        </p>
                    </div>

                    <div className="lg:col-span-9">
                        <p className="max-w-[900px] text-[20px] leading-[1.5] tracking-[-0.02em] text-white/82 sm:text-[24px] md:text-[28px]">
                            {content.introText}
                        </p>
                    </div>
                </div>
            </section>

            <section
                id="games-showcase"
                className="mx-auto flex w-full max-w-[1500px] flex-col gap-16 px-6 pb-24 sm:px-8 md:px-10 md:gap-24 lg:px-16 lg:pb-32"
            >
                {content.games.map((game, index) => {
                    const isReverse = index % 2 === 1;

                    return (
                        <motion.div
                            key={game.id || index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-20 xl:gap-32"
                        >
                            <div className={`lg:col-span-7 ${isReverse ? "lg:order-2" : "lg:order-1"}`}>
                                <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#121212]">
                                    <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),rgba(0,0,0,0.05))]" />

                                    <img
                                        src={game.image}
                                        alt={game.title?.[language] || game.id}
                                        className="h-[320px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:h-[420px] md:h-[520px] lg:h-[640px]"
                                        draggable={false}
                                    />

                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-full bg-[linear-gradient(to_top,rgba(0,0,0,0.96),rgba(0,0,0,0.72),transparent)] px-6 py-8 transition-transform duration-500 ease-out group-hover:translate-y-0 sm:px-8 sm:py-10">
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-white/75">
                                            {game.status?.[language] || "Coming Soon"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={`lg:col-span-5 ${isReverse ? "lg:order-1" : "lg:order-2"}`}>
                                <div className="max-w-[560px]">
                                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">
                                        {String(index + 1).padStart(2, "0")} / {game.category?.[language]}
                                    </p>

                                    <h2 className="mt-5 text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[42px] md:text-[56px]">
                                        {game.title?.[language]}
                                    </h2>

                                    <p className="mt-6 text-[15px] leading-7 text-white/64 sm:text-[16px]">
                                        {game.description?.[language]}
                                    </p>

                                    <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                                        {(game.stores || []).map((store, storeIndex) => (
                                            <React.Fragment key={`${store.name}-${storeIndex}`}>
                                                <a
                                                    href={store.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group/store relative inline-flex items-center text-[12px] font-medium uppercase tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-[#ef4645]"
                                                >
                                                    <span>{store.name}</span>
                                                    <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[#ef4645] transition-transform duration-300 ease-out group-hover/store:scale-x-100" />
                                                </a>

                                                {storeIndex !== game.stores.length - 1 && (
                                                    <span className="text-white/20">|</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <div className="mt-8 h-px w-full max-w-[420px] bg-white/10" />

                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <a
                                            href={game.projectHref || "#"}
                                            className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0d0d0d]"
                                        >
                                            {game.projectButton?.[language] || "View Project"}
                                            <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                                        </a>

                                        <span className="text-[12px] uppercase tracking-[0.24em] text-white/35">
                                            {game.developmentText?.[language] || ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            <section>
                <div className="mx-auto flex w-full max-w-[1500px] flex-col items-start justify-between gap-8 px-6 py-18 sm:px-8 md:px-10 lg:flex-row lg:items-end lg:px-16 lg:py-24">
                    <div className="max-w-[760px]">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">
                            {content.ctaEyebrow}
                        </p>
                        <h3 className="mt-5 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[40px] md:text-[52px]">
                            {content.ctaTitle}
                        </h3>
                    </div>

                    <a
                        href={content.ctaButtonHref}
                        className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0d0d0d] transition-all duration-300 hover:scale-[1.02]"
                    >
                        {content.ctaButtonText}
                        <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                    </a>
                </div>
                <div className="border-t border-white/10" />
            </section>
        </div>
    );
}

export default Games;