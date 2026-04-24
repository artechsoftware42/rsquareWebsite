import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL;

function Publish() {
    const { language } = useLanguage();
    const [isTitleHovered, setIsTitleHovered] = useState(false);
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        const fetchPublish = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/pages/Publish`);
                const data = await res.json();
                setPageData(data);
            } catch (error) {
                console.error("Publish data error:", error);
            }
        };

        fetchPublish();
    }, []);

    const content = useMemo(() => {
        const sections = pageData?.sections || [];

        const heroFields =
            sections.find((section) => section.id === "publishHero")?.fields || [];

        const stepFields =
            sections.find((section) => section.id === "publishSteps")?.fields || [];

        const getHeroField = (id) => heroFields.find((field) => field.id === id)?.value;
        const getStepField = (id) => stepFields.find((field) => field.id === id)?.value;

        return {
            eyebrow: getHeroField("eyebrow")?.[language] || "",
            titleLines: getHeroField("titleLines") || [],
            description: getHeroField("description")?.[language] || "",
            buttonText: getHeroField("button")?.text?.[language] || "",
            buttonHref: getHeroField("button")?.href || "/contact",
            steps: getStepField("steps") || [],
        };
    }, [pageData, language]);

    const letterVariants = {
        initial: {
            color: "#ffffff",
        },
        hover: (i) => ({
            color: "#c12030",
            transition: {
                duration: 0.22,
                delay: i * 0.015,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
        rest: (i) => ({
            color: "#ffffff",
            transition: {
                duration: 0.18,
                delay: i * 0.008,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
    };

    let globalIndex = 0;

    return (
        <section className="relative w-full overflow-hidden bg-[#0d0d0d] text-white">
            <div className="pointer-events-none absolute inset-0" />

            <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col justify-center px-6 py-20 sm:px-8 md:px-10 lg:px-16">
                <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65 }}
                        viewport={{ once: true, amount: 0.4 }}
                        className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/36"
                    >
                        {content.eyebrow}
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.05 }}
                        viewport={{ once: true, amount: 0.35 }}
                        onMouseEnter={() => setIsTitleHovered(true)}
                        onMouseLeave={() => setIsTitleHovered(false)}
                        className="mt-6 cursor-default text-[44px] font-semibold leading-[0.92] tracking-[-0.055em] sm:text-[58px] md:text-[78px] lg:text-[102px] xl:text-[120px]"
                    >
                        {content.titleLines.map((line, lineIndex) => (
                            <span key={line.id || lineIndex} className="block">
                                {(line.text?.[language] || "").split("").map((char, charIndex) => {
                                    const currentIndex = globalIndex++;

                                    return (
                                        <motion.span
                                            key={`${lineIndex}-${charIndex}`}
                                            custom={currentIndex}
                                            variants={letterVariants}
                                            initial="initial"
                                            animate={isTitleHovered ? "hover" : "rest"}
                                            className="inline-block whitespace-pre"
                                        >
                                            {char === " " ? "\u00A0" : char}
                                        </motion.span>
                                    );
                                })}
                            </span>
                        ))}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        viewport={{ once: true, amount: 0.35 }}
                        className="mt-8 max-w-[650px] text-[15px] leading-7 text-white/60 sm:text-[16px] md:text-[17px]"
                    >
                        {content.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.16 }}
                        viewport={{ once: true, amount: 0.35 }}
                        className="mt-10"
                    >
                        <a
                            href={content.buttonHref}
                            className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0d0d0d] transition-all duration-300 hover:scale-[1.02]"
                        >
                            {content.buttonText}
                            <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.12 }}
                    viewport={{ once: true, amount: 0.25 }}
                    className="mx-auto mt-20 w-full max-w-[1100px] border-t border-white/10 pt-10"
                >
                    <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                        {content.steps.map((item) => (
                            <div key={item.id} className="flex flex-col items-center justify-center">
                                <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">
                                    {item.title?.[language]}
                                </p>
                                <p className="mt-3 text-[18px] font-medium tracking-[-0.02em] text-white/88">
                                    {item.text?.[language]}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Publish;