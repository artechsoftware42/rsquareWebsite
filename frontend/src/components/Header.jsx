import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Link } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiArrowUpRight,
  FiSend,
  FiChevronDown,
  FiGlobe,
} from "react-icons/fi";
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

const getActionIcon = (icon) => {
  if (icon === "send") return <FiSend className="text-[17px]" />;

  return <FiArrowUpRight className="text-[17px]" />;
};

export default function Header() {
  const { language, changeLanguage } = useLanguage();

  const [pageData, setPageData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [mobileGamesOpen, setMobileGamesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.scrollY > 40;
  });

  const langRef = useRef(null);
  const gamesRef = useRef(null);

  useEffect(() => {
    const fetchHeader = async () => {
      const data = await fetchJson(`${API_BASE}/api/pages/Header`);
      if (!data) return;

      setPageData(data);
    };

    fetchHeader();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }

      if (gamesRef.current && !gamesRef.current.contains(e.target)) {
        setGamesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const content = useMemo(() => {
    const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];

    const brandingSection = findSection(sections, "branding");
    const navigationSection = findSection(sections, "navigation");
    const gamesDropdownSection = findSection(sections, "gamesDropdown");
    const actionsSection = findSection(sections, "actions");
    const languagesSection = findSection(sections, "languages");
    const mobileMenuSection = findSection(sections, "mobileMenu");

    return {
      branding: {
        lightLogo: findFieldValue(brandingSection, "lightLogo"),
        darkLogo: findFieldValue(brandingSection, "darkLogo"),
      },
      navigation: {
        navLinks: findFieldValue(navigationSection, "navLinks") || [],
      },
      gamesDropdown: {
        title: findFieldValue(gamesDropdownSection, "title"),
        gameItems: findFieldValue(gamesDropdownSection, "gameItems") || [],
      },
      actions: {
        items: findFieldValue(actionsSection, "items") || [],
      },
      languages: {
        desktopTitle: findFieldValue(languagesSection, "desktopTitle"),
        mobileTitle: findFieldValue(languagesSection, "mobileTitle"),
        selectedText: findFieldValue(languagesSection, "selectedText"),
        items: findFieldValue(languagesSection, "items") || [],
      },
      mobileMenu: {
        navigationTitle: findFieldValue(mobileMenuSection, "navigationTitle"),
        menuTitle: findFieldValue(mobileMenuSection, "menuTitle"),
        quickAccessTitle: findFieldValue(mobileMenuSection, "quickAccessTitle"),
      },
    };
  }, [pageData]);

  const t = (value, fallback = "") => {
    return getLocalizedValue(value, language, fallback);
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setLangOpen(false);
    setGamesOpen(false);
    setMobileGamesOpen(false);
  };

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setLangOpen(false);
    setMenuOpen(false);
  };

  const currentLogoValue = scrolled
    ? content.branding.darkLogo
    : content.branding.lightLogo;

  const currentLogo = buildImageUrl(currentLogoValue);

  const logoAlt =
    currentLogoValue && typeof currentLogoValue === "object"
      ? t(currentLogoValue.alt, "RSquare Studio Logo")
      : "RSquare Studio Logo";

  const selectedLanguage =
    content.languages.items.find((item) => item.code === language) ||
    content.languages.items[0] || {
      code: language,
      short: language?.toUpperCase?.() || "TR",
      label: {
        tr: "Türkçe",
        en: "Turkish",
        fr: "Turc",
        ru: "Турецкий",
      },
    };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: "easeOut", staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      y: -12,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.24, ease: "easeOut" },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: 14,
      scale: 0.96,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.24,
        ease: "easeOut",
        staggerChildren: 0.045,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.97,
      filter: "blur(5px)",
      transition: { duration: 0.18, ease: "easeInOut" },
    },
  };

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const mobileGamesVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -8,
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.26,
        ease: "easeOut",
        staggerChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -8,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const textColor = scrolled ? "text-[#231f20]" : "text-[#fff]";

  const linkBase = `group relative inline-flex items-center cursor-pointer text-[16px] xl:text-[17px] font-medium transition-all duration-300 ${textColor}`;

  const underline =
    "after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#c12030] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        : "bg-transparent backdrop-blur-0"
        }`}
    >
      <div className="mx-auto flex h-[80px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex shrink-0 items-center">
          <Link
            to="/"
            onClick={closeMenus}
            className="hidden lg:flex items-center cursor-pointer"
          >
            {currentLogo ? (
              <img
                src={currentLogo}
                alt={logoAlt}
                className="h-[56px] xl:h-[64px] w-auto object-contain select-none transition-all duration-300"
                draggable={false}
              />
            ) : null}
          </Link>

          <Link
            to="/"
            onClick={closeMenus}
            className="flex lg:hidden items-center cursor-pointer"
          >
            {currentLogo ? (
              <img
                src={currentLogo}
                alt={logoAlt}
                className="h-[40px] sm:h-[46px] w-auto object-contain select-none transition-all duration-300"
                draggable={false}
              />
            ) : null}
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-9 2xl:gap-11 absolute left-1/2 -translate-x-1/2">
          {content.navigation.navLinks.map((item) => {
            if (item.hasDropdown) {
              return (
                <div
                  key={item.id}
                  ref={gamesRef}
                  className="relative"
                  onMouseEnter={() => setGamesOpen(true)}
                  onMouseLeave={() => setGamesOpen(false)}
                >
                  <NavLink
                    to={item.href}
                    onClick={closeMenus}
                    className={`${linkBase} ${underline} gap-1.5`}
                  >
                    <span>{t(item.text)}</span>
                    <motion.span
                      animate={{ rotate: gamesOpen ? 180 : 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="flex items-center justify-center"
                    >
                      <FiChevronDown className="text-[15px]" />
                    </motion.span>
                  </NavLink>

                  <AnimatePresence>
                    {gamesOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-1/2 top-[calc(100%+18px)] w-[260px] -translate-x-1/2 overflow-hidden rounded-[24px] border border-white/40 bg-white/90 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
                      >
                        <div className="px-4 py-3 border-b border-black/5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40">
                            {t(content.gamesDropdown.title, "Our Games")}
                          </p>
                        </div>

                        <div className="pt-2">
                          {content.gamesDropdown.gameItems.map((game) => (
                            <motion.div
                              key={game.id}
                              variants={dropdownItemVariants}
                            >
                              <NavLink
                                to={game.href}
                                onClick={closeMenus}
                                className="group flex items-center justify-between rounded-[18px] px-4 py-3 text-[14px] font-medium text-[#231f20] transition-all duration-300 hover:bg-[#231f20] hover:text-white"
                              >
                                <span>{t(game.text)}</span>
                                <FiArrowUpRight className="text-[15px] opacity-0 transition-all duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:opacity-100" />
                              </NavLink>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <NavLink
                key={item.id}
                to={item.href}
                onClick={closeMenus}
                className={`${linkBase} ${underline}`}
              >
                {t(item.text)}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden xl:flex items-center gap-6 2xl:gap-7">
          {content.actions.items.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              onClick={closeMenus}
              className={`${linkBase} gap-2 ${underline}`}
            >
              <span>{t(item.text)}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                {getActionIcon(item.icon)}
              </span>
            </NavLink>
          ))}

          <div ref={langRef} className="relative ml-1 cursor-pointer">
            <button
              type="button"
              onClick={() => setLangOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-2 py-1 text-[15px] cursor-pointer transition-all duration-300 ${linkBase}`}
            >
              <FiGlobe className="text-[16px]" />
              <span className="font-semibold">{selectedLanguage.short}</span>
              <motion.span
                animate={{ rotate: langOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <FiChevronDown className="text-[15px]" />
              </motion.span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+14px)] min-w-[180px] overflow-hidden rounded-[22px] border border-white/40 bg-white/85 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
                >
                  <div className="border-b border-black/5 px-4 py-3">
                    <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                      <FiGlobe className="text-[13px]" />
                      {t(content.languages.desktopTitle, "Language")}
                    </div>
                  </div>

                  <div className="p-2">
                    {content.languages.items.map((lang) => {
                      const isActiveLang = language === lang.code;

                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-[14px] font-medium transition-all duration-200 ${isActiveLang
                            ? "bg-[#231f20] text-white shadow-[0_10px_24px_rgba(35,31,32,0.18)]"
                            : "text-[#231f20] hover:bg-black/5"
                            }`}
                        >
                          <span>{lang.short}</span>
                          {isActiveLang && (
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
                              {t(content.languages.selectedText, "Selected")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          className={`xl:hidden relative z-[70] flex cursor-pointer items-center justify-center transition-colors duration-300 ${scrolled ? "text-[#231f20]" : "text-white"
            }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "menu"}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center justify-center transition-colors duration-300 ${scrolled ? "text-[#231f20]" : "text-white"
                }`}
            >
              {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="xl:hidden"
          >
            <div className="mx-4 sm:mx-6 mt-1 overflow-hidden rounded-[28px] border border-white/10 bg-[#231f20] text-white shadow-[0_25px_70px_rgba(0,0,0,0.2)]">
              <div className="px-6 sm:px-7 py-7 sm:py-8">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                    {t(content.mobileMenu.navigationTitle, "Navigation")}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
                    {t(content.mobileMenu.menuTitle, "Menu")}
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  {content.navigation.navLinks.map((item) => {
                    if (item.hasDropdown) {
                      return (
                        <motion.div key={item.id} variants={itemVariants}>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileGamesOpen((prev) => !prev)
                            }
                            className="group flex w-full cursor-pointer items-center justify-between"
                          >
                            <span className="relative inline-flex items-center gap-2 text-[22px] font-medium text-white">
                              {t(item.text)}
                              <motion.span
                                animate={{
                                  rotate: mobileGamesOpen ? 180 : 0,
                                }}
                                transition={{
                                  duration: 0.22,
                                  ease: "easeOut",
                                }}
                              >
                                <FiChevronDown className="text-[18px]" />
                              </motion.span>
                              <span className="absolute left-0 -bottom-1.5 h-[2px] w-full origin-left scale-x-0 bg-[#c12030] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                            </span>
                            <FiArrowUpRight className="text-white transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                          </button>

                          <AnimatePresence>
                            {mobileGamesOpen && (
                              <motion.div
                                variants={mobileGamesVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="overflow-hidden"
                              >
                                <div className="mt-4 ml-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-2">
                                  {content.gamesDropdown.gameItems.map(
                                    (game) => (
                                      <motion.div
                                        key={game.id}
                                        variants={dropdownItemVariants}
                                      >
                                        <NavLink
                                          to={game.href}
                                          onClick={closeMenus}
                                          className="group flex items-center justify-between rounded-[16px] px-4 py-3 text-[15px] font-medium text-white/78 transition-all duration-300 hover:bg-white/8 hover:text-white"
                                        >
                                          <span>{t(game.text)}</span>
                                          <FiArrowUpRight className="text-[15px] opacity-50 transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:opacity-100" />
                                        </NavLink>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div key={item.id} variants={itemVariants}>
                        <NavLink
                          to={item.href}
                          onClick={closeMenus}
                          className="group flex cursor-pointer items-center justify-between"
                        >
                          <span className="relative inline-block text-[22px] font-medium text-white">
                            {t(item.text)}
                            <span className="absolute left-0 -bottom-1.5 h-[2px] w-full origin-left scale-x-0 bg-[#c12030] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                          </span>
                          <FiArrowUpRight className="text-white transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="my-7 h-px w-full bg-white/10" />

                <div className="mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                    {t(content.mobileMenu.quickAccessTitle, "Quick Access")}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {content.actions.items.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <NavLink
                        to={item.href}
                        onClick={closeMenus}
                        className="group flex cursor-pointer items-center justify-between"
                      >
                        <span className="relative inline-flex items-center gap-2 text-[17px] font-medium text-white">
                          {t(item.text)}
                          <span className="absolute left-0 -bottom-1.5 h-[2px] w-full origin-left scale-x-0 bg-[#c12030] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                        </span>
                        <span className="text-white transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                          {getActionIcon(item.icon)}
                        </span>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                <div className="my-7 h-px w-full bg-white/10" />

                <motion.div variants={itemVariants}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <FiGlobe />
                    <span>{t(content.languages.mobileTitle, "Language")}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {content.languages.items.map((lang) => {
                      const isActiveLang = language === lang.code;

                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ${isActiveLang
                            ? "border-[#c12030] bg-[#c12030] text-white"
                            : "border-white/15 bg-white/5 text-white hover:border-[#c12030]"
                            }`}
                        >
                          {lang.short}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}