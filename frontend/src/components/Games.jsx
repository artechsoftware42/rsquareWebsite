import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useMotionTemplate,
} from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { FaSteam, FaGooglePlay, FaAppStoreIos } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";

import Hero1 from "../assets/Hero1.png";
import Hero2 from "../assets/Hero2.png";
import Hero3 from "../assets/Hero3.png";
import Cta from "../assets/cta.png";

const games = [
    {
        id: "01",
        title: "Mission Midnight",
        category: "PC Games",
        image: Hero1,
        hoverImage: Cta,
        description:
            "A cinematic experience built around atmosphere, discovery, and controlled tension.",
        stores: [
            { name: "Steam", href: "#", icon: <FaSteam /> },
            { name: "Epic Games", href: "#", icon: <SiEpicgames /> },
        ],
        link: "/games/mission-midnight",
    },
    {
        id: "02",
        title: "Ancient Anomaly",
        category: "PC Games",
        image: Hero2,
        hoverImage: Cta,
        description:
            "A darker world with a distinctive tone, focused on pacing, mood, and memorable identity.",
        stores: [
            { name: "Steam", href: "#", icon: <FaSteam /> },
            { name: "Epic Games", href: "#", icon: <SiEpicgames /> },
        ],
        link: "/games/ancient-anomaly",
    },
    {
        id: "03",
        title: "Be Patient",
        category: "Mobile Games",
        image: Hero3,
        hoverImage: Cta,
        description:
            "A disciplined challenge shaped by timing, pressure, and clean visual direction.",
        stores: [
            { name: "Google Play", href: "#", icon: <FaGooglePlay /> },
            { name: "App Store", href: "#", icon: <FaAppStoreIos /> },
        ],
        link: "/games/be-patient",
    },
];

const tabs = ["All", "PC Games", "Mobile Games", "Publishing"];

function GamesPage() {
    const [activeTab, setActiveTab] = useState("All");

    const { scrollY } = useScroll();

    // DEĞİŞTİRİLDİ: Arkadaki OUR GAMES scroll ile sağa gider
    const bgX = useTransform(scrollY, [0, 400], [0, 220]);

    // DEĞİŞTİRİLDİ: Öndeki hero içerikleri scroll ile sola gider
    const contentX = useTransform(scrollY, [0, 400], [0, -130]);

    // DEĞİŞTİRİLDİ: Hero yazıları scroll sırasında yumuşakça kaybolur
    const heroOpacity = useTransform(scrollY, [0, 270], [1, 0]);

    // DEĞİŞTİRİLDİ: Blur efekti useMotionTemplate ile güvenli hale getirildi
    const heroBlur = useTransform(scrollY, [0, 270], [0, 7]);
    const heroFilter = useMotionTemplate`blur(${heroBlur}px)`;

    // DEĞİŞTİRİLDİ: Açıklama yazısına ayrı küçük hareket verildi
    const descY = useTransform(scrollY, [0, 300], [0, -45]);
    const descScale = useTransform(scrollY, [0, 300], [1, 0.96]);
    const descOpacity = useTransform(scrollY, [0, 230], [1, 0]);

    const filteredGames = useMemo(() => {
        if (activeTab === "All") return games;
        return games.filter((game) => game.category === activeTab);
    }, [activeTab]);

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
            {/* HERO */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16 pb-24">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(193,32,48,0.35),transparent_34%),linear-gradient(180deg,#2b171a_0%,#1a1011_48%,#0d0d0d_92%)]" />
                <div className="absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-b from-transparent to-[#0d0d0d]" />

                {/* DEĞİŞTİRİLDİ: Arkadaki yazı scroll ile sağa gidiyor */}
                <motion.h1
                    style={{
                        x: bgX,
                        opacity: heroOpacity,
                        filter: heroFilter,
                    }}
                    initial={{ opacity: 0, y: 70 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="absolute left-1/2 top-1/2 whitespace-nowrap -translate-x-1/2 -translate-y-1/2 text-[18vw] leading-none font-black tracking-[-1vw] text-[#5f242b]/35 select-none pointer-events-none"
                >
                    OUR GAMES
                </motion.h1>

                {/* DEĞİŞTİRİLDİ: Öndeki hero içerikleri scroll ile sola gidiyor */}
                <motion.div
                    style={{
                        x: contentX,
                        opacity: heroOpacity,
                        filter: heroFilter,
                    }}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.12 }}
                    className="relative z-10 max-w-3xl text-center"
                >
                    <span className="text-xs sm:text-sm tracking-[0.45em] text-white/45 uppercase">
                        Featured Releases
                    </span>

                    <h2 className="mt-6 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.07em] uppercase">
                        Our Games
                    </h2>

                    {/* DEĞİŞTİRİLDİ: Açıklama yazısına scroll sırasında ek hareket verildi */}
                    <motion.p
                        style={{
                            y: descY,
                            scale: descScale,
                            opacity: descOpacity,
                        }}
                        className="mx-auto mt-7 max-w-2xl text-lg sm:text-xl text-white/78 leading-relaxed"
                    >
                        We develop cinematic, memorable and carefully crafted games for PC
                        and mobile platforms.
                    </motion.p>
                </motion.div>
            </section>

            {/* TABS */}
            <section className="relative z-20 -mt-20 px-6 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-[1500px] flex justify-center">
                    <div className="relative flex w-full max-w-[720px] items-center justify-between border-y border-white/10 py-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`relative flex-1 cursor-pointer px-4 py-4 text-center text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${activeTab === tab
                                    ? "text-white"
                                    : "text-white/35 hover:text-white/80"
                                    }`}
                            >
                                <span className="relative z-10">{tab}</span>

                                {activeTab === tab && (
                                    <motion.span
                                        layoutId="game-tab-underline"
                                        className="absolute left-1/2 bottom-0 h-[2px] w-12 -translate-x-1/2 bg-white"
                                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                    />
                                )}

                                {activeTab === tab && (
                                    <motion.span
                                        layoutId="game-tab-glow"
                                        className="absolute left-1/2 top-1/2 h-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-xl"
                                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* SHOWCASE */}
            <section
                id="games-showcase"
                className="mx-auto flex w-full max-w-[1500px] flex-col gap-16 pt-24 px-6 pb-24 sm:px-8 md:px-10 md:gap-24 lg:px-16 lg:pb-32"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-16 md:gap-24"
                    >
                        {filteredGames.map((game, index) => {
                            const isReverse = index % 2 === 1;

                            return (
                                <motion.div
                                    key={game.id}
                                    initial={{ opacity: 0, y: 45 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.75 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-20 xl:gap-32"
                                >
                                    <div
                                        className={`lg:col-span-7 ${isReverse ? "lg:order-2" : "lg:order-1"
                                            }`}
                                    >
                                        <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#121212]">
                                            <img
                                                src={game.image}
                                                alt={game.title}
                                                className="h-[320px] w-full object-cover transition-all duration-1000 ease-out group-hover:scale-[1.025] group-hover:opacity-0 sm:h-[420px] md:h-[520px] lg:h-[640px]"
                                                draggable={false}
                                            />

                                            <img
                                                src={game.hoverImage}
                                                alt={`${game.title} preview`}
                                                className="absolute inset-0 h-full w-full scale-[1.025] object-cover opacity-0 transition-all duration-1000 ease-out group-hover:scale-100 group-hover:opacity-100"
                                                draggable={false}
                                            />

                                            <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-100 transition-opacity duration-500 group-hover:opacity-0" />
                                        </div>
                                    </div>

                                    <div
                                        className={`lg:col-span-5 ${isReverse ? "lg:order-1" : "lg:order-2"
                                            }`}
                                    >
                                        <div className="max-w-[560px]">
                                            <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">
                                                {game.id} / {game.category}
                                            </p>

                                            <h2 className="mt-5 text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[42px] md:text-[56px]">
                                                {game.title}
                                            </h2>

                                            <p className="mt-6 text-[15px] leading-7 text-white/64 sm:text-[16px]">
                                                {game.description}
                                            </p>

                                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                                {game.stores.map((store) => (
                                                    <a
                                                        key={store.name}
                                                        href={store.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/store inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55 transition-all duration-300 hover:border-[#ef4645]/50 hover:bg-[#ef4645]/10 hover:text-[#ef4645]"
                                                    >
                                                        <span className="text-[16px] transition-transform duration-300 group-hover/store:scale-110">
                                                            {store.icon}
                                                        </span>
                                                        <span>{store.name}</span>
                                                    </a>
                                                ))}
                                            </div>

                                            <div className="mt-8 h-px w-full max-w-[420px] bg-white/10" />

                                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                                <Link
                                                    to={game.link}
                                                    className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0d0d0d]"
                                                >
                                                    Explore Game.
                                                    <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                                                </Link>

                                                <span className="text-[12px] uppercase tracking-[0.24em] text-white/35">
                                                    In Development
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </section>
        </main>
    );
}

export default GamesPage;