import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------
   Grad-CAM viewer — a synthetic stand-in for the real notebook output.

   Two stylised scans (chest PA, retinal fundus) sit under a wipe that
   sweeps the class-activation overlay across the frame, which is how the
   original and the heatmap are usually compared side by side.
------------------------------------------------------------------- */

const VIEWS = [
  {
    id: "chest",
    label: "Chest X-ray · PA view",
    task: "Pneumonia",
    finding: "Left lower zone",
    focus: { x: 72, y: 118, r: 21 },
  },
  {
    id: "fundus",
    label: "Retinal fundus · OD",
    task: "Glaucoma",
    finding: "Optic disc cupping",
    focus: { x: 130, y: 94, r: 19 },
  },
];

export default function GradCamSim() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % VIEWS.length), 7200);
    return () => clearInterval(t);
  }, [reduce]);

  const view = VIEWS[i];

  /* The wipe and its divider share one timing so the line always sits on
     the revealed edge. The overlay is clipped by animating the width of an
     overflow-hidden wrapper — the inner square keeps its own size, so the
     scan underneath never squashes as the reveal moves. */
  const SWEEP = { duration: 4.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" };

  return (
    <div className="absolute inset-0 flex flex-col bg-ink-900 font-mono">
      <GradientDefs />
      {/* instrument header */}
      <div className="flex items-center justify-between border-b border-cream/10 px-4 py-2.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={view.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.35 }}
            className="text-[0.58rem] tracking-[0.2em] text-cream-mute uppercase"
          >
            {view.label}
          </motion.span>
        </AnimatePresence>
        <span className="flex items-center gap-1.5 text-[0.55rem] tracking-[0.18em] text-cyan uppercase">
          <span className="size-1.5 rounded-full bg-cyan" />
          Grad-CAM
        </span>
      </div>

      {/* scan stage */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-3">
        <div className="relative aspect-square h-full max-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={view.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* original */}
              <Scan view={view.id} />

              {/* activation overlay, revealed by the wipe */}
              <motion.div
                className="absolute inset-y-0 left-0 overflow-hidden"
                initial={{ width: reduce ? "100%" : "0%" }}
                animate={reduce ? {} : { width: ["0%", "100%"] }}
                transition={SWEEP}
              >
                <div className="aspect-square h-full">
                  <Scan view={view.id} heat focus={view.focus} />
                </div>
              </motion.div>

              {/* the moving divider */}
              {!reduce && (
                <motion.div
                  className="absolute inset-y-0 w-px bg-cream/70"
                  animate={{ left: ["0%", "100%"] }}
                  transition={SWEEP}
                >
                  <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* readout */}
      <div className="flex items-center justify-between border-t border-cream/10 px-4 py-2.5 text-[0.55rem] tracking-[0.18em] uppercase">
        <span className="text-cream-mute">Original</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={view.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-cream-dim"
          >
            {view.task} · {view.finding}
          </motion.span>
        </AnimatePresence>
        <span className="text-cyan">Overlay</span>
      </div>
    </div>
  );
}

/* Defined once for the whole component — both the original and the overlay
   layer reference these, and duplicating them would put repeat ids in the
   document. */
function GradientDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <radialGradient id="gc-tissue" cx="50%" cy="45%">
          <stop offset="0%" stopColor="#1d2530" />
          <stop offset="100%" stopColor="#080b10" />
        </radialGradient>
        <radialGradient id="gc-retina" cx="45%" cy="45%">
          <stop offset="0%" stopColor="#d4643a" />
          <stop offset="60%" stopColor="#a8401f" />
          <stop offset="100%" stopColor="#5e1f0e" />
        </radialGradient>
        {/* the standard jet-style activation ramp */}
        <radialGradient id="gc-cam">
          <stop offset="0%" stopColor="#ff2d1a" stopOpacity="0.95" />
          <stop offset="24%" stopColor="#ffb020" stopOpacity="0.85" />
          <stop offset="48%" stopColor="#a3e635" stopOpacity="0.6" />
          <stop offset="72%" stopColor="#22d3ee" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#1e40ff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="gc-clip-chest">
          <ellipse cx="100" cy="106" rx="80" ry="84" />
        </clipPath>
        <clipPath id="gc-clip-fundus">
          <circle cx="100" cy="100" r="86" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ---------------------------------------------------------------- Scan -- */
function Scan({ view, heat = false, focus }) {
  return (
    <svg viewBox="0 0 200 200" className="size-full">
      {view === "chest" ? <Chest /> : <Fundus />}
      {heat && <Heat view={view} focus={focus} />}
    </svg>
  );
}

/* Stylised PA chest film: dark lung fields against bright bone. */
function Chest() {
  const ribs = [58, 76, 94, 112, 130];
  return (
    <g>
      <rect width="200" height="200" fill="#05070a" />
      <ellipse cx="100" cy="106" rx="80" ry="84" fill="url(#gc-tissue)" />

      {/* lung fields */}
      <path
        d="M93 42 C 65 45 46 72 44 108 C 43 137 54 161 73 167 C 87 171 93 157 94 137 Z"
        fill="#080c12"
      />
      <path
        d="M107 42 C 135 45 154 72 156 108 C 157 137 146 161 127 167 C 113 171 107 157 106 137 Z"
        fill="#080c12"
      />

      {/* ribcage */}
      {ribs.map((y) => (
        <g key={y} fill="none" stroke="#d8e2ee" strokeOpacity="0.22" strokeWidth="2.2">
          <path d={`M95 ${y} Q 68 ${y - 7} 47 ${y + 17}`} />
          <path d={`M105 ${y} Q 132 ${y - 7} 153 ${y + 17}`} />
        </g>
      ))}

      {/* clavicles */}
      <g fill="none" stroke="#e6eef8" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round">
        <path d="M94 46 Q 74 38 52 48" />
        <path d="M106 46 Q 126 38 148 48" />
      </g>

      {/* mediastinum + spine */}
      <path d="M100 92 C 119 92 133 116 129 140 C 125 158 108 166 98 163 Z" fill="#e8eef5" opacity="0.18" />
      <rect x="94" y="36" width="12" height="140" rx="6" fill="#cfd8e3" opacity="0.42" />
      {[52, 68, 84, 100, 116, 132, 148, 164].map((y) => (
        <rect key={y} x="93" y={y} width="14" height="2" rx="1" fill="#05070a" opacity="0.5" />
      ))}

      {/* diaphragm */}
      <path d="M40 158 Q 70 176 96 166 L 96 190 L 40 190 Z" fill="#dce5f0" opacity="0.2" />
      <path d="M160 158 Q 130 176 104 166 L 104 190 L 160 190 Z" fill="#dce5f0" opacity="0.2" />
    </g>
  );
}

/* Stylised fundus photograph: optic disc, macula, vessel arcades. */
function Fundus() {
  return (
    <g>
      <rect width="200" height="200" fill="#05070a" />
      <circle cx="100" cy="100" r="86" fill="url(#gc-retina)" />

      {/* vessel arcades radiating from the disc */}
      <g fill="none" stroke="#7d2412" strokeOpacity="0.75" strokeLinecap="round">
        <path d="M130 94 C 108 78 78 66 46 62" strokeWidth="3.4" />
        <path d="M130 94 C 110 112 82 130 50 140" strokeWidth="3.4" />
        <path d="M130 94 C 118 86 104 60 96 34" strokeWidth="2.4" />
        <path d="M130 94 C 120 108 112 142 108 168" strokeWidth="2.4" />
        <path d="M104 84 C 88 74 70 72 44 78" strokeWidth="1.6" />
        <path d="M108 108 C 92 118 76 126 52 128" strokeWidth="1.6" />
        <path d="M126 80 C 132 62 140 50 150 40" strokeWidth="1.6" />
      </g>

      {/* macula */}
      <ellipse cx="74" cy="106" rx="21" ry="17" fill="#6b2410" opacity="0.55" />

      {/* optic disc and cup */}
      <circle cx="130" cy="94" r="17" fill="#f3d98f" opacity="0.95" />
      <circle cx="130" cy="94" r="9.5" fill="#fdf3d2" />
    </g>
  );
}

/* Activation map: a cool wash over the whole field, hot at the focus. */
function Heat({ view, focus }) {
  const clip = view === "chest" ? "gc-clip-chest" : "gc-clip-fundus";
  return (
    <g>
      <g clipPath={`url(#${clip})`}>
        <rect width="200" height="200" fill="#1e40ff" opacity="0.4" />
        <circle cx={focus.x} cy={focus.y} r={focus.r * 2.6} fill="url(#gc-cam)" />
        {view === "chest" && <circle cx="104" cy="148" r="34" fill="url(#gc-cam)" opacity="0.7" />}
        {view === "fundus" && <circle cx="78" cy="108" r="26" fill="url(#gc-cam)" opacity="0.45" />}
      </g>

      {/* focus annotation */}
      <g fill="none" stroke="#e6f7ff" strokeOpacity="0.85">
        <circle cx={focus.x} cy={focus.y} r={focus.r} strokeWidth="1" />
        <circle cx={focus.x} cy={focus.y} r={focus.r + 7} strokeWidth="0.5" strokeOpacity="0.4" />
        <path d={`M${focus.x + focus.r + 6} ${focus.y - 6} L ${focus.x + 44} ${focus.y - 26}`} strokeWidth="0.8" />
      </g>
      <text
        x={focus.x + 46}
        y={focus.y - 29}
        fill="#e6f7ff"
        fontSize="7"
        letterSpacing="1.2"
        fontFamily="ui-monospace, monospace"
      >
        MODEL FOCUS
      </text>
    </g>
  );
}
