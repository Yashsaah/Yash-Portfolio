import { motion } from "framer-motion";
import { achievements } from "../data/content";
import { SectionHeading } from "./ui";
import { accentVar } from "../lib/accents";

export default function Achievements() {
  return (
    <section id="awards" className="relative border-t border-cream/10 py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionHeading kicker="03 — Recognition" title="Awards & honours" />

        <div className="mt-16">
          {achievements.map((item, i) => (
            <AwardRow key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardRow({ item, index }) {
  return (
    <motion.div
      style={accentVar(item.accent)}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid items-start gap-4 border-t border-cream/10 py-8 transition-colors duration-500 last:border-b hover:border-cream/30 md:grid-cols-[auto_1fr_auto] md:gap-10 md:py-10"
    >
      {/* hover wash */}
      <span
        className="pointer-events-none absolute inset-x-0 inset-y-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--accent) 12%, transparent), transparent 60%)",
        }}
      />

      {/* medal mark */}
      <div className="flex items-center gap-4 md:w-40">
        <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40">
          <span className="absolute inset-0 rounded-full bg-[var(--accent)]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="size-2.5 rotate-45 bg-[var(--accent)]" />
        </span>
        <span className="kicker whitespace-nowrap">{item.year}</span>
      </div>

      <div className="md:pr-10">
        <h3 className="font-display text-[1.4rem] leading-tight font-medium tracking-tight text-cream md:text-[1.85rem]">
          {item.title}
        </h3>
        <p className="mt-1.5 text-[0.85rem] text-[var(--accent)]">{item.org}</p>
        <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-relaxed text-cream-mute">
          {item.description}
        </p>
      </div>

      <span className="display hidden text-6xl text-cream/[0.07] transition-colors duration-500 group-hover:text-cream/15 md:block">
        0{index + 1}
      </span>
    </motion.div>
  );
}
