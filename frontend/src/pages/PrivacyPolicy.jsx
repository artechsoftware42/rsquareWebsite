import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

const getLocalizedValue = (value, language = "tr", fallback = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] ?? value.tr ?? fallback;
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

function PrivacyPolicy() {
  const language = "tr";

  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pages/PrivacyPolicy`);
        const data = await res.json();

        if (!res.ok || !data) {
          throw new Error(data?.error || "PrivacyPolicy verisi alınamadı.");
        }

        setPageData(data);
      } catch (error) {
        console.error("PrivacyPolicy data error:", error);
        setPageData(null);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const content = useMemo(() => {
    const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];

    const heroSection = findSection(sections, "hero");
    const contentSection = findSection(sections, "content");
    const contactSection = findSection(sections, "contact");
    const actionsSection = findSection(sections, "actions");

    return {
      hero: {
        eyebrow: findFieldValue(heroSection, "eyebrow"),
        title: findFieldValue(heroSection, "title"),
        description: findFieldValue(heroSection, "description"),
      },
      policy: {
        tocTitle: findFieldValue(contentSection, "tocTitle"),
        sections: findFieldValue(contentSection, "sections") || [],
      },
      contact: {
        title: findFieldValue(contactSection, "title"),
        address: findFieldValue(contactSection, "address"),
      },
      actions: {
        homeButton: findFieldValue(actionsSection, "homeButton") || {},
      },
    };
  }, [pageData]);

  const t = (value, fallback = "") => {
    return getLocalizedValue(value, language, fallback);
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,32,48,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:px-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-[#c12030]">
            {t(content.hero.eyebrow, "RSquare Studio")}
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t(
              content.hero.title,
              "Kişisel Verilerin Korunmasına İlişkin Aydınlatma Metni"
            )}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 sm:text-lg">
            {t(
              content.hero.description,
              "RSquare Studio Yazılım Bilişim Teknolojileri Ltd. Şti. tarafından kişisel verilerin korunması ve işlenmesine ilişkin bilgilendirme metnidir."
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <p className="mb-4 text-sm font-semibold text-white/50">
              {t(content.policy.tocTitle, "İçindekiler")}
            </p>

            <nav className="space-y-3">
              {content.policy.sections.map((section, index) => (
                <a
                  key={section.id || index}
                  href={`#section-${index}`}
                  className="block text-sm leading-6 text-white/55 transition hover:text-[#c12030]"
                >
                  {t(section.title)}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-6">
          {content.policy.sections.map((section, index) => (
            <article
              key={section.id || index}
              id={`section-${index}`}
              className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
            >
              <h2 className="mb-5 text-2xl font-semibold tracking-tight text-white">
                {t(section.title)}
              </h2>

              {Array.isArray(section.content) && section.content.length > 0 && (
                <div className="space-y-4">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={paragraph.id || i}
                      className="text-sm leading-8 text-white/65 sm:text-base"
                    >
                      {t(paragraph.text)}
                    </p>
                  ))}
                </div>
              )}

              {Array.isArray(section.list) && section.list.length > 0 && (
                <ul className="space-y-3">
                  {section.list.map((item, i) => (
                    <li
                      key={item.id || i}
                      className="flex gap-3 text-sm leading-7 text-white/65 sm:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c12030]" />
                      <span>{t(item.text)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          <div className="rounded-3xl border border-[#c12030]/30 bg-[#c12030]/10 p-6 sm:p-8">
            <h2 className="mb-3 text-2xl font-semibold">
              {t(content.contact.title, "İletişim Bilgileri")}
            </h2>

            <p className="text-sm leading-8 text-white/70 sm:text-base">
              {t(
                content.contact.address,
                "Adres: Aşkan Mahallesi, Sancaktar Caddesi, 28/2, Meram/KONYA"
              )}
            </p>
          </div>

          <div className="flex justify-start pt-4">
            <Link
              to={content.actions.homeButton.href || "/"}
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-[#c12030] hover:bg-[#c12030] hover:text-white"
            >
              {t(content.actions.homeButton.text, "Anasayfaya Dön")}
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;