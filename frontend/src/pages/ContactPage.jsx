import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowUpRight,
  FiChevronDown,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { sendContactMail } from "../services/formMailService";
import { fetchJson } from "../utils/fetchJson";

const API_BASE = import.meta.env.VITE_API_URL;

function ContactPage() {
  const { language } = useLanguage();

  const [pageData, setPageData] = useState(null);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [sending, setSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subjectType: "",
    message: "",
  });

  useEffect(() => {
    const fetchContactPage = async () => {
      try {
        const data = await fetchJson(`${API_BASE}/api/pages/ContactPage`);
        if (!data) return;
        setPageData(data);
      } catch (error) {
        console.error("ContactPage data error:", error);
      }
    };

    fetchContactPage();
  }, []);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const content = useMemo(() => {
    const sections = pageData?.sections || [];

    const heroFields = sections.find((section) => section.id === "hero")?.fields || [];
    const infoFields = sections.find((section) => section.id === "contactInfo")?.fields || [];
    const formFields = sections.find((section) => section.id === "form")?.fields || [];

    const getHeroField = (id) => heroFields.find((field) => field.id === id)?.value;
    const getInfoField = (id) => infoFields.find((field) => field.id === id)?.value;
    const getFormField = (id) => formFields.find((field) => field.id === id)?.value;

    return {
      eyebrow: getHeroField("eyebrow")?.[language] || "",
      title: getHeroField("title")?.[language] || "",
      description: getHeroField("description")?.[language] || "",

      infoItems: getInfoField("items") || [],

      firstName: getFormField("firstName") || {},
      lastName: getFormField("lastName") || {},
      email: getFormField("email") || {},
      subjectType: getFormField("subjectType") || {},
      message: getFormField("message") || {},
      privacy: getFormField("privacy") || {},
      submitButton: getFormField("submitButton") || {},
    };
  }, [pageData, language]);

  const getLocalized = (obj, fallback = "") => {
    return obj?.[language] || obj?.en || fallback;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = getLocalized(
        content.firstName.requiredMessage,
        "This field is required."
      );
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = getLocalized(
        content.lastName.requiredMessage,
        "This field is required."
      );
    }

    if (!formData.email.trim()) {
      newErrors.email = getLocalized(
        content.email.requiredMessage,
        "This field is required."
      );
    }

    if (!formData.subjectType) {
      newErrors.subjectType = getLocalized(
        content.subjectType.requiredMessage,
        "Please select a subject type."
      );
    }

    if (!formData.message.trim()) {
      newErrors.message = getLocalized(
        content.message.requiredMessage,
        "This field is required."
      );
    }

    setErrors(newErrors);
    setSubmitStatus(null);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setSending(true);

      await sendContactMail(formData);

      setSubmitStatus({
        type: "success",
        text: "Mesajınız başarıyla gönderildi.",
      });

      setCooldownSeconds(300);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subjectType: "",
        message: "",
      });

      setAgreementChecked(false);
    } catch (error) {
      console.error(error);

      if (error.remainingSeconds) {
        setCooldownSeconds(error.remainingSeconds);
      }

      setSubmitStatus({
        type: "error",
        text:
          error.message ||
          "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.",
      });
    } finally {
      setSending(false);
    }
  };

  const getInfoIcon = (icon) => {
    if (icon === "mail") return <FiMail />;
    if (icon === "mapPin") return <FiMapPin />;
    return <FiMail />;
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#0d0d0d] text-white">
      <section className="mx-auto w-full max-w-[1500px] px-6 pt-32 pb-20 sm:px-8 md:px-10 lg:px-16 lg:pt-40 lg:pb-28">
        <div className="pt-10">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="text-[11px] uppercase tracking-[0.34em] text-white/38"
          >
            {content.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05 }}
            className="mt-6 max-w-[1050px] text-[42px] font-semibold leading-[0.96] tracking-[-0.055em] sm:text-[58px] md:text-[78px] lg:text-[96px]"
          >
            {content.title}
          </motion.h1>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <p className="max-w-[420px] text-[15px] leading-7 text-white/62 sm:text-[16px]">
              {content.description}
            </p>

            <div className="mt-10 space-y-7">
              {content.infoItems.map((item) => (
                <InfoLine
                  key={item.id}
                  icon={getInfoIcon(item.icon)}
                  title={getLocalized(item.title)}
                  text={getLocalized(item.text)}
                />
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.14 }}
            className="lg:col-span-8"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
              <LineInput
                label={getLocalized(content.firstName.label)}
                placeholder={getLocalized(content.firstName.placeholder)}
                value={formData.firstName}
                error={errors.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />

              <LineInput
                label={getLocalized(content.lastName.label)}
                placeholder={getLocalized(content.lastName.placeholder)}
                value={formData.lastName}
                error={errors.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />

              <LineInput
                label={getLocalized(content.email.label)}
                placeholder={getLocalized(content.email.placeholder)}
                value={formData.email}
                error={errors.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />

              <div>
                <label className="text-[11px] uppercase tracking-[0.24em] text-white/38">
                  {getLocalized(content.subjectType.label)}
                </label>

                <div className="relative mt-4">
                  <button
                    type="button"
                    onClick={() => setSubjectOpen((prev) => !prev)}
                    className={`group relative flex w-full items-center justify-between border-b bg-transparent pb-4 text-left text-[17px] outline-none transition-colors duration-300 ${errors.subjectType
                      ? "border-[#c12030] text-[#c12030]"
                      : "border-white/15 text-white hover:border-white/35"
                      }`}
                  >
                    <span
                      className={
                        formData.subjectType ? "text-white" : "text-white/25"
                      }
                    >
                      {formData.subjectType
                        ? getLocalized(
                          content.subjectType.options?.find(
                            (option) => option.value === formData.subjectType
                          )?.label,
                          formData.subjectType
                        )
                        : getLocalized(content.subjectType.placeholder)}
                    </span>

                    <motion.span
                      animate={{ rotate: subjectOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <FiChevronDown />
                    </motion.span>

                    <span
                      className={`absolute bottom-[-1px] left-0 h-[1px] w-full origin-left transition-transform duration-300 ease-out ${subjectOpen || errors.subjectType
                        ? "scale-x-100"
                        : "scale-x-0"
                        } ${errors.subjectType ? "bg-[#c12030]" : "bg-white"}`}
                    />
                  </button>

                  <AnimatePresence>
                    {subjectOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                        className="absolute left-0 right-0 top-[calc(100%+12px)] z-20 overflow-hidden rounded-[22px] border border-white/10 bg-[#151515] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
                      >
                        {(content.subjectType.options || []).map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              handleChange("subjectType", option.value);
                              setSubjectOpen(false);
                            }}
                            className={`w-full rounded-2xl px-4 py-3 text-left text-[14px] transition-all duration-200 ${formData.subjectType === option.value
                              ? "bg-white text-[#0d0d0d]"
                              : "text-white/68 hover:bg-white/5 hover:text-white"
                              }`}
                          >
                            {getLocalized(option.label)}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {errors.subjectType && (
                  <p className="mt-3 text-[12px] text-[#c12030]">
                    {errors.subjectType}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10">
              <LineTextarea
                label={getLocalized(content.message.label)}
                placeholder={getLocalized(content.message.placeholder)}
                value={formData.message}
                error={errors.message}
                onChange={(e) => handleChange("message", e.target.value)}
              />
            </div>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <label className="group flex cursor-pointer items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAgreementChecked((prev) => !prev)}
                  className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-all duration-300 ${agreementChecked
                    ? "border-white bg-white"
                    : "border-white/25 bg-transparent hover:border-white"
                    }`}
                >
                  {agreementChecked && (
                    <FaCheck className="text-[13px] text-black" />
                  )}
                </button>

                <span className="text-[13px] leading-6 text-white/58">
                  {!agreementChecked ? (
                    getLocalized(content.privacy.uncheckedText)
                  ) : (
                    <>
                      {getLocalized(content.privacy.checkedPrefix)}{" "}
                      <Link
                        to={content.privacy.href || "/privacy-policy"}
                        className="font-medium text-[#c12030] transition-opacity duration-300 hover:opacity-80"
                      >
                        {getLocalized(content.privacy.linkText)}
                      </Link>{" "}
                      {getLocalized(content.privacy.checkedSuffix)}
                    </>
                  )}
                </span>
              </label>

              {submitStatus && (
                <div
                  className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-medium ${submitStatus.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-300"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                    }`}
                >
                  {submitStatus.text}
                </div>
              )}

              <button
                type="submit"
                disabled={!agreementChecked || sending || cooldownSeconds > 0}
                className={`group inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${agreementChecked && !sending && cooldownSeconds <= 0
                  ? "cursor-pointer bg-white text-[#0d0d0d] hover:scale-[1.02]"
                  : "cursor-not-allowed bg-white/15 text-white/35"
                  }`}
              >
                {cooldownSeconds > 0
                  ? `${cooldownSeconds} sn bekleyin`
                  : sending
                    ? "Gönderiliyor..."
                    : getLocalized(content.submitButton.text)}
                <FiArrowUpRight
                  className={`transition-transform duration-300 ${agreementChecked && !sending && cooldownSeconds <= 0
                    ? "group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                    : ""
                    }`}
                />
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}

function LineInput({ label, placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.24em] text-white/38">
        {label}
      </label>

      <div
        className={`group relative mt-4 border-b transition-colors duration-300 ${error ? "border-[#c12030]" : "border-white/15"
          }`}
      >
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent pb-4 text-[17px] text-white outline-none placeholder:text-white/25"
        />

        <span
          className={`absolute bottom-[-1px] left-0 h-[1px] w-full origin-left transition-transform duration-300 ease-out group-focus-within:scale-x-100 ${error ? "scale-x-100 bg-[#c12030]" : "scale-x-0 bg-white"
            }`}
        />
      </div>

      {error && <p className="mt-3 text-[12px] text-[#c12030]">{error}</p>}
    </div>
  );
}

function LineTextarea({ label, placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.24em] text-white/38">
        {label}
      </label>

      <div
        className={`group relative mt-4 border-b transition-colors duration-300 ${error ? "border-[#c12030]" : "border-white/15"
          }`}
      >
        <textarea
          rows="5"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full resize-none bg-transparent pb-4 text-[17px] leading-7 text-white outline-none placeholder:text-white/25"
        />

        <span
          className={`absolute bottom-[-1px] left-0 h-[1px] w-full origin-left transition-transform duration-300 ease-out group-focus-within:scale-x-100 ${error ? "scale-x-100 bg-[#c12030]" : "scale-x-0 bg-white"
            }`}
        />
      </div>

      {error && <p className="mt-3 text-[12px] text-[#c12030]">{error}</p>}
    </div>
  );
}

function InfoLine({ icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-[20px] text-white/55">{icon}</div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
          {title}
        </p>
        <p className="mt-2 text-[15px] leading-7 text-white/70">{text}</p>
      </div>
    </div>
  );
}

export default ContactPage;