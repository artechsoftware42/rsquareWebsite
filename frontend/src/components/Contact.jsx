import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import { fetchJson } from "../utils/fetchJson";

const API_BASE = import.meta.env.VITE_API_URL;

function Contact() {
    const { language } = useLanguage();
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const data = await fetchJson(`${API_BASE}/api/pages/About`);
                if (!data) return;
                setPageData(data);
            } catch (error) {
                console.error("Contact data error:", error);
            }
        };

        fetchContact();
    }, []);

    const content = useMemo(() => {
        const fields = pageData?.sections?.[0]?.fields || [];

        const getField = (id) => fields.find((field) => field.id === id)?.value;

        return {
            eyebrow: getField("eyebrow")?.[language] || "",
            title: getField("title")?.[language] || "",
            description: getField("description")?.[language] || "",
            buttonText: getField("button")?.text?.[language] || "",
            buttonHref: getField("button")?.href || "/contact",
        };
    }, [pageData, language]);

    return (
        <section className="w-full bg-[#0d0d0d] text-white">
            <div className="mx-auto w-full max-w-[1500px] px-6 py-20 sm:px-8 md:px-10 lg:px-16 lg:py-28">
                <div className="border-t border-white/10 pt-10">
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
                        initial={{ opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        viewport={{ once: true }}
                        className="mt-6 max-w-[900px] text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[44px] md:text-[56px]"
                    >
                        {content.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="mt-6 max-w-[520px] text-[15px] leading-7 text-white/60 sm:text-[16px]"
                    >
                        {content.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
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
            </div>
        </section>
    );
}

export default Contact;