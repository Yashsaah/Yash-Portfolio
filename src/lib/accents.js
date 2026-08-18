/* Accent hues travel down the tree as a CSS variable rather than a class name,
   so any component can tint its text, border and glow from a single source and
   Tailwind never has to see a dynamically-built class string. */
export const ACCENTS = {
  violet: "#7c5cff",
  cyan: "#22d3ee",
  amber: "#ffb020",
  coral: "#ff5f6d",
  lime: "#a3e635",
};

export const accentVar = (name) => ({ "--accent": ACCENTS[name] ?? ACCENTS.violet });
