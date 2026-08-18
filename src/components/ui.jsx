import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { accentVar } from "../lib/accents";

/* -------------------------------------------------------------- Reveal --
   Scroll-triggered entrance. Everything on the page animates in through
   this one component so the timing language stays consistent. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as: Tag = "div",
  once = true,
}) {
  const MotionTag = motion[Tag] ?? motion.div;
  /* The CSS media query neutralises transitions but not JS-driven
     animation, so the opt-out has to be honoured here too. */
  const reduce = useReducedMotion();

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/* Headline text that reveals word by word, each word sliding up out of its own
   clipping box.

   The observer watches the wrapper, not the individual words: a word starts
   translated 110% down, which puts it entirely outside its overflow-hidden
   parent, so its own intersection rect is empty and `whileInView` on the word
   would never fire. The padding / negative-margin pair stops that same clip
   from shaving the descenders off the settled text. */
export function RevealWords({ text, className = "", delay = 0, wordClassName }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
        >
          <motion.span
            className={`inline-block ${wordClassName ?? ""}`}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.055,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------- SectionHeading --
   Monospaced kicker + oversized display title + optional lede. */
export function SectionHeading({ kicker, title, lede, align = "left" }) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-3xl"}>
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-cream/25" />
          <span className="kicker">{kicker}</span>
        </div>
      </Reveal>
      <h2 className="display mt-5 text-[clamp(2.4rem,6vw,4.5rem)] text-cream">
        <RevealWords text={title} />
      </h2>
      {lede && (
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-cream-dim">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Marquee --
   Duplicated track translated -50% for a seamless loop. */
export function Marquee({ items, duration = 40, reverse = false, className = "" }) {
  const track = [...items, ...items];
  return (
    <div className={`mask-fade-x overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex w-max items-center gap-10"
        style={{
          "--marquee-duration": `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="font-display text-2xl font-medium tracking-tight text-cream/45 md:text-3xl">
              {item}
            </span>
            <span className="size-1.5 rotate-45 bg-violet/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- SmartImage --
   Real photo when the file exists; a tinted, labelled placeholder when it
   doesn't — so the layout is never broken by a missing asset. */
export function SmartImage({ src, alt, accent = "violet", label, className = "", imgClassName = "" }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        style={accentVar(accent)}
        className={`relative flex items-center justify-center overflow-hidden bg-ink-700 ${className}`}
      >
        <div
          className="absolute inset-0 opacity-45"
          style={{
            background:
              "radial-gradient(120% 90% at 20% 0%, var(--accent) 0%, transparent 55%), radial-gradient(100% 80% at 100% 100%, #7c5cff 0%, transparent 60%)",
          }}
        />
        <div className="grid-lines absolute inset-0 opacity-40" />
        <div className="relative z-10 px-6 text-center">
          <div className="mx-auto mb-3 size-9 rounded-full border border-cream/25" />
          <p className="kicker">{label ?? "Image"}</p>
          <p className="mt-2 max-w-[24ch] font-mono text-[0.65rem] leading-relaxed text-cream-mute">
            drop <span className="text-cream-dim">{src?.replace("/images/", "")}</span> into
            public/images
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-ink-700 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`size-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

/* --------------------------------------------------------------- Chip -- */
export function Chip({ children, accent }) {
  return (
    <span
      style={accent ? accentVar(accent) : undefined}
      className={`rounded-full border px-3 py-1.5 font-mono text-[0.68rem] tracking-wide ${
        accent
          ? "border-[var(--accent)]/30 bg-[var(--accent)]/8 text-[var(--accent)]"
          : "border-cream/15 bg-cream/[0.03] text-cream-dim"
      }`}
    >
      {children}
    </span>
  );
}
