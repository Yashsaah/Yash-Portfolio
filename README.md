# Yash Kumar Sah — Portfolio

A single-page portfolio built with React 19, Vite, Tailwind CSS v4 and Framer Motion.

---

## 1. Add your photos (do this first)

Three image slots are wired up. Until a file exists, the site renders a tinted
placeholder in its place — the layout never breaks, but the real photos are what
make the page land.

Save your images into `public/images/` with **exactly** these names:

| File | What it should be |
| --- | --- |
| `public/images/yash.jpg` | Your portrait (the rooftop photo with Kathmandu behind you). Portrait orientation works best — it runs full-height down the right side of the hero. |
| `public/images/vision-drive.jpg` | The Vision Drive prototype — the ESP-32 chassis with the motor driver and battery pack. |
| `public/images/research.jpg` | A Grad-CAM heatmap / medical-scan visualisation from the interpretability work. |
| `public/images/blackbox.jpg` | A screenshot of the Blackbox Research app. |

`.jpg`, `.png` and `.webp` all work — if you use a different extension, update the
`image` field for that project in `src/data/content.js`.

For the portrait: aim for something around 1200×1600 or larger. The hero crops it
to `object-[62%_22%]` (biased right and toward the top) so your face stays in
frame as the column resizes — tweak that value in `src/components/Hero.jsx` if
your crop sits differently.

## 2. Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## 3. Deploy

The build output is a static `dist/` folder, so any static host works.

**Vercel** — push to GitHub, import the repo, accept the detected defaults
(framework: Vite, build: `npm run build`, output: `dist`).

**Netlify** — same, with build command `npm run build` and publish directory `dist`.

**GitHub Pages** — set `base: "/<repo-name>/"` in `vite.config.js` first, then
deploy `dist/`.

---

## Editing content

**Almost everything lives in one file: [`src/data/content.js`](src/data/content.js).**
Text, projects, skills, awards, links and the marquee all come from there — you
should rarely need to touch a component to update the site.

- `profile` — name, headline, intro, email, social links. `headlineAccentIndex`
  picks which headline line renders in the serif italic gradient.
- `stats` — the three figures under the hero buttons.
- `about` — the narrative paragraphs and the quick-facts table.
- `skills` — each card's title, blurb, item list and accent colour.
- `projects` — the full case studies, including `stack` chips and `links`.
- `achievements` — awards, most significant first.

Accent colours are named (`violet`, `cyan`, `amber`, `coral`, `lime`) and defined
once in [`src/lib/accents.js`](src/lib/accents.js). Each card passes its accent
down as a `--accent` CSS variable, which tints its text, borders and hover glow.

## Structure

```
src/
  data/content.js       all copy and project data
  lib/accents.js        accent palette → --accent CSS variable
  components/
    ui.jsx              Reveal, RevealWords, SectionHeading, Marquee,
                        SmartImage, Chip — shared primitives
    Nav.jsx             shrinking sticky nav + scroll progress + mobile overlay
    Hero.jsx            pinned hero, full-bleed portrait, skills marquee
    About.jsx           narrative + quick facts
    Skills.jsx          eight capability cards with cursor-tracking glow
    Projects.jsx        alternating case-study rows with parallax images
    Achievements.jsx    awards list
    Contact.jsx         CTA, social grid, footer
  index.css             design tokens, custom utilities, base styles
```

## Design notes

- **Type** — Bricolage Grotesque for display, Instrument Serif italic for the
  accent words, Inter for body copy, JetBrains Mono for kickers and labels.
- **Colour** — a near-black ink base with warm cream type, lit by a five-hue
  accent spectrum. Each section owns a different part of that spectrum so the
  page has movement without turning into confetti.
- **Motion** — one easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`) everywhere.
  All entrances run through `Reveal` / `RevealWords` so timing stays consistent.
  Everything collapses under `prefers-reduced-motion`.
- **The hero pin** — on desktop the hero sticks while the rounded content slab
  scrolls up over it. Below `lg`, and on short windows, it falls back to normal
  flow so nothing is ever clipped.
