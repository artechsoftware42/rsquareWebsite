import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const NotFound404 = () => {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#0d0d0d] text-white select-none">

            {/* BACKGROUND EFFECT */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[120px]" />
                <div className="absolute right-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-[#c12030]/20 blur-[110px]" />
                <div className="absolute bottom-[-140px] left-[-120px] h-[320px] w-[320px] rounded-full bg-[#c12030]/10 blur-[120px]" />
            </div>

            <section className="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-20">
                <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">

                    {/* TOP TEXT */}
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.45em] text-white/40 sm:text-sm">
                        Error
                    </p>

                    {/* 404 */}
                    <h1 className="relative text-[7rem] font-black leading-none tracking-[-0.08em] text-white sm:text-[10rem] md:text-[13rem] lg:text-[16rem]">
                        404
                        <span className="absolute inset-0 -z-10 text-[#c12030]/25 blur-md">
                            404
                        </span>
                    </h1>

                    {/* CONTENT */}
                    <div className="mt-6 max-w-2xl">
                        <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-4xl md:text-5xl">
                            This page <span className="text-[#c12030]">does not exist</span>.
                        </h2>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                            The page you are looking for might have been{" "}
                            <span className="text-white">moved</span>,{" "}
                            <span className="text-[#c12030]">deleted</span>, or never existed.
                            You can return to the{" "}
                            <span className="text-white">main page</span> to continue.
                        </p>
                    </div>

                    {/* BUTTON */}
                    <Link
                        to="/"
                        draggable="false"
                        className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#0d0d0d] transition-all duration-300 hover:bg-[#c12030] hover:text-white active:scale-95 sm:px-8"
                    >
                        Back to Home
                        <FiArrowUpRight className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>

                </div>
            </section>
        </main>
    );
};

export default NotFound404;