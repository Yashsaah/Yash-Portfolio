import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile, stats } from "../data/content";
import { SmartImage } from "./ui";

const EASE = [0.16, 1, 0.3, 1];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  /* The hero recedes slightly as the next section rides over it. */
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);
  /* Starts lifted above centre — the hero's top padding clears the fixed nav,
     which otherwise leaves the card sitting low in its column. */
  const imgY = useTransform(scrollYProgress, [0, 1], ["-20%", "-4%"]);

  return (
    /* On desktop the hero pins while the next section rides up over it —
       the overscroll effect. On mobile it flows normally so nothing clips. */
    /* min-h rather than a fixed h: on a short desktop window the hero grows
       instead of clipping its own content behind overflow-hidden. */
    <div id="home" ref={ref} className="relative lg:min-h-[100svh]">
      <section className="noise relative flex min-h-[100svh] flex-col justify-between overflow-hidden lg:sticky lg:top-0">
        <Aurora />

      <motion.div style={{ scale, opacity }} className="relative flex flex-1 flex-col justify-center">
        <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-10 px-5 pt-28 pb-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-0 lg:pt-28 lg:pb-4">
          {/* ---------------------------------------------------- Copy -- */}
          <div className="relative z-20 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cream/12 bg-cream/[0.04] px-4 py-2 backdrop-blur-sm"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
              </span>
              <span className="font-mono text-[0.68rem] tracking-wider text-cream-dim">
                {profile.availability}
              </span>
            </motion.div>

            {/* Sized against both axes so four lines still fit a short laptop screen */}
            <h1 className="display text-[clamp(2.9rem,min(7.4vw,8.8vh),5.9rem)] text-cream">
              {profile.headline.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.05, delay: 0.1 + i * 0.09, ease: EASE }}
                  >
                    {i === profile.headlineAccentIndex ? (
                      <span className="accent-serif text-gradient pr-2">{line}</span>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
              className="read mt-7 max-w-[48ch] text-[1.12rem] leading-[1.65] text-cream-dim md:text-[1.2rem]"
            >
              {profile.intro}
            </motion.p>

            {/* Curious about — the interest chips that used to sit in the
                About section, now folded into the opening statement. */}
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.58, ease: EASE }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {profile.curious.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-cream/12 bg-cream/[0.03] px-3.5 py-1.5 text-[0.78rem] tracking-tight text-cream-mute transition-colors duration-300 hover:border-cream/30 hover:text-cream"
                >
                  {c}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-cream px-7 py-3.5 text-sm font-medium tracking-tight text-ink-900"
              >
                <span className="relative z-10">See the work</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-amber via-coral to-violet transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-cream/20 px-7 py-3.5 text-sm font-medium tracking-tight text-cream transition-colors duration-300 hover:border-cream/50 hover:bg-cream/5"
              >
                Get in touch
              </a>
            </motion.div>

            {/* Stat strip */}
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.85 }}
              className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-cream/10 pt-6"
            >
              {stats.map((s) => (
                <div key={s.label} className="min-w-[8rem]">
                  <dt className="display text-3xl text-cream">{s.value}</dt>
                  <dd className="mt-1.5 max-w-[16ch] text-[0.78rem] leading-snug text-cream-mute">
                    {s.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* --------------------------------------------------- Photo --
              A contained portrait card sitting in the right column, rather
              than a full-bleed image dissolving off the page edge. */}
          <motion.div
            style={{ y: imgY }}
            className="relative z-10 mx-auto w-full max-w-[16.5rem] lg:max-w-[20rem] lg:justify-self-end"
          >
            {/* colour glow spilling out from behind the card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: EASE }}
              className="pointer-events-none absolute -inset-10 -z-10 blur-[60px]"
              style={{
                background:
                  "radial-gradient(55% 50% at 40% 30%, rgba(124,92,255,0.45) 0%, transparent 70%), radial-gradient(50% 45% at 75% 80%, rgba(255,176,32,0.3) 0%, transparent 72%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
              className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-cream/12 bg-ink-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            >
              <SmartImage
                src="/images/yash.jpeg"
                alt={`Portrait of ${profile.name}`}
                accent="violet"
                label="Portrait"
                className="size-full bg-transparent"
                imgClassName="object-cover object-[50%_20%] saturate-[1.05] contrast-[1.03]"
              />
              {/* soft vignette so the card reads as part of the page */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent" />
              {/* inner hairline highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-cream/8" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

        {/* Scroll cue, pinned to the right edge clear of the stat row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="pointer-events-none absolute right-8 bottom-10 z-20 hidden items-center gap-3 lg:flex"
        >
          <span className="kicker">Scroll</span>
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="block h-8 w-px bg-gradient-to-b from-cream/60 to-transparent"
          />
        </motion.div>
      </section>
    </div>
  );
}

/* Slow-drifting colour fields + grid, sitting behind everything. */
function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-lines mask-fade-b absolute inset-0 opacity-60" />
      <div
        className="animate-drift absolute -top-[20%] -left-[10%] size-[55vw] rounded-full opacity-[0.32] blur-[110px]"
        style={{ background: "radial-gradient(circle, #7c5cff 0%, transparent 65%)" }}
      />
      <div
        className="animate-drift absolute top-[35%] -left-[5%] size-[40vw] rounded-full opacity-[0.22] blur-[120px]"
        style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 65%)", animationDelay: "-8s" }}
      />
      <div
        className="animate-drift absolute -bottom-[15%] left-[25%] size-[45vw] rounded-full opacity-[0.18] blur-[130px]"
        style={{ background: "radial-gradient(circle, #ff5f6d 0%, transparent 65%)", animationDelay: "-15s" }}
      />
    </div>
  );
}
