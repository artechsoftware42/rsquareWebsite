import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL;

function Footer() {
    const { language } = useLanguage();
    const [isBrandHovered, setIsBrandHovered] = useState(false);
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/pages/Footer`);
                const data = await res.json();
                setPageData(data);
            } catch (error) {
                console.error("Footer data error:", error);
            }
        };

        fetchFooter();
    }, []);

    const content = useMemo(() => {
        const sections = pageData?.sections || [];

        const contactFields = sections.find((section) => section.id === "contact")?.fields || [];
        const linksFields = sections.find((section) => section.id === "links")?.fields || [];
        const brandFields = sections.find((section) => section.id === "brand")?.fields || [];
        const socialFields = sections.find((section) => section.id === "social")?.fields || [];
        const bottomFields = sections.find((section) => section.id === "bottom")?.fields || [];

        const getContactField = (id) => contactFields.find((field) => field.id === id)?.value;
        const getLinksField = (id) => linksFields.find((field) => field.id === id)?.value;
        const getBrandField = (id) => brandFields.find((field) => field.id === id)?.value;
        const getSocialField = (id) => socialFields.find((field) => field.id === id)?.value;
        const getBottomField = (id) => bottomFields.find((field) => field.id === id)?.value;

        return {
            eyebrow: getContactField("eyebrow")?.[language] || "",
            title: getContactField("title")?.[language] || "",
            description: getContactField("description")?.[language] || "",
            buttonText: getContactField("button")?.text?.[language] || "",
            buttonHref: getContactField("button")?.href || "/contact",
            groups: getLinksField("groups") || [],
            logo: getBrandField("logo")?.url || "",
            logoAlt: getBrandField("logo")?.alt?.[language] || "Logo",
            brandText: getBrandField("brandText") || "#RSQUARE",
            socialLinks: getSocialField("socialLinks") || [],
            copyright: getBottomField("copyright")?.[language] || "",
            bottomItems: getBottomField("items") || [],
        };
    }, [pageData, language]);

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

    const getSocialIcon = (id) => {
        if (id === "linkedin") return <FaLinkedinIn className="text-[18px] transition-transform duration-300 group-hover:-translate-y-[1px]" />;
        if (id === "instagram") return <FaInstagram className="text-[18px] transition-transform duration-300 group-hover:-translate-y-[1px]" />;
        if (id === "twitter" || id === "x") return <FaXTwitter className="text-[18px] transition-transform duration-300 group-hover:-translate-y-[1px]" />;
        return null;
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
                            {content.eyebrow}
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.05 }}
                            viewport={{ once: true }}
                            className="mt-6 max-w-[880px] text-[44px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[24px] md:text-[34px] lg:text-[44px]"
                        >
                            {content.title}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="mt-6 max-w-[560px] text-[15px] leading-7 text-white/58 sm:text-[16px]"
                        >
                            {content.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.14 }}
                            viewport={{ once: true }}
                            className="mt-10"
                        >
                            <a
                                href={content.buttonHref}
                                className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0d0d0d]"
                            >
                                {content.buttonText}
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                            </a>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-3">
                        {content.groups.map((group) => (
                            <FooterGroup
                                key={group.id}
                                title={group.title?.[language] || ""}
                                links={group.links || []}
                                language={language}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
                    <div className="lg:col-span-3">
                        {content.logo && (
                            <motion.img
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.65 }}
                                viewport={{ once: true }}
                                src={content.logo}
                                alt={content.logoAlt}
                                className="h-10 w-auto sm:h-12 md:h-14"
                                draggable={false}
                            />
                        )}
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
                                {content.brandText.split("").map((char, index) => (
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
                            {content.socialLinks.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.id}
                                    className="group inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-white/60 transition-colors duration-300 hover:text-[#c12030]"
                                >
                                    {getSocialIcon(social.id)}
                                </a>
                            ))}
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-[12px] uppercase tracking-[0.18em] text-white/34">
                            {content.copyright}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-[12px] uppercase tracking-[0.18em] text-white/24">
                            {content.bottomItems.map((item, index) => (
                                <React.Fragment key={item.id || index}>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="transition-colors duration-300 hover:text-[#c12030]"
                                        >
                                            {item.text?.[language]}
                                        </a>
                                    ) : (
                                        <span>{item.text?.[language]}</span>
                                    )}

                                    {index !== content.bottomItems.length - 1 && (
                                        <span className="hidden md:inline-block">•</span>
                                    )}
                                </React.Fragment>
                            ))}
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
                {links.map((link, index) => (
                    <a
                        key={link.id || index}
                        href={link.href}
                        className="group relative inline-flex w-fit text-[14px] leading-6 text-white/68 transition-colors duration-300 hover:text-[#c12030]"
                    >
                        <span>{link.label?.[language]}</span>
                        <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[#c12030] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </a>
                ))}
            </div>
        </motion.div>
    );
}

export default Footer;