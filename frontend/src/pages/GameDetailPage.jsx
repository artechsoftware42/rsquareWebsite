import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaSteam, FaGooglePlay, FaApple } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useLanguage } from "../context/LanguageContext";

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

const platformIcons = {
  steam: { icon: <FaSteam />, label: "Steam" },
  epic: { icon: <SiEpicgames />, label: "Epic Games" },
  appstore: { icon: <FaApple />, label: "App Store" },
  googleplay: { icon: <FaGooglePlay />, label: "Google Play" },
};

const BrushDivider = () => (
  <div className="mx-auto mt-8 h-5 w-full max-w-xs">
    <svg viewBox="0 0 500 45" preserveAspectRatio="none" className="h-full w-full">
      <path
        d="M12 26 C95 15, 150 34, 232 22 C310 9, 398 18, 488 24"
        fill="none"
        stroke="#d6a83a"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M50 31 C150 20, 255 35, 430 28"
        fill="none"
        stroke="#d6a83a"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  </div>
);

const BrushImage = ({ src, alt, className = "" }) => (
  <div className={`relative overflow-hidden rounded-xl ${className}`}>
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition duration-700 hover:scale-105"
    />
  </div>
);

const GameDetailPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();

  const [pageData, setPageData] = useState(null);
  const [activeTab, setActiveTab] = useState("screenshots");
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pages/GameDetails`);
        const data = await res.json();

        if (!res.ok || !data) {
          throw new Error(data?.error || "GameDetails verisi alınamadı.");
        }

        setPageData(data);
      } catch (error) {
        console.error("GameDetails data error:", error);
        setPageData(null);
      }
    };

    fetchGameDetails();
  }, []);

  const content = useMemo(() => {
    const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];

    const gamesSection = findSection(sections, "games");
    const uiTextsSection = findSection(sections, "uiTexts");

    return {
      games: findFieldValue(gamesSection, "items") || [],
      uiTexts: {
        backToGames: findFieldValue(uiTextsSection, "backToGames"),
        platformsTitle: findFieldValue(uiTextsSection, "platformsTitle"),
        mediaTitleSmall: findFieldValue(uiTextsSection, "mediaTitleSmall"),
        mediaTitle: findFieldValue(uiTextsSection, "mediaTitle"),
        screenshotsTab: findFieldValue(uiTextsSection, "screenshotsTab"),
        artworksTab: findFieldValue(uiTextsSection, "artworksTab"),
        viewImage: findFieldValue(uiTextsSection, "viewImage"),
        wishlistTitle: findFieldValue(uiTextsSection, "wishlistTitle"),
        wishlistText: findFieldValue(uiTextsSection, "wishlistText"),
      },
    };
  }, [pageData]);

  const t = (value, fallback = "") => {
    return getLocalizedValue(value, language, fallback);
  };

  const game = useMemo(() => {
    return (
      content.games.find((item) => item.slug === slug) ||
      content.games[0] ||
      null
    );
  }, [content.games, slug]);

  const gameName = game ? t(game.name, game.slug) : "";

  const mediaItems = game?.media?.[activeTab] || [];
  const maxCarouselIndex = Math.max(mediaItems.length - 3, 0);

  const platformKeys = (game?.platforms || []).map((platform) => platform.key);

  const isComputerOnlyGame =
    (platformKeys.includes("steam") || platformKeys.includes("epic")) &&
    !platformKeys.includes("googleplay") &&
    !platformKeys.includes("appstore");

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setIsTabChanging(true);

    setTimeout(() => {
      setActiveTab(tab);
      setCarouselIndex(0);
      setIsTabChanging(false);
    }, 180);
  };

  const carouselPrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? maxCarouselIndex : prev - 1));
  };

  const carouselNext = () => {
    setCarouselIndex((prev) => (prev >= maxCarouselIndex ? 0 : prev + 1));
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const goNext = () => {
    setLightboxIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  if (!game) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6 text-center text-white">
        <div>
          <h1 className="text-3xl font-bold">Oyun bulunamadı.</h1>
          <Link
            to="/games"
            className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-[#c12030] hover:bg-[#c12030]"
          >
            <BsArrowLeft />
            Oyunlara Dön
          </Link>
        </div>
      </main>
    );
  }

  const heroImage = buildImageUrl(game.heroImage);
  const platformBgImage = buildImageUrl(game.platformBgImage);
  const backgroundImage = buildImageUrl(game.backgroundImage);
  const logoUrl = buildImageUrl(game.logo);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0d0d0d] text-white">
      <section className="relative min-h-screen w-full overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt={getImageAlt(game.heroImage, language, gameName)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-[#0d0d0d]/70 to-[#0d0d0d]" />

        <div className="relative z-10 flex min-h-screen items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-28 md:px-10 lg:px-12">
            <Link
              to="/games"
              className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/65 transition hover:text-white"
            >
              <BsArrowLeft />
              {t(content.uiTexts.backToGames, "Back to games")}
            </Link>

            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-400">
              {t(game.label)}
            </p>

            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${gameName} logo`}
                className="mb-6 max-h-28 w-auto"
              />
            ) : (
              <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
                {gameName}
              </h1>
            )}

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              {t(game.intro?.text)}
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-[#0d0d0d] py-24 md:py-32">
        {platformBgImage ? (
          <img
            src={platformBgImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40 saturate-110"
          />
        ) : null}

        <div className="absolute inset-0 bg-[#0d0d0d]/55" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0d0d0d] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center md:px-10 lg:px-12">
          <p className="text-sm uppercase tracking-[0.4em] text-white/50">
            {t(content.uiTexts.platformsTitle, "Available / Planned Platforms")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {(game.platforms || []).map((platform) => {
              const item = platformIcons[platform.key];
              if (!item) return null;

              const Wrapper = platform.href && platform.href !== "#" ? "a" : "div";

              return (
                <Wrapper
                  key={platform.id || platform.key}
                  href={platform.href && platform.href !== "#" ? platform.href : undefined}
                  target={platform.href && platform.href !== "#" ? "_blank" : undefined}
                  rel={platform.href && platform.href !== "#" ? "noreferrer" : undefined}
                  className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-white/[0.08]"
                >
                  <span className="text-2xl text-white/80 transition group-hover:text-yellow-400">
                    {item.icon}
                  </span>
                  <span className="text-sm uppercase tracking-[0.22em] text-white/75">
                    {item.label}
                  </span>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0d0d0d] py-24 md:py-32">
        <div className="absolute inset-0">
          {backgroundImage ? (
            <img
              src={backgroundImage}
              alt=""
              className="h-full w-full object-cover opacity-40"
            />
          ) : null}

          <div className="absolute inset-0 bg-[#0d0d0d]/65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0d0d0d_60%)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0d0d] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#d6a83a]">
              {t(game.intro?.label, "About The Game")}
            </p>

            <h2 className="mt-5 font-black uppercase leading-[0.95] tracking-wide text-white text-4xl md:text-6xl lg:text-7xl">
              {t(game.intro?.title)}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
              {t(game.intro?.text)}
            </p>

            <BrushDivider />
          </div>

          <div className="mt-20 space-y-24 md:mt-28 md:space-y-32">
            {(game.sections || []).map((section, index) => {
              const reverse = index % 2 !== 0;
              const sectionImage = buildImageUrl(section.image);

              return (
                <div
                  key={section.id || index}
                  className={`grid items-center gap-12 lg:gap-20 ${reverse
                    ? "lg:grid-cols-[0.8fr_1.2fr] lg:[&>*:first-child]:order-2"
                    : "lg:grid-cols-[1.2fr_0.8fr]"
                    }`}
                >
                  <BrushImage
                    src={sectionImage}
                    alt={getImageAlt(section.image, language, t(section.title))}
                    className="h-[300px] md:h-[430px] lg:h-[470px]"
                  />

                  <div className={reverse ? "lg:pr-8" : "lg:pl-4"}>
                    <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#d6a83a]">
                      {t(section.label)}
                    </p>

                    <h3 className="mt-5 max-w-xl font-black leading-[1.1] tracking-wide text-white text-2xl md:text-3xl lg:text-4xl">
                      {t(section.title)}
                    </h3>

                    <p className="mt-6 max-w-xl text-base leading-8 text-white/65 md:text-lg">
                      {t(section.text)}
                    </p>

                    <Link
                      to={section.buttonHref || "/games"}
                      className="group mt-8 inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.35em] text-[#d6a83a] transition hover:text-white"
                    >
                      {t(section.buttonText)}
                      <BsArrowRight className="text-lg transition duration-300 group-hover:translate-x-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-[#0d0d0d] py-24 md:py-32">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0d0d] to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#d6a83a]">
                {t(content.uiTexts.mediaTitleSmall, "Media")}
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-none md:text-5xl">
                {t(content.uiTexts.mediaTitle, "Screenshots & Artworks")}
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleTabChange("screenshots")}
                className={`rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] transition cursor-pointer ${activeTab === "screenshots"
                  ? "border-[#d6a83a] bg-[#d6a83a] text-black"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
                  }`}
              >
                {t(content.uiTexts.screenshotsTab, "Screenshots")}
              </button>

              <button
                onClick={() => handleTabChange("artworks")}
                className={`rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] transition cursor-pointer ${activeTab === "artworks"
                  ? "border-[#d6a83a] bg-[#d6a83a] text-black"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
                  }`}
              >
                {t(content.uiTexts.artworksTab, "Artworks")}
              </button>
            </div>
          </div>

          <div className="mt-14 flex items-center gap-4">
            <button
              onClick={carouselPrev}
              disabled={mediaItems.length <= 3}
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 md:flex cursor-pointer"
            >
              <BsArrowLeft />
            </button>

            <div className="w-full overflow-hidden">
              <div
                className={`flex gap-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isTabChanging
                  ? "translate-y-4 opacity-0 blur-sm"
                  : "translate-y-0 opacity-100 blur-0"
                  }`}
                style={{
                  transform: `translateX(-${carouselIndex * (100 / 3)}%)`,
                }}
              >
                {mediaItems.map((image, index) => {
                  const imageUrl = buildImageUrl(image);

                  return (
                    <div
                      key={`${activeTab}-${image.id || index}`}
                      className="w-full min-w-0 shrink-0 basis-full sm:basis-[calc((100%-20px)/2)] lg:basis-[calc((100%-40px)/3)]"
                    >
                      <button
                        onClick={() => openLightbox(index)}
                        className="group relative h-[240px] w-full overflow-hidden rounded-xl bg-white/[0.03] text-left md:h-[280px] cursor-pointer"
                      >
                        <img
                          src={imageUrl}
                          alt={getImageAlt(
                            image,
                            language,
                            `${gameName} ${activeTab} ${index + 1}`
                          )}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/25" />

                        <div className="absolute bottom-4 left-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                            {t(content.uiTexts.viewImage, "View Image")}
                          </p>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={carouselNext}
              disabled={mediaItems.length <= 3}
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 md:flex cursor-pointer"
            >
              <BsArrowRight />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 md:hidden">
            <button
              onClick={carouselPrev}
              disabled={mediaItems.length <= 3}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 cursor-pointer"
            >
              <BsArrowLeft />
            </button>

            <button
              onClick={carouselNext}
              disabled={mediaItems.length <= 3}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 cursor-pointer"
            >
              <BsArrowRight />
            </button>
          </div>
        </div>
      </section>

      {isComputerOnlyGame && (
        <section className="relative overflow-hidden bg-[#0d0d0d] py-24 md:py-32">
          {platformBgImage ? (
            <img
              src={platformBgImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40 saturate-110"
            />
          ) : null}

          <div className="absolute inset-0 bg-[#0d0d0d]/55" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0d0d0d] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 text-center md:px-10 lg:px-12">
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">
              {t(content.uiTexts.wishlistTitle, "Add Wishlist")}
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              {t(
                content.uiTexts.wishlistText,
                "Follow {{gameName}} on your favorite PC platform and be ready when the game becomes available."
              ).replace("{{gameName}}", gameName)}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              {(game.platforms || [])
                .filter(
                  (platform) =>
                    platform.key === "steam" || platform.key === "epic"
                )
                .map((platform) => {
                  const item = platformIcons[platform.key];
                  if (!item) return null;

                  return (
                    <a
                      key={platform.id || platform.key}
                      href={platform.href || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-white/[0.08]"
                    >
                      <span className="text-2xl text-white/80 transition group-hover:text-yellow-400">
                        {item.icon}
                      </span>
                      <span className="text-sm uppercase tracking-[0.22em] text-white/75">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {lightboxIndex !== null && mediaItems.length > 0 && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 px-5">
          <button
            onClick={closeLightbox}
            className="absolute right-6 top-6 z-20 text-4xl text-white/70 transition hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <IoClose />
          </button>

          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-2xl text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white md:left-8 cursor-pointer"
            aria-label="Previous image"
          >
            <BsArrowLeft />
          </button>

          <img
            src={buildImageUrl(mediaItems[lightboxIndex])}
            alt={getImageAlt(
              mediaItems[lightboxIndex],
              language,
              `${gameName} media ${lightboxIndex + 1}`
            )}
            className="max-h-[82vh] max-w-[92vw] rounded-xl object-contain"
          />

          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-2xl text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white md:right-8 cursor-pointer"
            aria-label="Next image"
          >
            <BsArrowRight />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/50">
            {lightboxIndex + 1} / {mediaItems.length}
          </div>
        </div>
      )}
    </main>
  );
};

export default GameDetailPage;