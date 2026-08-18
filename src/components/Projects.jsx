import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../data/content";
import { SectionHeading, SmartImage } from "./ui";
import Sim from "./sims";
import { accentVar } from "../lib/accents";

const EASE = [0.16, 1, 0.3, 1];

export default function Projects() {
  const [open, setOpen] = useState(null);

  return (
    <section id="work" className="relative border-t border-cream/10 py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionHeading
          kicker="02 — Projects"
          title="Things I have built"
          lede="Three questions: can a machine read intent, can it justify a diagnosis, and can an idea survive all the way to a live URL."
        />

        {/* Hairline-separated cards — the gap is the border. */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 md:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              onOpen={() => setOpen(project)}
            />
          ))}
        </div>
      </div>

      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/* ---------------------------------------------------------------- Card -- */
function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      style={accentVar(project.accent)}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      aria-label={`Open ${project.title}`}
      className="group relative flex cursor-pointer flex-col bg-ink-800 p-5 text-left transition-colors duration-500 hover:bg-ink-700 md:p-6"
    >
      {/* accent edge that grows on hover */}
      <span className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />

      <div className="hairline relative aspect-[4/3] shrink-0 overflow-hidden rounded-lg bg-ink-900">
        {project.image ? (
          <SmartImage
            src={project.image}
            alt={project.imageAlt}
            accent={project.accent}
            label={project.title}
            className="size-full"
            imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <Sim name={project.sim} />
        )}
      </div>

      <p className="kicker mt-5 text-[var(--accent)]">{project.kicker}</p>

      <h3 className="display mt-2 text-[1.45rem] text-cream md:text-[1.6rem]">{project.title}</h3>

      <p className="read mt-3 text-[0.98rem] leading-[1.6] text-cream-dim">{project.blurb}</p>

      <span className="mt-auto flex items-center gap-2 pt-6 text-[0.8rem] font-medium tracking-tight text-cream-mute transition-colors duration-300 group-hover:text-cream">
        Read more
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </motion.button>
  );
}

/* -------------------------------------------------------------- Dialog -- */
function ProjectDialog({ project, onClose }) {
  /* Escape closes; the page behind must not scroll while this is up. */
  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink-900/85 p-4 backdrop-blur-md md:p-8"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            style={accentVar(project.accent)}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="hairline relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-ink-800"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-cream/15 bg-ink-900/70 text-lg text-cream backdrop-blur-sm transition-colors duration-300 hover:border-cream/40 hover:bg-ink-900"
            >
              ×
            </button>

            {/* the larger visual */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-900 md:aspect-[16/9]">
              {project.image ? (
                <SmartImage
                  src={project.image}
                  alt={project.imageAlt}
                  accent={project.accent}
                  label={project.title}
                  className="size-full"
                />
              ) : (
                <Sim name={project.sim} />
              )}
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="kicker text-[var(--accent)]">{project.kicker}</span>
                <span className="size-1 rounded-full bg-cream/25" />
                <span className="kicker">{project.year}</span>
                <span className="ml-auto rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1.5 font-mono text-[0.62rem] tracking-widest text-cream-dim uppercase">
                  {project.status}
                </span>
              </div>

              <h3 className="display mt-4 text-[clamp(2rem,4.5vw,3rem)] text-cream">
                {project.title}
              </h3>
              <p className="accent-serif mt-2 text-[1.25rem] text-[var(--accent)] md:text-[1.5rem]">
                {project.tagline}
              </p>

              <div className="read mt-7 space-y-4 text-[1.05rem] leading-[1.7] text-cream-dim">
                <p>{project.description}</p>
                <p className="text-cream-mute">{project.detail}</p>
              </div>

              {project.built && (
                <div className="mt-8 rounded-xl border border-cream/10 bg-cream/[0.03] p-5 md:p-6">
                  <p className="kicker">How it's built</p>
                  <p className="read mt-3 text-[1rem] leading-[1.7] text-cream-dim">
                    {project.built}
                  </p>
                </div>
              )}

              {/* Only projects that declare a stack get the second column. */}
              <div
                className={`mt-9 grid gap-8 border-t border-cream/10 pt-8 ${
                  project.stack ? "md:grid-cols-2" : ""
                }`}
              >
                <div>
                  <p className="kicker">What I did</p>
                  <ul className="mt-4 space-y-2.5">
                    {project.contributions.map((c) => (
                      <li
                        key={c}
                        className="flex gap-3 text-[0.92rem] leading-relaxed text-cream-dim"
                      >
                        <span className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-[var(--accent)]" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.stack && (
                  <div>
                    <p className="kicker">Built with</p>
                    <p className="mt-4 font-mono text-[0.78rem] leading-[1.9] text-cream-dim">
                      {project.stack.map((tech, i) => (
                        <span key={tech}>
                          {i > 0 && <span className="px-2 text-cream-mute">·</span>}
                          {tech}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>

              {project.links.length > 0 && (
                <div className="mt-9 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-6 py-3 text-[0.85rem] font-medium tracking-tight text-cream transition-all duration-300 hover:bg-[var(--accent)]/20"
                    >
                      {link.label}
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
