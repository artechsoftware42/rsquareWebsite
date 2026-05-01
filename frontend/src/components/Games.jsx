import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import { fetchJson } from "../utils/fetchJson";

const API_BASE = import.meta.env.VITE_API_URL;

const getLocalizedValue = (value, language, fallback = "") => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value[language] ?? value.tr ?? value.en ?? fallback;
    }

    return value ?? fallback;
};

const buildImageUrl = (value) => {
    if (!value) return "";

    if (typeof value === "string") return value;

    if (typeof value === "object") {
        return value.url || value.image || "";
    }

    return "";
};

const getImageAlt = (value, language, fallback = "") => {
    if (value && typeof value === "object") {
        return getLocalizedValue(value.alt, language, fallback);
    }

    return fallback;
};

const findSection = (sections, sectionId) => {
    return sections.find((section) => section?.id === sectionId);
};

const findFieldValue = (section, fieldId) => {
    if (!section || !Array.isArray(section.fields)) return null;

    return section.fields.find((field) => field.id === fieldId)?.value ?? null;
};

function Games() {
    const { language } = useLanguage();
    const heroRef = useRef(null);

    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await fetchJson(`${API_BASE}/api/pages/Games`);
                if (!data) return;

                setPageData(data);
            } catch (error) {
                console.error("Games data error:", error);
                setPageData(null);
            }
        };

        fetchGames();
    }, []);

    const content = useMemo(() => {
        const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];

        const heroSection = findSection(sections, "hero");
        const introSection = findSection(sections, "intro");
        const gamesSection = findSection(sections, "games");
        const buttonsSection = findSection(sections, "buttons");
        const endCtaSection = findSection(sections, "endCta");

        return {
            hero: {
                backgroundImage: findFieldValue(heroSection, "backgroundImage"),
                eyebrow: findFieldValue(heroSection, "eyebrow"),
                title: findFieldValue(heroSection, "title"),
                description: findFieldValue(heroSection, "description"),
                primaryButton: findFieldValue(heroSection, "primaryButton") || {},
                titlesCount: findFieldValue(heroSection, "titlesCount"),
            },
            intro: {
                eyebrow: findFieldValue(introSection, "eyebrow"),
                description: findFieldValue(introSection, "description"),
            },
            games: findFieldValue(gamesSection, "items") || [],
            buttons: {
                viewProject: findFieldValue(buttonsSection, "viewProject") || {},
            },
            endCta: {
                eyebrow: findFieldValue(endCtaSection, "eyebrow"),
                title: findFieldValue(endCtaSection, "title"),
                button: findFieldValue(endCtaSection, "button") || {},
            },
        };
    }, [pageData]);

    const t = (value, fallback = "") => {
        return getLocalizedValue(value, language, fallback);
    };

    const heroBackgroundUrl = buildImageUrl(content.hero.backgroundImage);

    return (
        <div className="w-full overflow-hidden bg-[#0d0d0d] text-white">
            <section
                ref={heroRef}
                className="relative h-[100svh] min-h-[760px] w-full overflow-hidden"
            >
                {heroBackgroundUrl ? (
                    <div
                        className="absolute inset-0 bg-fixed bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroBackgroundUrl})` }}
                        aria-label={getImageAlt(
                            content.hero.backgroundImage,
                            language,
                            "Games background image"
                        )}
                    />
                ) : null}

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
                            {t(content.hero.eyebrow, "Our Worlds")}
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 34 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.05 }}
                            viewport={{ once: true }}
                            className="max-w-[900px] text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[54px] md:text-[72px] lg:text-[96px] xl:text-[112px]"
                        >
                            {t(content.hero.title, "Discover our games.")}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.12 }}
                            viewport={{ once: true }}
                            className="mt-6 max-w-[640px] text-[15px] leading-7 text-white/70 sm:text-[16px] md:text-[17px]"
                        >
                            {t(
                                content.hero.description,
                                "Built with atmosphere, direction, and identity in mind. Explore the projects that define our creative vision."
                            )}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 26 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.18 }}
                            viewport={{ once: true }}
                            className="mt-10 flex flex-wrap items-center gap-4"
                        >
                            <a
                                href={content.hero.primaryButton.href || "#games-showcase"}
                                className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#0d0d0d] transition-all duration-300 hover:scale-[1.02]"
                            >
                                {t(content.hero.primaryButton.text, "Explore Games")}
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                            </a>

                            <div className="text-[12px] uppercase tracking-[0.24em] text-white/45">
                                {t(content.hero.titlesCount, "3 Titles")}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="border-t border-white/10">
                <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-8 px-6 py-16 sm:px-8 md:px-10 lg:grid-cols-12 lg:px-16 lg:py-24">
                    <div className="lg:col-span-3">
                        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/40">
                            {t(content.intro.eyebrow, "Selected Projects")}
                        </p>
                    </div>

                    <div className="lg:col-span-9">
                        <p className="max-w-[900px] text-[20px] leading-[1.5] tracking-[-0.02em] text-white/82 sm:text-[24px] md:text-[28px]">
                            {t(
                                content.intro.description,
                                "Each title is shaped with a distinct tone, visual character, and deliberate sense of direction."
                            )}
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
                    const imageUrl = buildImageUrl(game.image);

                    return (
                        <motion.div
                            key={game.id || game.slug || index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-20 xl:gap-32"
                        >
                            <div
                                className={`lg:col-span-7 ${isReverse ? "lg:order-2" : "lg:order-1"
                                    }`}
                            >
                                <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#121212]">
                                    <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),rgba(0,0,0,0.05))]" />

                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={getImageAlt(game.image, language, t(game.title))}
                                            className="h-[320px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:h-[420px] md:h-[520px] lg:h-[640px]"
                                            draggable={false}
                                        />
                                    ) : null}

                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-full bg-[linear-gradient(to_top,rgba(0,0,0,0.96),rgba(0,0,0,0.72),transparent)] px-6 py-8 transition-transform duration-500 ease-out group-hover:translate-y-0 sm:px-8 sm:py-10">
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-white/75">
                                            {t(game.hoverStatus, "Coming Soon in 2026")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`lg:col-span-5 ${isReverse ? "lg:order-1" : "lg:order-2"
                                    }`}
                            >
                                <div className="max-w-[560px]">
                                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">
                                        {game.id} / {t(game.categoryLabel, game.category)}
                                    </p>

                                    <h2 className="mt-5 text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[42px] md:text-[56px]">
                                        {t(game.title)}
                                    </h2>

                                    <p className="mt-6 text-[15px] leading-7 text-white/64 sm:text-[16px]">
                                        {t(game.description)}
                                    </p>

                                    <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                                        {(game.stores || []).map((store, storeIndex) => (
                                            <React.Fragment key={store.id || store.name}>
                                                <a
                                                    href={store.href || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group/store relative inline-flex items-center text-[12px] font-medium uppercase tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-[#ef4645]"
                                                >
                                                    <span>{store.name}</span>
                                                    <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[#ef4645] transition-transform duration-300 ease-out group-hover/store:scale-x-100" />
                                                </a>

                                                {storeIndex !== (game.stores || []).length - 1 && (
                                                    <span className="text-white/20">|</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <div className="mt-8 h-px w-full max-w-[420px] bg-white/10" />

                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <Link
                                            to={game.link || `/games/${game.slug}`}
                                            className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0d0d0d]"
                                        >
                                            {t(content.buttons.viewProject.text, "View Project")}
                                            <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                                        </Link>

                                        <span className="text-[12px] uppercase tracking-[0.24em] text-white/35">
                                            {t(game.status, "In Development")}
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
                            {t(content.endCta.eyebrow, "More To Come")}
                        </p>

                        <h3 className="mt-5 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[40px] md:text-[52px]">
                            {t(
                                content.endCta.title,
                                "New worlds are already taking shape."
                            )}
                        </h3>
                    </div>

                    <Link
                        to={content.endCta.button.href || "/contact"}
                        className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0d0d0d] transition-all duration-300 hover:scale-[1.02]"
                    >
                        {t(content.endCta.button.text, "Stay Connected")}
                        <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                    </Link>
                </div>

                <div className="border-t border-white/10" />
            </section>
        </div>
    );
}

export default Games;