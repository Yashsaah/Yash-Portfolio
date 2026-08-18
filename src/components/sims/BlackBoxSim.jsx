import { motion, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------
   A preview of the Black Box site itself — the three research cards it
   actually publishes, rather than a generic grey wireframe. Each card
   carries a small live diagram of the idea it explains.
------------------------------------------------------------------- */

const CARDS = [
  { kicker: "Generalization", title: "Double Descent", hue: "#2dd4bf", Figure: DoubleDescent },
  { kicker: "Interpretability", title: "Grad-CAM", hue: "#ec4899", Figure: HeatGrid },
  { kicker: "Efficiency", title: "Lottery Ticket", hue: "#8b5cf6", Figure: Subnetwork },
];

export default function BlackBoxSim() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 flex flex-col bg-ink-900 font-mono">
      {/* browser chrome */}
      <div className="flex shrink-0 items-center gap-3 border-b border-cream/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-coral/70" />
          <span className="size-2 rounded-full bg-amber/70" />
          <span className="size-2 rounded-full bg-lime/70" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-cream/10 bg-ink-800 px-3 py-1">
          <span className="size-1.5 shrink-0 rounded-full bg-lime" />
          <span className="truncate text-[0.55rem] tracking-wide text-cream-mute">
            blackbox-research.vercel.app
          </span>
        </div>
      </div>

      {/* masthead */}
      <div className="shrink-0 px-4 pt-3.5 pb-2">
        <p className="font-display text-[0.95rem] font-semibold tracking-tight text-cream">
          Black Box
        </p>
        <p className="mt-0.5 text-[0.5rem] tracking-[0.22em] text-cream-mute uppercase">
          AI research group
        </p>
      </div>

      {/* research cards */}
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-px bg-cream/10">
        {CARDS.map(({ kicker, title, hue, Figure }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-w-0 flex-col gap-2 bg-ink-900 p-2.5"
          >
            <div className="flex min-h-0 flex-1 items-center justify-center rounded border border-cream/10 bg-[#060609] p-2">
              <Figure hue={hue} reduce={reduce} />
            </div>
            <p
              className="truncate text-[0.44rem] tracking-[0.18em] uppercase"
              style={{ color: hue }}
            >
              {kicker}
            </p>
            <p className="truncate font-display text-[0.7rem] font-semibold tracking-tight text-cream">
              {title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Every figure keeps its aspect ratio — stretching turned the nodes into
   ellipses and the activation cells into bars at dialog size. */
const FIG = "size-full";
const BOX = "0 0 100 60";

/* Test error falls, spikes at the interpolation threshold, falls again. */
function DoubleDescent({ hue, reduce }) {
  return (
    <svg viewBox={BOX} className={FIG}>
      <g stroke="#f6f2e9" strokeOpacity="0.16" strokeWidth="0.6">
        <line x1="10" y1="6" x2="10" y2="52" />
        <line x1="10" y1="52" x2="94" y2="52" />
      </g>
      {/* interpolation threshold */}
      <line x1="52" y1="6" x2="52" y2="52" stroke="#f6f2e9" strokeOpacity="0.22" strokeWidth="0.6" strokeDasharray="2.5 2.5" />

      <motion.path
        d="M12 16 C 24 38 31 44 39 44 C 46 44 49 26 52 10 C 58 28 70 40 82 46 C 88 48 91 49 94 49"
        fill="none"
        stroke={hue}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      <circle cx="52" cy="10" r="2" fill={hue} />
    </svg>
  );
}

/* Last conv layer, gradient weighted — hot near the middle. */
function HeatGrid({ hue, reduce }) {
  const cols = 8;
  const rows = 5;
  const cell = 11;
  const gap = 0.9;
  const w = cols * cell;
  const h = rows * cell;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={FIG}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          /* distance from the hot centre drives opacity */
          const d = Math.hypot((c - 4.1) / 4, (r - 2.2) / 2.6);
          const s = Math.max(0, 1 - d);
          return (
            <motion.rect
              key={`${r}-${c}`}
              x={c * cell + gap}
              y={r * cell + gap}
              width={cell - gap * 2}
              height={cell - gap * 2}
              rx="1"
              fill={hue}
              initial={false}
              animate={
                reduce
                  ? { opacity: s * 0.9 + 0.05 }
                  : { opacity: [s * 0.6 + 0.05, s * 0.95 + 0.07, s * 0.6 + 0.05] }
              }
              transition={{ duration: 2.8, repeat: Infinity, delay: d * 0.45, ease: "easeInOut" }}
            />
          );
        }),
      )}
    </svg>
  );
}

/* A sparse subnetwork that matches the dense one it came from. */
function Subnetwork({ hue, reduce }) {
  const layers = [
    [10, 22, 34, 46],
    [14, 30, 46],
    [18, 38],
  ];
  const xs = [14, 50, 86];
  /* the edges that survive pruning: [input, hidden, output] */
  const ticket = [
    [0, 1, 0],
    [3, 1, 1],
  ];

  return (
    <svg viewBox={BOX} className={FIG}>
      {/* dense edges */}
      {layers[0].map((y1, a) =>
        layers[1].map((y2, b) => (
          <line key={`a${a}${b}`} x1={xs[0]} y1={y1} x2={xs[1]} y2={y2} stroke="#f6f2e9" strokeOpacity="0.1" strokeWidth="0.4" />
        )),
      )}
      {layers[1].map((y1, a) =>
        layers[2].map((y2, b) => (
          <line key={`b${a}${b}`} x1={xs[1]} y1={y1} x2={xs[2]} y2={y2} stroke="#f6f2e9" strokeOpacity="0.1" strokeWidth="0.4" />
        )),
      )}

      {/* the winning ticket */}
      {ticket.map(([a, b, c], i) => (
        <g key={i}>
          <line x1={xs[0]} y1={layers[0][a]} x2={xs[1]} y2={layers[1][b]} stroke={hue} strokeWidth="1.3" strokeOpacity="0.9" />
          <line x1={xs[1]} y1={layers[1][b]} x2={xs[2]} y2={layers[2][c]} stroke={hue} strokeWidth="1.3" strokeOpacity="0.9" />
          {!reduce && (
            <motion.circle
              r="1.6"
              fill={hue}
              initial={{ cx: xs[0], cy: layers[0][a], opacity: 0 }}
              animate={{
                cx: [xs[0], xs[1], xs[2]],
                cy: [layers[0][a], layers[1][b], layers[2][c]],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7, ease: "linear" }}
            />
          )}
        </g>
      ))}

      {/* nodes */}
      {layers.map((ys, l) =>
        ys.map((y, n) => (
          <circle key={`${l}-${n}`} cx={xs[l]} cy={y} r="2.1" fill="#8e887d" fillOpacity="0.7" />
        )),
      )}
    </svg>
  );
}
