import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { skills } from "../data/content";
import { Reveal } from "./ui";
import { ACCENTS, accentVar } from "../lib/accents";

/* ------------------------------------------------------------------
   Skills as a network rather than a list.

   The six groups are the hidden layer of a small net. Hovering a row
   lights its node and the edges running through it, so the graph is a
   legend for the list instead of decoration beside it.
------------------------------------------------------------------- */

const IN = [46, 82, 118, 154];
const OUT = [64, 110, 156];
const X = { in: 26, mid: 112, out: 198 };

export default function Skills() {
  const [active, setActive] = useState(null);
  const groups = skills.groups;
  const mid = groups.map((_, i) => 28 + i * 29);

  return (
    <section id="skills" className="relative border-t border-cream/10 py-28 md:py-40">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.13]"
        style={{ background: "radial-gradient(70% 100% at 50% 0%, #7c5cff 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-cream/25" />
            <span className="kicker">01 — Skills</span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* ---------------------------------------------- Graph rail -- */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="display text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[0.95] text-cream">
              {skills.heading}
            </h2>

            <Reveal delay={0.12}>
              <div className="hairline mt-8 rounded-2xl bg-ink-900/60 p-4">
                <Network groups={groups} mid={mid} active={active} />
                <p className="mt-3 px-1 font-mono text-[0.58rem] tracking-[0.16em] text-cream-mute uppercase">
                  {active === null ? "6 units · hover to trace" : groups[active].label}
                </p>
              </div>
            </Reveal>
          </div>

          {/* -------------------------------------------------- Groups -- */}
          <ul className="border-t border-cream/10">
            {groups.map((g, i) => (
              <motion.li
                key={g.label}
                style={accentVar(g.accent)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group relative border-b border-cream/10"
              >
                {/* accent rule that draws in from the left on hover */}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />

                <div className="flex items-baseline gap-5 py-6 transition-[padding] duration-500 group-hover:pl-3">
                  <span className="w-6 shrink-0 font-mono text-[0.62rem] text-cream-mute tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="size-1.5 rotate-45 bg-[var(--accent)] transition-transform duration-500 group-hover:rotate-[135deg]" />
                      <p className="kicker">{g.label}</p>
                    </div>
                    <p className="read mt-2.5 text-[1.22rem] leading-[1.5] text-cream-dim transition-colors duration-300 group-hover:text-cream">
                      {g.items}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Network -- */
function Network({ groups, mid, active }) {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 224 200" className="w-full">
      {/* edges: inputs → groups */}
      {IN.map((y1, a) =>
        mid.map((y2, b) => (
          <line
            key={`i${a}-${b}`}
            x1={X.in}
            y1={y1}
            x2={X.mid}
            y2={y2}
            stroke={active === b ? ACCENTS[groups[b].accent] : "#f6f2e9"}
            strokeOpacity={active === b ? 0.55 : active === null ? 0.07 : 0.03}
            strokeWidth={active === b ? 0.9 : 0.5}
            className="transition-all duration-500"
          />
        )),
      )}

      {/* edges: groups → outputs */}
      {mid.map((y1, a) =>
        OUT.map((y2, b) => (
          <line
            key={`o${a}-${b}`}
            x1={X.mid}
            y1={y1}
            x2={X.out}
            y2={y2}
            stroke={active === a ? ACCENTS[groups[a].accent] : "#f6f2e9"}
            strokeOpacity={active === a ? 0.55 : active === null ? 0.07 : 0.03}
            strokeWidth={active === a ? 0.9 : 0.5}
            className="transition-all duration-500"
          />
        )),
      )}

      {/* signal pulses travelling the graph */}
      {!reduce &&
        [0, 1, 2, 3].map((n) => {
          const from = IN[n % IN.length];
          const to = mid[(n * 2) % mid.length];
          return (
            <motion.circle
              key={n}
              r="1.6"
              fill={ACCENTS[groups[(n * 2) % groups.length].accent]}
              initial={{ cx: X.in, cy: from, opacity: 0 }}
              animate={{ cx: [X.in, X.mid, X.out], cy: [from, to, OUT[n % OUT.length]], opacity: [0, 1, 0] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                delay: n * 0.8,
                ease: "linear",
                times: [0, 0.5, 1],
              }}
            />
          );
        })}

      {/* input nodes */}
      {IN.map((y) => (
        <circle key={y} cx={X.in} cy={y} r="2.6" fill="#f6f2e9" fillOpacity="0.2" />
      ))}

      {/* group nodes */}
      {mid.map((y, i) => {
        const on = active === i;
        return (
          <g key={y}>
            {on && (
              <circle cx={X.mid} cy={y} r="11" fill={ACCENTS[groups[i].accent]} fillOpacity="0.14" />
            )}
            <circle
              cx={X.mid}
              cy={y}
              r={on ? 5.4 : 4}
              fill={on ? ACCENTS[groups[i].accent] : "#0d0d14"}
              stroke={ACCENTS[groups[i].accent]}
              strokeOpacity={on ? 1 : 0.5}
              strokeWidth="1"
              className="transition-all duration-500"
            />
          </g>
        );
      })}

      {/* output nodes */}
      {OUT.map((y) => (
        <circle key={y} cx={X.out} cy={y} r="2.6" fill="#f6f2e9" fillOpacity="0.2" />
      ))}
    </svg>
  );
}
