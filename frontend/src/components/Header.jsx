import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Link } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiArrowUpRight,
  FiChevronDown,
  FiGlobe,
} from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

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

const normalizeLanguages = (items, language) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => ({
    id: item.id ?? item._id ?? `lang-${index}`,
    code: (item.code || item.short || "").toLowerCase(),
    short: item.short || item.code?.toUpperCase() || "",
    label: getLocalizedValue(item.label, language, item.short || item.code || ""),
    flag: buildImageUrl(item.flag),
  }));
};

const normalizeNavItems = (items, language) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => ({
    id: item.id ?? item._id ?? `nav-${index}`,
    href: item.href || item.link || "#",
    text: getLocalizedValue(item.text ?? item.title, language, ""),
  }));
};

const normalizeActionItems = (items, language) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => ({
    id: item.id ?? item._id ?? `action-${index}`,
    href: item.href || item.link || "#",
    text: getLocalizedValue(item.text ?? item.title, language, ""),
  }));
};

const findSection = (sections, idOrName) => {
  return sections.find(
    (section) =>
      section?.id === idOrName ||
      section?.name?.toLowerCase() === idOrName.toLowerCase()
  );
};

const findFieldValue = (section, fieldId) => {
  if (!section) return null;

  if (Array.isArray(section.fields)) {
    return section.fields.find((field) => field.id === fieldId)?.value ?? null;
  }

  if (Array.isArray(section.contents)) {
    return section.contents.find((content) => content.key === fieldId)?.value ?? null;
  }

  return null;
};

export default function Header() {
  const { language, changeLanguage } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const [navItems, setNavItems] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [logo, setLogo] = useState(null);

  const desktopLangRef = useRef(null);
  const mobileLangRef = useRef(null);

  const closeMenus = () => {
    setMenuOpen(false);
    setDesktopLangOpen(false);
  };

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const API = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API}/api/pages/Header`);
        const data = await res.json();

        if (!res.ok || !data) {
          throw new Error(data?.error || "Header verisi alınamadı");
        }

        const sections = Array.isArray(data.sections) ? data.sections : [];

        const brandingSection =
          findSection(sections, "branding") || findSection(sections, "header");
        const navigationSection = findSection(sections, "navigation");
        const actionsSection = findSection(sections, "actions");
        const languageSection = findSection(sections, "languages");

        const logoValue =
          findFieldValue(brandingSection, "logo") ||
          findFieldValue(brandingSection, "logoImage");

        const navValue =
          findFieldValue(navigationSection, "navLinks") ||
          findFieldValue(navigationSection, "menuItems") ||
          [];

        const actionValue =
          findFieldValue(actionsSection, "actions") ||
          findFieldValue(actionsSection, "actionItems") ||
          findFieldValue(actionsSection, "supportButton") ||
          [];

        const languageValue =
          findFieldValue(languageSection, "languages") ||
          findFieldValue(brandingSection, "languages") ||
          [];

        setLogo(logoValue);
        setNavItems(navValue);
        setActionItems(Array.isArray(actionValue) ? actionValue : [actionValue]);
        setLanguages(languageValue);
      } catch (error) {
        console.error("Header fetch error:", error);
        setLogo(null);
        setNavItems([]);
        setActionItems([]);
        setLanguages([]);
      }
    };

    fetchHeader();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopLangRef.current && !desktopLangRef.current.contains(e.target)) {
        setDesktopLangOpen(false);
      }

      if (mobileLangRef.current && !mobileLangRef.current.contains(e.target)) {
        setMobileLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const normalizedNavItems = useMemo(() => {
    return normalizeNavItems(navItems, language);
  }, [navItems, language]);

  const normalizedActionItems = useMemo(() => {
    return normalizeActionItems(actionItems, language);
  }, [actionItems, language]);

  const normalizedLanguages = useMemo(() => {
    return normalizeLanguages(languages, language);
  }, [languages, language]);

  const selectedLanguage = useMemo(() => {
    return (
      normalizedLanguages.find((item) => item.code === language) ||
      normalizedLanguages[0] || {
        code: language,
        short: language.toUpperCase(),
        label: language.toUpperCase(),
        flag: "",
      }
    );
  }, [normalizedLanguages, language]);

  const logoUrl = useMemo(() => buildImageUrl(logo), [logo]);
  const logoAlt = useMemo(() => {
    if (logo && typeof logo === "object") {
      return getLocalizedValue(logo.alt, language, "Logo");
    }
    return "Logo";
  }, [logo, language]);

  const textColor = scrolled ? "text-[#231f20]" : "text-[#fff]";
  const linkBase = `group relative inline-flex items-center cursor-pointer text-[16px] xl:text-[17px] font-medium transition-all duration-300 ${textColor}`;
  const underline =
    "after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#c12030] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setDesktopLangOpen(false);
    setMobileLangOpen(true);
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        : "bg-transparent backdrop-blur-0"
        }`}
    >
      <div className="mx-auto flex h-[80px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex shrink-0 items-center">
          <Link to="/" onClick={closeMenus} className="flex items-center cursor-pointer">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={logoAlt}
                className="h-[40px] sm:h-[46px] lg:h-[56px] xl:h-[64px] w-auto object-contain select-none"
                draggable={false}
              />
            ) : null}
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-9 2xl:gap-11 absolute left-1/2 -translate-x-1/2">
          {normalizedNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              onClick={closeMenus}
              className={`${linkBase} ${underline}`}
            >
              {item.text}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-6 2xl:gap-7">
          {normalizedActionItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              onClick={closeMenus}
              className={`${linkBase} gap-2 ${underline}`}
            >
              <span>{item.text}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                <FiArrowUpRight className="text-[17px]" />
              </span>
            </NavLink>
          ))}

          <div
            ref={desktopLangRef}
            className="relative ml-1 cursor-pointer"
            onMouseEnter={() => setDesktopLangOpen(true)}
            onMouseLeave={() => setDesktopLangOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-2 px-2 py-1 text-[15px] cursor-pointer transition-all duration-300 ${linkBase}`}
            >
              <FiGlobe className="text-[16px]" />
              <span className="font-semibold">{selectedLanguage?.short}</span>
              <motion.span
                animate={{ rotate: desktopLangOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <FiChevronDown className="text-[15px]" />
              </motion.span>
            </button>

            <AnimatePresence>
              {desktopLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+14px)] min-w-[220px] overflow-hidden rounded-[22px] border border-white/40 bg-white/85 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
                >
                  <div className="border-b border-black/5 px-4 py-3">
                    <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                      <FiGlobe className="text-[13px]" />
                      Language
                    </div>
                  </div>

                  <div className="p-2">
                    {normalizedLanguages.map((lang) => {
                      const isActive = selectedLanguage?.code === lang.code;

                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-[14px] font-medium transition-all duration-200 ${isActive
                            ? "bg-[#231f20] text-white shadow-[0_10px_24px_rgba(35,31,32,0.18)]"
                            : "text-[#231f20] hover:bg-black/5"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            {lang.flag ? (
                              <img
                                src={lang.flag}
                                alt={lang.label}
                                className="w-7 h-5 object-cover rounded-[2px]"
                              />
                            ) : null}
                            <span>{lang.label}</span>
                          </div>

                          {isActive && (
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
                              Selected
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
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="xl:hidden"
          >
            <div className="mx-4 sm:mx-6 mt-1 overflow-hidden rounded-[28px] border border-white/10 bg-[#231f20] text-white shadow-[0_25px_70px_rgba(0,0,0,0.2)]">
              <div className="px-6 sm:px-7 py-7 sm:py-8">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                    Navigation
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
                    Menu
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  {normalizedNavItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                    >
                      <NavLink
                        to={item.href}
                        onClick={closeMenus}
                        className="group flex cursor-pointer items-center justify-between"
                      >
                        <span className="relative inline-block text-[22px] font-medium text-white">
                          {item.text}
                          <span className="absolute left-0 -bottom-1.5 h-[2px] w-full origin-left scale-x-0 bg-[#c12030] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                        </span>
                        <FiArrowUpRight className="text-white transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                <div className="my-7 h-px w-full bg-white/10" />

                <div className="mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                    Quick Access
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {normalizedActionItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                    >
                      <NavLink
                        to={item.href}
                        onClick={closeMenus}
                        className="group flex cursor-pointer items-center justify-between"
                      >
                        <span className="relative inline-flex items-center gap-2 text-[17px] font-medium text-white">
                          {item.text}
                          <span className="absolute left-0 -bottom-1.5 h-[2px] w-full origin-left scale-x-0 bg-[#c12030] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                        </span>
                        <span className="text-white transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                          <FiArrowUpRight className="text-[17px]" />
                        </span>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                <div className="my-7 h-px w-full bg-white/10" />

                <motion.div
                  ref={mobileLangRef}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <button
                    type="button"
                    onClick={() => setMobileLangOpen((prev) => !prev)}
                    className="mb-3 flex w-full items-center justify-between gap-2 text-sm font-semibold text-white"
                  >
                    <span className="flex items-center gap-2">
                      <FiGlobe />
                      <span>Language</span>
                    </span>
                    <FiChevronDown
                      className={`transition-transform duration-300 ${mobileLangOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileLangOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 pt-1">
                          {normalizedLanguages.map((lang) => {
                            const isActive = selectedLanguage?.code === lang.code;

                            return (
                              <button
                                key={lang.id}
                                type="button"
                                onClick={() => handleLanguageSelect(lang.code)}
                                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${isActive
                                  ? "border-[#c12030] bg-[#c12030] text-white"
                                  : "border-white/15 bg-white/5 text-white hover:border-[#c12030]"
                                  }`}
                              >
                                <span className="flex items-center gap-3">
                                  {lang.flag ? (
                                    <img
                                      src={lang.flag}
                                      alt={lang.label}
                                      className="w-7 h-5 object-cover rounded-[2px]"
                                    />
                                  ) : null}
                                  <span>{lang.label}</span>
                                </span>
                                <span>{lang.short}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}