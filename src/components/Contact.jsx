import { motion } from "framer-motion";
import { profile } from "../data/content";
import { Reveal } from "./ui";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="noise relative overflow-hidden border-t border-cream/10">
      {/* colour field */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="animate-drift absolute -bottom-[30%] left-[10%] size-[60vw] rounded-full opacity-25 blur-[120px]"
          style={{ background: "radial-gradient(circle, #7c5cff 0%, transparent 65%)" }}
        />
        <div
          className="animate-drift absolute -top-[20%] right-[5%] size-[45vw] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #ffb020 0%, transparent 65%)",
            animationDelay: "-11s",
          }}
        />
      </div>

      {/* Asymmetric padding: the credit line closes the page, so it does not
          need a full section's worth of space beneath it. */}
      <div className="relative mx-auto max-w-[1400px] px-5 pt-28 pb-8 md:px-8 md:pt-40 md:pb-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-cream/25" />
            <span className="kicker">04 — Contact</span>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="display mt-8 max-w-[14ch] text-[clamp(2.4rem,5.5vw,4.4rem)] text-cream">
            Let's build{" "}
            <span className="accent-serif text-gradient">something</span> that matters.
          </h2>
        </Reveal>

        {/* ------------------------------------------- Direct channels -- */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 md:grid-cols-2">
          <ContactRow
            href={`mailto:${profile.email}`}
            label="Email"
            value={profile.email}
            delay={0}
          />
          <ContactRow href={profile.phoneHref} label="Phone" value={profile.phone} delay={0.08} live />
        </div>

        {/* ------------------------------------------------- Elsewhere -- */}
        <div className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-3">
          {profile.socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex items-center justify-between gap-4 bg-ink-800 px-6 py-4 transition-colors duration-300 hover:bg-ink-700"
            >
              <div className="min-w-0">
                <p className="font-display text-[0.85rem] font-medium tracking-tight text-cream">
                  {s.label}
                </p>
                <p className="mt-0.5 truncate font-mono text-[0.64rem] text-cream-mute">
                  {s.handle}
                </p>
              </div>
              <span className="shrink-0 text-cream-mute transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cream">
                ↗
              </span>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-violet via-coral to-amber transition-transform duration-500 group-hover:scale-x-100" />
            </motion.a>
          ))}
        </div>

        {/* ---------------------------------------------------- Footer -- */}
        <div className="mt-16 border-t border-cream/10 pt-7">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.7rem] tracking-wide text-cream-mute">© {year}</p>
            <a
              href="#home"
              className="group inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-wide text-cream-dim transition-colors hover:text-cream"
            >
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
              Back to top
            </a>
          </div>

          {/* Closing credit, centred at the very foot of the page */}
          <p className="mt-8 text-center font-mono text-[0.92rem] tracking-[0.1em] text-cream-dim">
            Built By: {profile.name}
          </p>
        </div>
      </div>
    </section>
  );
}

/* A primary channel: oversized, tappable, the value doing the talking. */
function ContactRow({ href, label, value, delay, live = false }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-center justify-between gap-5 bg-ink-800 px-6 py-6 transition-colors duration-300 hover:bg-ink-700 md:px-7 md:py-7"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {live && (
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
            </span>
          )}
          <p className="kicker">{label}</p>
        </div>
        <p className="mt-2.5 truncate font-display text-[clamp(1rem,1.8vw,1.25rem)] font-medium tracking-tight text-cream">
          {value}
        </p>
      </div>
      <motion.span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-[0.85rem] text-ink-900"
        whileHover={{ rotate: 45 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        ↗
      </motion.span>
    </motion.a>
  );
}
