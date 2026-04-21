import { motion } from "framer-motion";
import { Monitor, Gamepad2, Users, Sparkles } from "lucide-react";

const aboutCards = [
  {
    icon: Users,
    title: "Small Team, Sharp Vision",
    text: "We are a compact and focused game team building projects with strong direction, fast iteration, and attention to detail.",
  },
  {
    icon: Monitor,
    title: "Built for PC & Mobile",
    text: "Our games are crafted for PC and mobile platforms, designed to feel immersive, polished, and satisfying from the very first minute.",
  },
  {
    icon: Gamepad2,
    title: "Gameplay First",
    text: "We create experiences driven by atmosphere, tension, mystery, and mechanics that keep players engaged from start to finish.",
  },
  {
    icon: Sparkles,
    title: "Style with Identity",
    text: "Every project is shaped with its own visual identity, mood, and tone to leave a lasting impression beyond gameplay alone.",
  },
];

function About() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#0d0d0d] px-6 py-20 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        
        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-120px] top-[-80px] h-[260px] w-[260px] rounded-full blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-100px] h-[320px] w-[320px] rounded-full  blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px]">

          {/* TOP */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <span className="mb-4 inline-flex rounded-full border border-[#ef4645]/25 bg-[#991b1f]/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#ef4645]">
                About Us
              </span>

              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                We build games with atmosphere, identity, and purpose.
              </h2>

              <p className="mt-6 text-white/70">
                We are an independent game team focused on creating memorable
                experiences for PC and mobile players. Our approach combines
                strong visual direction, intentional gameplay design, and worlds
                that feel distinct from the moment players step into them.
              </p>

              <p className="mt-5 text-white/70">
                From social deduction to mystery and trap-driven adventures, we
                build each project with a clear tone and a strong core idea.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">
                  PC Games
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">
                  Desktop Experiences
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">
                  Immersive Design
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">
                  Distinct Worlds
                </span>
              </div>
            </motion.div>

            {/* RIGHT CARDS */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {aboutCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm hover:border-[#ef4645]/30"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#991b1f] via-[#c12030] to-[#ef4645] text-white">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-white font-semibold">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-sm text-white/60">
                      {card.text}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

          </div>

          {/* BOTTOM */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16 rounded-[28px] border border-[#ef4645]/15 bg-gradient-to-r from-[#991b1f]/30 to-[#0d0d0d] p-6 sm:p-8 lg:p-10"
          >
            <h3 className="text-white text-2xl font-bold sm:text-3xl">
              We do not just make games. We build worlds.
            </h3>

            <p className="mt-4 text-white/70 max-w-2xl">
              Every project we create is designed to feel immersive, visually
              strong, and emotionally engaging. We aim to deliver experiences
              players remember long after they finish playing.
            </p>
          </motion.div>

        </div>
      </section>
    </>
  );
}

export default About;