import React, { useEffect, useMemo, useState } from "react";
import { FaSteam, FaPause, FaPlay } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { fetchJson } from "../utils/fetchJson";

const API_BASE = import.meta.env.VITE_API_URL;

const DEFAULT_SLIDE_DURATION = 10000;

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

const getButtonIcon = (icon) => {
  if (icon === "steam") return <FaSteam className="text-lg" />;

  return null;
};

export default function Hero() {
  const { language } = useLanguage();

  const [pageData, setPageData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await fetchJson(`${API_BASE}/api/pages/Hero`);
        if (!data) return;

        setPageData(data);
      } catch (error) {
        console.error("Hero data error:", error);
        setPageData(null);
      }
    };

    fetchHero();
  }, []);

  const content = useMemo(() => {
    const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];

    const settingsSection = findSection(sections, "settings");
    const slidesSection = findSection(sections, "slides");
    const controlsSection = findSection(sections, "controls");

    return {
      slideDuration:
        findFieldValue(settingsSection, "slideDuration") ||
        DEFAULT_SLIDE_DURATION,
      slides: findFieldValue(slidesSection, "items") || [],
      controls: {
        playLabel: findFieldValue(controlsSection, "playLabel"),
        pauseLabel: findFieldValue(controlsSection, "pauseLabel"),
        goToSlideLabel: findFieldValue(controlsSection, "goToSlideLabel"),
      },
    };
  }, [pageData]);

  const t = (value, fallback = "") => {
    return getLocalizedValue(value, language, fallback);
  };

  const slides = content.slides;
  const slideDuration = Number(content.slideDuration) || DEFAULT_SLIDE_DURATION;

  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (slideDuration / 100);


        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, currentSlide, slideDuration, slides.length]);

  const activeSlide = slides[currentSlide];

  if (!activeSlide) {
    return (
      <section className="relative flex min-h-screen w-full items-center justify-center bg-[#0d0d0d] px-6 text-center text-white">
        <p>Hero verisi bulunamadı.</p>
      </section>
    );
  }

  const backgroundUrl = buildImageUrl(activeSlide.background);
  const logoUrl = buildImageUrl(activeSlide.logo);

  const backgroundAlt = getImageAlt(
    activeSlide.background,
    language,
    `Hero Background ${currentSlide + 1}`
  );

  const logoAlt = getImageAlt(
    activeSlide.logo,
    language,
    `Hero Logo ${currentSlide + 1}`
  );

  return (
    <section
      className={`${activeSlide.sectionClass || ""} relative w-full min-h-screen bg-[#0d0d0d] overflow-hidden`}
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            {backgroundUrl ? (
              <img
                src={backgroundUrl}
                alt={backgroundAlt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
            <div className="absolute inset-x-0 bottom-0 h-[180px] sm:h-[220px] md:h-[260px] bg-gradient-to-b from-transparent via-[#0d0d0d]/70 to-[#0d0d0d]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex min-h-screen items-center px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 pt-[120px] pb-[90px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center gap-14 sm:gap-16 md:gap-20 lg:flex-row lg:gap-32 xl:gap-40 2xl:gap-48"
          >
            <div className="flex w-full justify-center lg:w-auto lg:justify-end">
              {logoUrl ? (
                <motion.img
                  src={logoUrl}
                  alt={logoAlt}
                  className="w-[220px] sm:w-[280px] md:w-[340px] lg:w-[440px] xl:w-[500px] h-auto object-contain select-none"
                  draggable={false}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                />
              ) : null}
            </div>

            <div className="w-full max-w-xl text-center lg:max-w-2xl lg:text-left lg:pl-10 xl:pl-16 2xl:pl-20">
              <motion.h1
                className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t(activeSlide.title?.beforeHighlight)}
                {activeSlide.title?.highlight ? (
                  <>
                    {" "}
                    <span className="text-[#ef4645]">
                      {t(activeSlide.title.highlight)}
                    </span>
                  </>
                ) : null}
              </motion.h1>

              <motion.p
                className="mb-8 text-sm text-gray-300 sm:text-base md:text-lg lg:max-w-lg"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.28 }}
              >
                {t(activeSlide.description)}
              </motion.p>

              <motion.div
                className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.36 }}
              >
                <Link
                  to={activeSlide.primaryButton?.href || activeSlide.gameHref || "#"}
                  className="rounded-lg bg-[#ef4645] px-6 py-3 font-medium text-white transition hover:opacity-90 cursor-pointer text-center"
                >
                  {t(activeSlide.primaryButton?.text, "Discover")}
                </Link>

                <a
                  href={activeSlide.secondaryButton?.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-white transition hover:bg-white/10 cursor-pointer"
                >
                  {t(activeSlide.secondaryButton?.text, "Add Wishlist")}
                  {getButtonIcon(activeSlide.secondaryButton?.icon)}
                </a>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;

              return (
                <motion.button
                  key={slide.id}
                  type="button"
                  aria-label={`${t(content.controls.goToSlideLabel, "Go to slide")} ${index + 1}`}
                  onClick={() => {
                    setCurrentSlide(index);
                    setProgress(0);
                  }}
                  initial={false}
                  animate={{
                    width: isActive ? 64 : 10,
                  }}
                  transition={{
                    duration: 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative h-[10px] overflow-hidden rounded-full cursor-pointer ${isActive
                    ? "bg-white/20"
                    : "bg-white/40 hover:bg-white/55"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      key={`progress-${currentSlide}`}
                      className="absolute left-0 top-0 h-full rounded-full bg-[#ef4645]"
                      initial={{ width: 0, opacity: 0.95 }}
                      animate={{ width: `${progress}%`, opacity: 1 }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={
              isPaused
                ? t(content.controls.playLabel, "Play slider")
                : t(content.controls.pauseLabel, "Pause slider")
            }
            className="ml-2 sm:ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
          >
            {isPaused ? (
              <FaPlay className="text-sm" />
            ) : (
              <FaPause className="text-sm" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}