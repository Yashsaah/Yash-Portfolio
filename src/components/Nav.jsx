import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { navLinks, profile } from "../data/content";

export default function Nav() {
  const [shrunk, setShrunk] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  /* Shrink once the hero has scrolled past — matches the reference behaviour
     of a transparent bar that becomes a solid, compact one. */
  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the section currently occupying the upper third of the viewport. */
  useEffect(() => {
    const ids = ["home", ...navLinks.map((l) => l.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ paddingTop: shrunk ? 0 : 18, paddingLeft: shrunk ? 0 : 18, paddingRight: shrunk ? 0 : 18 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.nav
          animate={{
            height: shrunk ? 64 : 74,
            borderRadius: shrunk ? 0 : 999,
            backgroundColor: shrunk ? "rgba(8,8,12,0.85)" : "rgba(18,18,26,0.45)",
            borderColor: shrunk ? "rgba(246,242,233,0.10)" : "rgba(246,242,233,0.09)",
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex max-w-[1400px] items-center justify-between border px-3 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.75)] backdrop-blur-xl md:px-4"
        >
          {/* Wordmark */}
          <a href="#home" className="group flex items-center gap-2.5 rounded-full py-1.5 pr-3 pl-1.5">
            <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet via-coral to-amber transition-transform duration-300 group-hover:scale-105">
              <span className="absolute inset-[1.5px] rounded-full bg-ink-800" />
              <span className="relative font-display text-[0.8rem] font-bold text-cream">Y</span>
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[0.9rem] font-semibold tracking-tight text-cream">
                {profile.name}
              </span>
              <span className="mt-1 font-mono text-[0.6rem] tracking-wider text-cream-mute">
                {profile.location}
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-cream/8 bg-cream/[0.03] p-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`relative block rounded-full px-3.5 py-1.5 text-[0.8rem] tracking-tight transition-colors duration-300 ${
                    active === link.id ? "text-ink-900" : "text-cream-mute hover:text-cream"
                  }`}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-cream"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Phone — quiet secondary action */}
            <a
              href={profile.phoneHref}
              className="hidden items-center gap-2 rounded-full border border-cream/12 px-4 py-2 font-mono text-[0.72rem] tracking-wide text-cream-dim transition-colors duration-300 hover:border-cream/30 hover:text-cream xl:inline-flex"
            >
              <span className="size-1.5 rounded-full bg-lime" />
              {profile.phone}
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="group relative hidden overflow-hidden rounded-full bg-cream px-5 py-2.5 text-[0.8rem] font-medium tracking-tight text-ink-900 sm:inline-flex sm:items-center sm:gap-1.5"
            >
              <span className="relative z-10">Get in touch</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
              <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-amber via-coral to-violet transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex size-10 flex-col items-center justify-center gap-[5px] rounded-full border border-cream/15 transition-colors hover:border-cream/35 lg:hidden"
            >
              <span className="h-px w-4 bg-cream" />
              <span className="h-px w-4 bg-cream" />
            </button>
          </div>
        </motion.nav>

        {/* Scroll progress hairline */}
        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-gradient-to-r from-violet via-coral to-amber"
          animate={{ opacity: shrunk ? 1 : 0 }}
        />
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-ink-900/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex size-11 items-center justify-center rounded-full border border-cream/15 text-xl text-cream"
                >
                  ×
                </button>
              </div>
              <ul className="mt-auto mb-auto space-y-2">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      className="display block py-2 text-[2.6rem] text-cream"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="space-y-3">
                <a
                  href={profile.phoneHref}
                  className="flex items-center justify-center gap-2 rounded-full border border-cream/15 px-6 py-3.5 text-center font-mono text-[0.8rem] tracking-wide text-cream-dim"
                >
                  <span className="size-1.5 rounded-full bg-lime" />
                  {profile.phone}
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-cream px-6 py-4 text-center text-sm font-medium text-ink-900"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
