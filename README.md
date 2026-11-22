# mobilyenterprises.com

The Mobily Enterprises website: static pages built with [Eleventy](https://www.11ty.dev/) and
styled with hand-written CSS that follows Material 3 Expressive. It ships no JavaScript, sets no
cookies and has no analytics. GitHub Pages publishes it from `main`.

## Build and check

```sh
npm ci
npm run build            # writes _site/
npm run check            # no JavaScript, valid HTML, internal links, colour contrast
npm run check:external   # the same, and fetches every external link
npm start                # a local server that rebuilds on change
```

Every push to `main` runs `.github/workflows/pages.yml`: it builds, runs `npm run check`, and
deploys `_site` to GitHub Pages (custom domain `mobilyenterprises.com`, from `src/CNAME`). The
workflow also runs once a day, so the Research page picks up new research diary records.

## Change the seed colour

Every colour comes from one seed. Open `lib/colour.js` and change `SEED`:

```js
export const SEED = "#1B6EF3";
```

The next build regenerates every Material 3 colour role (light, dark and high contrast), the
logo, the favicon and the share image (`og.png`) from it, using Google's
`@material/material-color-utilities` in Material 3's Fidelity style: the seed's own colour in the
primary roles, near-neutral surfaces. Today's seed is a vivid blue of the same hue as the blue
vibe64.dev and mercbot.ai share. `npm run check` fails if any text colour pair drops below WCAG AA.

## Product pictures

The pictures of Vibe64, Mercbot and the research diary are screenshots of vibe64.dev, mercbot.ai
and research.mobilyenterprises.com, taken headless, in `src/assets/products/` (WebP). Their
addresses, sizes and descriptions are in `lib/shots.js`; pages show them with
`{% frame "vibe64" %}` (in a window frame) or `{% shot "vibe64" %}` (the picture alone). To refresh
one, take a new screenshot at the same size and replace the file.

## Research

The site doesn't publish research posts of its own. Research is published in the
[AI Research Diary](https://research.mobilyenterprises.com) (`mobily-enterprises/research-diary`),
and the Research page is its front door:

- **Add a research post** by adding a record to the diary's `_research/` folder, in the diary's
  repository. The next build of this site (on a push, or the daily run) lists it.
- At build time, `src/_data/diary.js` reads the newest records (`RD-*.md`) with the GitHub
  contents API and turns them into cards that link into the diary. If the API can't be reached,
  the build carries on and the page shows only its "Read the research diary" button.
  `DIARY_OFFLINE=1 npm run build` builds that fallback on purpose.
- The diary's address is one constant, `diaryUrl` in `src/_data/site.js`.
- The research areas themselves are written in `src/research.njk`.

## Company details

The legal name, ABN, ACN, location, phone and email are all in `src/_data/company.json`. The
footer of every page, the About page and the Organization structured data (JSON-LD) read them
from there, so a change is one line.

## Where things are

- `src/*.njk`: the pages. `src/_includes/`: the layout, header, footer and diary card.
- `src/styles/*.css`: the hand-written styles (base, components, layout, pages, motion), joined
  with the generated tokens into one stylesheet, `/assets/site.css`.
- `lib/colour.js`: the seed and every colour. `lib/shapes.js`: the expressive shapes (as
  clip-path polygons that morph into each other). `lib/motion.js`: spring motion as CSS
  `linear()` curves. `lib/art.js`: the logo and the share image, drawn in code.
  `lib/shots.js`: the product pictures.
  `lib/raster.js`: the PNG icons and share image. `lib/icons.js`: the icons.
- `src/assets/fonts/`: Roboto Flex (variable, Latin subset), under the SIL Open Font Licence
  (`OFL.txt`). No fonts are loaded from anywhere else.
- `tools/check.mjs`: the checks.

## No JavaScript

The output has no script files, no inline event handlers and no `<script>` elements except one
JSON-LD block per page (`type="application/ld+json"`, structured data that browsers never run).
The menu uses the HTML `popover` attribute; motion uses CSS transitions, scroll-driven animations
and cross-document view transitions. `npm run check` enforces all of this.
