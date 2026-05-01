import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { fetchJson } from "../utils/fetchJson";

const API_BASE = import.meta.env.VITE_API_URL;

function Partners() {
    const { language } = useLanguage();
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const data = await fetchJson(`${API_BASE}/api/pages/Partners`);
                if (!data) return;
                setPageData(data);
            } catch (error) {
                console.error("Partners data error:", error);
            }
        };

        fetchPartners();
    }, []);

    const content = useMemo(() => {
        const fields =
            pageData?.sections?.find((section) => section.id === "partnersContent")
                ?.fields || [];

        const getField = (id) => fields.find((field) => field.id === id)?.value;

        return {
            eyebrow: getField("eyebrow")?.[language] || "",
            partners: getField("partners") || [],
        };
    }, [pageData, language]);

    return (
        <section className="w-full bg-[#0d0d0d] text-white">
            <div className="mx-auto w-full max-w-[1500px] px-6 py-12 sm:px-8 md:px-10 md:py-14 lg:px-16 lg:py-16">
                <div className="pt-6 sm:pt-8">
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center text-[11px] uppercase tracking-[0.3em] text-white/38"
                    >
                        {content.eyebrow}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        viewport={{ once: true }}
                        className="mt-10 grid grid-cols-2 items-center gap-y-8 gap-x-6 sm:grid-cols-4"
                    >
                        {content.partners.map((partner) => (
                            <div key={partner.id || partner.name} className="flex items-center justify-center">
                                <div className="flex h-10 w-[120px] items-center justify-center sm:h-12 sm:w-[140px] md:h-14 md:w-[160px]">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        draggable={false}
                                        className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Partners;