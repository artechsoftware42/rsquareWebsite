import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
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

const getSocialIcon = (icon) => {
    if (icon === "linkedin") return <FaLinkedinIn className="text-[18px] transition-transform duration-300 group-hover:-translate-y-[1px]" />;
    if (icon === "instagram") return <FaInstagram className="text-[18px] transition-transform duration-300 group-hover:-translate-y-[1px]" />;
    if (icon === "x") return <FaXTwitter className="text-[18px] transition-transform duration-300 group-hover:-translate-y-[1px]" />;

    return null;
};

function Footer() {
    const { language } = useLanguage();

    const [pageData, setPageData] = useState(null);
    const [isBrandHovered, setIsBrandHovered] = useState(false);

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const data = await fetchJson(`${API_BASE}/api/pages/Footer`);
                if (!data) return;

                setPageData(data);
            } catch (error) {
                console.error("Footer data error:", error);
                setPageData(null);
            }
        };

        fetchFooter();
    }, []);

    const content = useMemo(() => {
        const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];

        const contactSection = findSection(sections, "contact");
        const linkGroupsSection = findSection(sections, "linkGroups");
        const brandSection = findSection(sections, "brand");
        const bottomSection = findSection(sections, "bottom");

        return {
            contact: {
                eyebrow: findFieldValue(contactSection, "eyebrow"),
                title: findFieldValue(contactSection, "title"),
                description: findFieldValue(contactSection, "description"),
                button: findFieldValue(contactSection, "button") || {},
            },
            linkGroups: findFieldValue(linkGroupsSection, "items") || [],
            brand: {
                logo: findFieldValue(brandSection, "logo"),
                brandText: findFieldValue(brandSection, "brandText") || "#RSQUARE",
                socialLinks: findFieldValue(brandSection, "socialLinks") || [],
            },
            bottom: {
                copyright: findFieldValue(bottomSection, "copyright"),
                studioName: findFieldValue(bottomSection, "studioName"),
                studioDescription: findFieldValue(bottomSection, "studioDescription"),
                privacyLink: findFieldValue(bottomSection, "privacyLink") || {},
            },
        };
    }, [pageData]);

    const t = (value, fallback = "") => {
        return getLocalizedValue(value, language, fallback);
    };

    const logoUrl = buildImageUrl(content.brand.logo);
    const logoAlt = getImageAlt(content.brand.logo, language, "RSQUARE Logo");
    const brandText = content.brand.brandText || "#RSQUARE";

    const letterVariants = {
        initial: {
            color: "#ffffff",
        },
        hover: (i) => ({
            color: "#c12030",
            transition: {
                duration: 0.2,
                delay: i * 0.018,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
        rest: (i) => ({
            color: "#ffffff",
            transition: {
                duration: 0.16,
                delay: i * 0.01,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
    };

    return (
        <footer className="w-full overflow-hidden bg-[#0d0d0d] text-white">
            <div className="mx-auto w-full max-w-[1500px] px-6 py-14 sm:px-8 md:px-10 lg:px-16 lg:py-16">
                <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-10 lg:grid-cols-12 lg:gap-10 lg:pt-14">
                    <div className="lg:col-span-7">
                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-[11px] uppercase tracking-[0.32em] text-white/38"
                        >
                            {t(content.contact.eyebrow, "Contact")}
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.05 }}
                            viewport={{ once: true }}
                            className="mt-6 max-w-[880px] text-[44px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[24px] md:text-[34px] lg:text-[44px]"
                        >
                            {t(content.contact.title, "Get in touch for collaborations.")}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="mt-6 max-w-[560px] text-[15px] leading-7 text-white/58 sm:text-[16px]"
                        >
                            {t(
                                content.contact.description,
                                "Whether you want to work with us or simply start a conversation, we’re always open to hearing from you."
                            )}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.14 }}
                            viewport={{ once: true }}
                            className="mt-10"
                        >
                            <Link
                                to={content.contact.button.href || "/contact"}
                                className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0d0d0d]"
                            >
                                {t(content.contact.button.text, "Contact Us")}
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                            </Link>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-3">
                        {content.linkGroups.map((group) => (
                            <FooterGroup
                                key={group.id}
                                title={t(group.title)}
                                links={group.links || []}
                                language={language}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
                    <div className="lg:col-span-3">
                        {logoUrl ? (
                            <motion.img
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.65 }}
                                viewport={{ once: true }}
                                src={logoUrl}
                                alt={logoAlt}
                                className="h-10 w-auto sm:h-12 md:h-14"
                                draggable={false}
                            />
                        ) : null}
                    </div>

                    <div className="lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.05 }}
                            viewport={{ once: true }}
                            onMouseEnter={() => setIsBrandHovered(true)}
                            onMouseLeave={() => setIsBrandHovered(false)}
                            className="inline-block cursor-default"
                        >
                            <h2 className="text-[52px] font-semibold leading-[0.9] tracking-[-0.09em] sm:text-[74px] md:text-[98px] lg:text-[118px] xl:text-[138px]">
                                {brandText.split("").map((char, index) => (
                                    <motion.span
                                        key={`${char}-${index}`}
                                        custom={index}
                                        variants={letterVariants}
                                        initial="initial"
                                        animate={isBrandHovered ? "hover" : "rest"}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </h2>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-3 lg:justify-self-end">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.08 }}
                            viewport={{ once: true }}
                            className="flex flex-wrap items-center gap-5 lg:justify-end"
                        >
                            {content.brand.socialLinks.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.href || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="group inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-white/60 transition-colors duration-300 hover:text-[#c12030]"
                                >
                                    {getSocialIcon(social.icon)}
                                </a>
                            ))}
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-[12px] uppercase tracking-[0.18em] text-white/34">
                            {t(
                                content.bottom.copyright,
                                "Copyright RSQUARE 2026. All rights reserved."
                            )}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-[12px] uppercase tracking-[0.18em] text-white/24">
                            <span>{t(content.bottom.studioName, "RSQUARE STUDIO")}</span>
                            <span className="hidden md:inline-block">•</span>
                            <span>
                                {t(
                                    content.bottom.studioDescription,
                                    "Independent Game Studio & Publisher"
                                )}
                            </span>

                            <span className="hidden md:inline-block">•</span>

                            <Link
                                to={content.bottom.privacyLink.href || "/privacy-policy"}
                                className="transition-colors duration-300 hover:text-[#c12030]"
                            >
                                {t(content.bottom.privacyLink.text, "Privacy")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterGroup({ title, links, language }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true }}
        >
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/34">
                {title}
            </p>

            <div className="mt-5 flex flex-col gap-3">
                {links.map((link) => (
                    <Link
                        key={link.id || link.href}
                        to={link.href || "#"}
                        className="group relative inline-flex w-fit text-[14px] leading-6 text-white/68 transition-colors duration-300 hover:text-[#c12030]"
                    >
                        <span>{getLocalizedValue(link.label, language, link.id)}</span>
                        <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[#c12030] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}

export default Footer;