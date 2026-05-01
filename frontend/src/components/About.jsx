import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL;

const getLocalizedValue = (value, language, fallback = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] ?? value.tr ?? value.en ?? fallback;
  }

  return value ?? fallback;
};

const findSection = (sections, sectionId) => {
  return sections.find((section) => section?.id === sectionId);
};

const findFieldValue = (section, fieldId) => {
  if (!section || !Array.isArray(section.fields)) return null;

  return section.fields.find((field) => field.id === fieldId)?.value ?? null;
};

function About() {
  const { language } = useLanguage();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pages/About`);
        const data = await res.json();

        if (!res.ok || !data) {
          throw new Error(data?.error || "About verisi alınamadı.");
        }

        setPageData(data);
      } catch (error) {
        console.error("About data error:", error);
        setPageData(null);
      }
    };

    fetchAbout();
  }, []);

  const content = useMemo(() => {
    const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];

    const statementSection = findSection(sections, "statement");
    const featuresSection = findSection(sections, "features");
    const footerSection = findSection(sections, "footer");

    return {
      statement: {
        titleLineOne: findFieldValue(statementSection, "titleLineOne"),
        titleLineTwo: findFieldValue(statementSection, "titleLineTwo"),
        description: findFieldValue(statementSection, "description"),
      },
      features: findFieldValue(featuresSection, "items") || [],
      footer: {
        locationText: findFieldValue(footerSection, "locationText"),
      },
    };
  }, [pageData]);

  const t = (value, fallback = "") => {
    return getLocalizedValue(value, language, fallback);
  };

  return (
    <section className="w-full bg-[#0d0d0d] text-white py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-[34px] md:text-[52px] leading-[1.2] font-semibold tracking-tight"
        >
          {t(content.statement.titleLineOne, "We don’t just build games.")}
          <br />
          <span className="text-white/40">
            {t(
              content.statement.titleLineTwo,
              "We craft controlled experiences."
            )}
          </span>
        </motion.h2>

        <div className="w-20 h-[2px] bg-[#c12030] mt-8" />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-10 max-w-[600px] text-white/60 text-[16px] leading-relaxed"
        >
          {t(
            content.statement.description,
            "We are a small, focused team building PC and mobile games with a strong emphasis on gameplay clarity, system design, and performance. No unnecessary complexity. No noise."
          )}
        </motion.p>

        <div className="w-full h-px bg-white/10 my-16" />

        <div className="grid md:grid-cols-2 gap-16">
          {content.features.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-medium mb-4">
                {t(item.title)}
              </h3>

              <p className="text-white/60 leading-relaxed text-[15px]">
                {t(item.text)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 flex items-center justify-between text-white/40 text-sm"
        >
          <span></span>
          <span>{t(content.footer.locationText, "Based in Türkiye")}</span>
        </motion.div>
      </div>
    </section>
  );
}

export default About;