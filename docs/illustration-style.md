# Illustration style guide

Every picture in *The Best of Stories* is a hand-coded vector scene. One look
across the whole book: soft, rounded, flat shapes with gentle gradients, warm
light, friendly animals, and calm, safe moods suitable for a baby.

Reference images (render them first and look at them):

- `node tools/preview.mjs s18` → `build/preview/s18-baby-musa.png` — the quality bar.
- `node tools/preview.mjs s00` → `build/preview/s00-kit.png` and `s00b-creatures.png` — the shared kit.

## 1. Technical rules

- One file per scene: `src/art/scenes/sNN-slug.js`. Its default export returns
  `svgDoc({ defs, body })` from `src/art/lib.js` (1000 × 1000, full bleed).
- Use the helpers and the `C` palette from `src/art/lib.js`. **Do not edit
  `lib.js`** — other illustrators are using it at the same time. Put any
  scene-specific helper (a whale, a hoopoe, a granary…) inside your scene file.
- Make every gradient/clip id unique with `const id = ids('sNN')` and `id('name')`.
- Deterministic only: use `rng(seed)`, never `Math.random()`.
- Not allowed: `<text>`, external images, CSS, `<filter>` (blur, drop-shadow,
  turbulence), `mix-blend-mode`, `<foreignObject>`. Glows are radial gradients
  (`glowDef` + `glow`), shadows are translucent shapes.
- Keep each SVG under ~300 KB (the preview prints the size).
- Preview: `node tools/preview.mjs sNN` writes `build/preview/sNN-slug.png`;
  look at it with the Read tool. Check a small version too with
  `node tools/preview.mjs sNN --size 300` (a phone screen in a parent's hand).

## 2. Islamic guidelines (non-negotiable)

- **Never draw a prophet, an angel, or any human being** — no faces, figures,
  silhouettes, hands, feet or shadows of people. Show their presence with
  places, objects, light, footprints, tents, animals and nature.
- Never depict Allah in any form. Allah's help and mercy are shown only as
  soft light, glow and sparkles.
- No idols or statues, no crosses or other religious symbols, no musical
  instruments, no halos.
- Keep to the Quran's version, not other traditions: no rainbow or dove with an
  olive branch for Nuh, no serpent or apple in Adam's garden, no sling for
  Dawud, no Buraq. Follow the accuracy notes in each brief.
- Animals are welcome and should be sweet: simple faces, dot eyes with a
  small white highlight (`eye()` in lib.js), optional rosy cheek. Never scary,
  injured, or hunted.
- Stories with punishment or danger are shown calmly: a swirling wind, empty
  ruins, a dark cloud. Never suffering, weapons in use, blood or fear.

## 3. Look and feel

- **Flat shapes, soft gradients, no outlines.** Strokes only for small details
  (ripples, rings on a trunk, veins on a leaf, sparkles).
- **Light from the upper left** (or from the scene's own light source). Give
  each object a base colour, a darker shade on the side away from the light
  and a small highlight.
- **Depth in 3–5 layers.** Far layers are lighter, hazier and tinted toward
  the sky (`mix(colour, skyColour, 0.4–0.6)`); near layers are richer and
  darker. Frame the picture with foreground elements at the edges (plants,
  rocks, reeds), as picture books do.
- **One clear focal subject**, large (about 25–45 % of the picture), near the
  centre or on a third, with a clean silhouette that contrasts with what is
  behind it. A baby should "get" the picture instantly at 300 px.
- **One colour mood per scene** (dawn pinks and peach, bright day blues and
  greens, golden desert, deep-blue night with gold lights…). Use the `C`
  palette; keep colours pleasant and harmonious, never neon or muddy.
- **Small details for richness** (sparkles, flowers, pebbles, ripples, far
  birds, stars) — but they stay secondary to the subject.
- Add 1–3 cute animals where the story allows; babies love them.
- Keep important content at least 40 px from every edge (the page is printed
  edge to edge and may be trimmed).
- Finish with a soft vignette: `vignetteDef(id('vig'), C.ink, 0.15–0.25)` in
  defs and `vignette(id('vig'))` as the last layer.

## 4. Checklist before you call a scene done

1. It renders without errors at 1000 px and still reads clearly at 300 px.
2. Nothing human anywhere (look again at small shapes in the background).
3. It matches its brief, including the accuracy notes and counts.
4. It sits comfortably next to `s18-baby-musa.png`: same softness, same
   finish, same level of detail.
5. No awkward tangents, accidental gaps or seams between layered shapes, no
   shapes that look broken where they meet the frame.
