import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { FaSteam, FaGooglePlay, FaAppStoreIos } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
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

const findSection = (sections, sectionId) => {
  return sections.find((section) => section?.id === sectionId);
};

const findFieldValue = (section, fieldId) => {
  if (!section || !Array.isArray(section.fields)) return null;

  return section.fields.find((field) => field.id === fieldId)?.value ?? null;
};

const getStoreIcon = (icon) => {
  if (icon === "steam") return <FaSteam />;
  if (icon === "epicGames") return <SiEpicgames />;
  if (icon === "googlePlay") return <FaGooglePlay />;
  if (icon === "appStore") return <FaAppStoreIos />;

  return <FiArrowUpRight />;
};

function GamesPage() {
  const { language } = useLanguage();

  const [pageData, setPageData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const { scrollY } = useScroll();

  const bgX = useTransform(scrollY, [0, 400], [0, 220]);
  const contentX = useTransform(scrollY, [0, 400], [0, -130]);

  const heroOpacity = useTransform(scrollY, [0, 270], [1, 0]);
  const heroBlur = useTransform(scrollY, [0, 270], [0, 7]);
  const heroFilter = useMotionTemplate`blur(${heroBlur}px)`;

  const descY = useTransform(scrollY, [0, 300], [0, -45]);
  const descScale = useTransform(scrollY, [0, 300], [1, 0.96]);
  const descOpacity = useTransform(scrollY, [0, 230], [1, 0]);

  useEffect(() => {
    const fetchGamesPage = async () => {
      try {
        const data = await fetchJson(`${API_BASE}/api/pages/GamesPage`);
        if (!data) return;

        if (!Array.isArray(data.sections)) {
          window.location.href = "/404";
          return;
        }

        setPageData(data);
      } catch (error) {
        console.error("GamesPage data error:", error);
        setPageData(null);
      }
    };

    fetchGamesPage();
  }, []);

  const content = useMemo(() => {
    const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];

    const heroSection = findSection(sections, "hero");
    const tabsSection = findSection(sections, "tabs");
    const gamesSection = findSection(sections, "games");
    const buttonsSection = findSection(sections, "buttons");

    return {
      hero: {
        backgroundText: findFieldValue(heroSection, "backgroundText"),
        eyebrow: findFieldValue(heroSection, "eyebrow"),
        title: findFieldValue(heroSection, "title"),
        description: findFieldValue(heroSection, "description"),
      },
      tabs: findFieldValue(tabsSection, "items") || [],
      games: findFieldValue(gamesSection, "items") || [],
      buttons: {
        exploreButton: findFieldValue(buttonsSection, "exploreButton") || {},
      },
    };
  }, [pageData]);

  const t = (value, fallback = "") => {
    return getLocalizedValue(value, language, fallback);
  };

  const renderStoreIcon = (store) => {
    if (typeof store.icon === "string") {
      return getStoreIcon(store.icon);
    }

    if (store.icon?.url) {
      return (
        <img
          src={store.icon.url}
          alt={t(store.icon.alt, store.name || "Store icon")}
          className="h-4 w-4 object-contain"
          draggable={false}
        />
      );
    }

    return getStoreIcon(store.key || store.id);
  };

  const filteredGames = useMemo(() => {
    if (activeTab === "all") return content.games;

    return content.games.filter((game) => game.category === activeTab);
  }, [activeTab, content.games]);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(193,32,48,0.35),transparent_34%),linear-gradient(180deg,#2b171a_0%,#1a1011_48%,#0d0d0d_92%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-b from-transparent to-[#0d0d0d]" />

        <motion.h1
          style={{
            x: bgX,
            opacity: heroOpacity,
            filter: heroFilter,
          }}
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute left-1/2 top-1/2 whitespace-nowrap -translate-x-1/2 -translate-y-1/2 text-[18vw] leading-none font-black tracking-[-1vw] text-[#5f242b]/35 select-none pointer-events-none"
        >
          {t(content.hero.backgroundText, "OUR GAMES")}
        </motion.h1>

        <motion.div
          style={{
            x: contentX,
            opacity: heroOpacity,
            filter: heroFilter,
          }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12 }}
          className="relative z-10 w-full max-w-5xl text-center"
        >
          <span className="block text-center text-xs sm:text-sm tracking-[0.45em] text-white/45 uppercase">
            {t(content.hero.eyebrow, "Featured Releases")}
          </span>

          <h2 className="mx-auto mt-6 w-full text-center text-[48px] sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.045em] uppercase leading-none">
            {t(content.hero.title, "Our Games")}
          </h2>

          <motion.p
            style={{
              y: descY,
              scale: descScale,
              opacity: descOpacity,
            }}
            className="mx-auto mt-7 max-w-2xl text-center text-lg sm:text-xl text-white/78 leading-relaxed"
          >
            {t(
              content.hero.description,
              "We develop cinematic, memorable and carefully crafted games for PC and mobile platforms."
            )}
          </motion.p>
        </motion.div>
      </section>

      <section className="relative z-20 -mt-20 px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1500px] flex justify-center">
          <div className="relative flex w-full max-w-[720px] items-center justify-between border-y border-white/10 py-3">
            {content.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`relative flex-1 cursor-pointer px-4 py-4 text-center text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${activeTab === tab.value
                  ? "text-white"
                  : "text-white/35 hover:text-white/80"
                  }`}
              >
                <span className="relative z-10">{t(tab.label, tab.value)}</span>

                {activeTab === tab.value && (
                  <motion.span
                    layoutId="game-tab-underline"
                    className="absolute left-1/2 bottom-0 h-[2px] w-12 -translate-x-1/2 bg-white"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}

                {activeTab === tab.value && (
                  <motion.span
                    layoutId="game-tab-glow"
                    className="absolute left-1/2 top-1/2 h-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-xl"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="games-showcase"
        className="mx-auto flex w-full max-w-[1500px] flex-col gap-16 pt-24 px-6 pb-24 sm:px-8 md:px-10 md:gap-24 lg:px-16 lg:pb-32"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-16 md:gap-24"
          >
            {filteredGames.map((game, index) => {
              const isReverse = index % 2 === 1;

              const categoryLabel =
                content.tabs.find((tab) => tab.value === game.category)?.label ||
                game.category;

              const imageUrl = buildImageUrl(game.image);
              const hoverImageUrl = buildImageUrl(game.hoverImage);

              const imageAlt =
                typeof game.image === "object"
                  ? t(game.image.alt, t(game.title, "Game image"))
                  : t(game.title, "Game image");

              const hoverImageAlt =
                typeof game.hoverImage === "object"
                  ? t(game.hoverImage.alt, `${t(game.title, "Game")} preview`)
                  : `${t(game.title, "Game")} preview`;

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 45 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-20 xl:gap-32"
                >
                  <div
                    className={`lg:col-span-7 ${isReverse ? "lg:order-2" : "lg:order-1"
                      }`}
                  >
                    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#121212]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={imageAlt}
                          className="h-[320px] w-full object-cover transition-all duration-1000 ease-out group-hover:scale-[1.025] group-hover:opacity-0 sm:h-[420px] md:h-[520px] lg:h-[640px]"
                          draggable={false}
                        />
                      ) : null}

                      {hoverImageUrl ? (
                        <img
                          src={hoverImageUrl}
                          alt={hoverImageAlt}
                          className="absolute inset-0 h-full w-full scale-[1.025] object-cover opacity-0 transition-all duration-1000 ease-out group-hover:scale-100 group-hover:opacity-100"
                          draggable={false}
                        />
                      ) : null}

                      <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-100 transition-opacity duration-500 group-hover:opacity-0" />
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-5 ${isReverse ? "lg:order-1" : "lg:order-2"
                      }`}
                  >
                    <div className="max-w-[560px]">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">
                        {game.id} / {t(categoryLabel, game.category)}
                      </p>

                      <h2 className="mt-5 text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[42px] md:text-[56px]">
                        {t(game.title)}
                      </h2>

                      <p className="mt-6 text-[15px] leading-7 text-white/64 sm:text-[16px]">
                        {t(game.description)}
                      </p>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        {(game.stores || []).map((store) => (
                          <a
                            key={store.id || store.name}
                            href={store.href || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/store inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55 transition-all duration-300 hover:border-[#ef4645]/50 hover:bg-[#ef4645]/10 hover:text-[#ef4645]"
                          >
                            <span className="text-[16px] transition-transform duration-300 group-hover/store:scale-110">
                              {renderStoreIcon(store)}
                            </span>
                            <span>{store.name}</span>
                          </a>
                        ))}
                      </div>

                      <div className="mt-8 h-px w-full max-w-[420px] bg-white/10" />

                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                          to={game.link || "#"}
                          className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0d0d0d]"
                        >
                          {t(
                            content.buttons.exploreButton.text,
                            "Explore Game."
                          )}
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
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}

export default GamesPage;