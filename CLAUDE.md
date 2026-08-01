# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm run dev` or `pnpm start` - Start development server
- `pnpm run build` - Build the site for production
- `pnpm run preview` - Preview the production build locally
- `pnpm run sanity` - Start Sanity Studio for content management

## Project Architecture

This is an Astro-based portfolio website for an Interactive Media Artist, featuring a hybrid approach with both static content and React components for interactive elements.

**The site was rebuilt in a six-phase "studio refactor" (2026).** The result is a deliberately quiet, editorial/technical-journal design system: two fonts, three type scales, a binary palette, hairline framing. The Design System section below is the source of truth for all presentation decisions — read it before changing any styling, and prefer extending tokens over adding one-off values.

### Key Technologies
- **Astro 7.1.3** - Main framework with experimental client prerender enabled
- **React 19** - For interactive components (Three.js scenes, animations, LastFM integration)
- **Sanity CMS** - Headless CMS for blog content management with Portable Text support (@sanity/astro, @sanity/client, @portabletext/react)
- **Three.js 0.182** - 3D graphics via React Three Fiber ecosystem (@react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing)
- **TypeScript** - Type safety throughout the codebase
- **MDX** - For content authoring in works (blog is Sanity-backed; see Content Architecture)
- **IBM Plex Sans + IBM Plex Mono** - The only two typefaces, self-hosted via `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono`
- **GSAP & Motion** - Animation libraries
- **Lenis** - Smooth scrolling (astro-lenis integration)
- **Leva** - GUI controls for development/debugging 3D scenes
- **r3f-perf** - React Three Fiber performance monitoring

## Design System

All presentation resolves through tokens in `src/styles/global.css` `:root`. **No component should declare a raw font family, a hex color, or an arbitrary font size.**

**Typography — exactly two families, four font files:**
- `--font-sans` (IBM Plex Sans) for UI, headings, prose; `--font-mono` (IBM Plex Mono) for metadata, dates, index columns, captions, code, locators
- Loaded in `BaseHead.astro`: Sans 400 / 500 / 400-italic, Mono 400 — **latin subset only** (it covers Spanish diacritics: á é í ó ú ñ ü ¿ ¡). The two workhorse files are preloaded. No external font requests
- **Fontsource gotcha:** the per-subset files (`latin-400.css`) carry no `unicode-range`, so importing latin **and** latin-ext stacks duplicate `@font-face` blocks where latin-ext shadows latin. To add a subset, switch to the combined `400.css` imports instead
- `--weight-heading: 500` is the only weight above 400. Do not introduce 600/700 — they are not loaded and render as faux-bold
- Three scales only: `--type-display`, `--type-body` (~16–17px), `--type-meta`, plus `--type-title` for post headers. The scale is intentionally small/quiet — do not scale text up without asking
- Tracking: `letter-spacing: -0.01em` on display sizes only; `0.08em` on small uppercase mono labels. Never on body text

**Italic policy (strict):** exactly one italic on the entire site — the homepage thesis quote (`.thesis-text`). A global rule renders `em, i` upright at the heading weight. Do not reintroduce `font-style: italic` anywhere else.

**Palette:** binary plus one accent — `--color-bg` (#0d0d0d), `--color-ink` (#f2f0eb), `--color-accent` (#ee5858, reserved for hover/link states, never static decoration). Neutrals derive from `--color-ink-rgb` at low alpha; named roles are `--text-secondary` (0.75) and `--text-muted` (0.55). No gradients, no shadows, no border-radius beyond 2px, no decorative color.

**Measures & rhythm:** `--measure` (65ch prose), `--measure-wide` (88ch figures), `--content-max` (68rem — every content column caps through it), `--space-section`, `--left-rail`, `--page-padding`.

**Responsive tiers** (token-level — pages inherit them automatically): desktop `--left-rail: 22rem`; laptops ≤1440px → 17rem; tablets ≤1100px → 8rem; mobile ≤768px → pages zero the rail and use 1.5rem gutters. The WorkIndex preview pane drops below 900px; the footer columns wrap via `auto-fit` with no breakpoint. Total desktop envelope ≈ rail + 68rem + margins ≈ 1500px, left-anchored (extra ultrawide space stays on the right by design).

**Framing (phase 5):** `--frame-inset`, `--frame-opacity` (0.14), `--frame-mark-opacity` (0.3). All strokes are **0.5px**; framing should be perceived before it is seen — calibrate opacity **downward**, never up. (The post body's vertical gutter rules were later removed at Óscar's request — don't reintroduce them.)

**Conventions:**
- Dates are always ISO `YYYY-MM-DD`, mono, with tabular numerals (`font-variant-numeric: tabular-nums`)
- Metadata uses labeled pairs (`DATE 2026-01-01`) in mono uppercase, semantically a `<dl>` where it's a real list
- Shared index-row classes (`.index-list`, `.index-row`, `.index-row-meta`, `.index-row-title`, `.index-group-label`) in `global.css` are used by **both** the Work index and the Writing index — they share structural DNA by design

### Content Architecture

The site uses both Astro's content collections and Sanity CMS. **Important:** the blog is fully Sanity-backed — the `src/content/blog/` collection does NOT render as pages. You cannot publish a blog post by dropping an MDX file.

**Astro Content Collections (`src/content.config.ts`):**
- `src/content/works/` - Portfolio works (`.mdx`, organized into year subfolders). Required: `title`, `description`, `pubDate`, `workType` (**array** of the enum below). Optional: `heroImage`, `updatedDate`, `year`, `tools`, plus the **editorial fields**: `medium` (short lowercase index label, derived from `workType` when absent), `intent` (single case-study paragraph), `processMedia` (image array, two-up grid), `technicalDetail`, `stack` (falls back to `tools`), `role`, and `featuredOrder` (works carrying this number become the homepage's three featured sections, sorted ascending)
- `src/content/blog/` - Legacy blog MDX. **Currently orphaned** — its only consumers (`RelatedArticles.astro`, `BlogPostsNotifier.astro`) are no longer imported anywhere
- `src/drafts/` - Unpublished scratch/staging markdown. NOT wired into any collection or route

**Sanity CMS (the live blog source):**
- Project ID / dataset via env vars (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`)
- Helpers in `src/lib/sanity.ts` — `getAllPosts()`, `getPostBySlug(slug)`, `getAllPostSlugs()`, and the `urlFor()` image builder; `SanityPost` interface
- Schema in `sanity/schemas/post.ts`. Beyond the basics (`title`, `slug`, `summary`, `publishedAt`, `mainImage`, `tags`, `body`) it carries the **editorial fields**: `deck` (one-sentence standfirst under the title), `heroCaption` (**required whenever a main image is set**), `heroCredit`, `heroWidth` (`text|wide|full`), and `meta` (array of `{label, value}` pairs appended to the header metadata row). Body images additionally take a `width` field
- **GOTCHA:** GROQ returns `null` — not `undefined` — for absent fields, so Astro prop destructuring defaults do **not** fire. Always coalesce with `??` (this has crashed the build via a spread of a null array)
- Portable Text rendering via `PortableTextRenderer.tsx`

**Work Categories (`workType` — STRICT ENUM array; each work declares one or more):**
- `Games` - Videogame development
- `Installations` - Interactive / gallery installations
- `Sound & Music` - Sound and music experiments
- `Web & Code` - Web tools and creative coding

Two additional practice areas exist as standalone pages (NOT works-collection MDX): **3D Animation / A-visuals** → `/3Dworks`, and **Videoart** → `/videoart`. Both keep a row in the Work index so they stay reachable.

### Component Structure

**Chrome (on every rendered page):**
- `src/components/ModifiedHeader.astro` - **The header on every rendered page.** Renders `MutatingSubheader` + `LastFm` + `Navbar` + `Ornaments` + `PageFrame`. Because there is no shared base layout, this is where site-wide fixed furniture mounts. Props: `animated` (homepage only — sequential quote → header reveal; the navbar items then fade in from the left via pure CSS, staggered), `goWild` + `sortSpeed` (aboutMe — tune the text scramble)
- `src/components/Navbar.astro` - Four destinations only: **Work · About · Writing · Contact**. Fixed **top-right**, laid out as a horizontal row (it was formerly a vertical left rail). Collapses to a hamburger below 768px. Accepts `animated`. Also hosts the `ClientRouter` and a global `footer-in-view` observer (now a visual no-op since the site ground is uniformly dark — dead weight, safe to remove in a cleanup)
- `src/components/PageFrame/PageFrame.astro` - The fixed 0.5px hairline page frame with L-shaped corner marks, plus ambient corner data: **bottom-left = live mouse coordinates** (`pointermove` + rAF), **bottom-right = current date** (server-rendered fallback, replaced client-side with the viewer's local date). `pointer-events: none`, `aria-hidden`, hidden in `@media print`; corner data hidden below 768px
- `src/components/Footer/Footer.astro` - A left-anchored **colophon**, not a utility bar: three mono columns — labeled `Index` and `Elsewhere`, then an unlabeled rights/version column (`© year · Querétaro, MX` and `v.<git hash>`). Opening hairline only; the phase 5 frame supplies the page's bottom edge. External links marked with `↗`. Entirely `--type-meta` mono. **No social icon graphics** (the SVGs in `Footer/icons/` are now only used by the orphaned `aboutMe.astro`)

**Editorial / index components:**
- `src/components/WorkIndex/WorkIndex.astro` - The typographic work index (`year — title — medium` rows + a sticky hover-preview pane). Uses the shared `.index-row` classes; the preview swap is a delegated `mouseover`/`focusin` listener
- `src/components/SignatureLayer/SignatureLayer.astro` - Generative canvas behind the homepage thesis
- `src/components/FlowShader/FlowShader.astro` - Full-bleed Three.js shader band on the homepage
- `src/components/PortableTextRenderer.tsx` - Sanity Portable Text renderer. Figures opt into the article grid via `data-width`; links whose visible text is a URL get `.link-locator` (mono), external links get `.link-external` (`↗` marker)

**Interactive components:**
- `src/components/3DIndex/` - Three.js scenes (AnimanoirLogoScene, ModelANLogo, AndrosFetal/, SceneIndex, useScrollEffect.js)
- `src/components/LastFm.jsx` - LastFM now-playing readout (rendered inside `ModifiedHeader`)
- `src/components/MutatingSubheader.jsx` - Header text scramble
- `src/components/MagicHeading.jsx` - Animated heading (used by `/3Dworks`)
- `src/components/RandomVideo/`, `src/components/YouTubeGrid/` - Media components used by `/3Dworks`
- `src/components/hooks/` - Shared React hooks (`useArrayRef.js`, `useLastFmData.js`)

**Utility components:**
- `src/components/BaseHead.astro` - HTML head, font imports/preloads, JSON-LD
- `src/components/FormattedDate.astro` - ISO date in mono/tabular
- `src/components/Ornaments.astro` - Decorative elements
- `src/components/SEO.jsx`, `src/components/HeaderLink.astro`

**Orphaned — referenced by nothing that renders.** Do not treat these as live, and do not "fix" them without asking whether they should simply be deleted:
- `ProjectGrid/` (replaced by `WorkIndex`; only a Navbar comment still mentions it), `RelatedArticles.astro`, `BlogPostsNotifier.astro` (both dropped by the phase 4 post template), `HoverTextEffect/`, `MutatingAbout/`, `Misc/LorenzAttractor.jsx`, `CanvasAbout.jsx`
- `src/layouts/MainLayout.astro` → `src/layouts/index.astro` and the `Header.astro` + `SceneIndex` it pulls in — this chain is not wired to any route. **`ModifiedHeader` is the real header**

### Routing Structure

- `/` - **Narrative homepage.** A thesis section (`#about`, full viewport) carrying the italic quote over `SignatureLayer`, plus the bio and contact/CV links; then a full-bleed `FlowShader` band; then **three featured works** (one per viewport, media alternating sides), selected by the `featuredOrder` frontmatter flag. Reveal-on-scroll honors `prefers-reduced-motion`. This is no longer a works listing — that lives at `/work`
- `/work` - **The works index** (`WorkIndex.astro`): hairline-separated typographic rows with a hover preview pane, plus rows for `/3Dworks` and `/videoart`
- `/works/[...slug]` - Individual case studies via `WorkPost.astro`. Fixed sequence: hero figure → intent → MDX body → process media → technical note → metadata footer → **wraparound** prev/next (no dead ends). The hero is capped at `--measure-wide` in a 16:10 box — a composed figure, not a banner. Build **warns** about works missing `intent` / `role` / `stack`
- `/blog` - **Writing index**: year-grouped rows of `date · title` using the shared index-row classes. No covers, no excerpts. (The old `LAYOUT_MODE` scatter/Are.na layout was removed; reading time was removed at Óscar's request)
- `/blog/[...slug]` - Sanity posts via `BlogPost.astro`. Built on **one CSS grid with named lines** — `full-start / wide-start / text-start / text-end / wide-end / full-end`. Every child defaults to the 65ch text column; media opts into `wide` or `full` via `data-width`. The grid is **left-anchored** (all widths share a left edge), which is what guarantees captions and prose can never misalign with wide figures. Body blocks join the grid because the renderer wrapper is `display: contents`. Sequence: eyebrow → balanced title → deck → labeled `<dl>` metadata → hairline → 4:3 captioned hero figure → body → footer (tags, prev/next, back-to-index). Build **warns** about posts with a hero but no `heroCaption`
- `/aboutMe` - About page with canvas animations. **Orphaned from the nav** (the homepage `#about` section replaced it) and renders no Footer
- `/3Dworks` - 3D animation / A-visuals showcase
- `/videoart` - Videoart showcase
- `/photodiary` - Photo diary page (Are.na backed; renders no Footer)
- `/rss.xml` - RSS feed combining works (collection) and posts (Sanity)

### Configuration Notes

**Astro Config:**
- Site URL: https://animanoir.xyz
- Integrations: MDX, Sitemap, React, Lenis, Sanity
- Image service configured with Sharp: quality 90, formats avif/webp/jpg, max 1920x1080, fit cover
- Allowed image domains: YouTube, S3, Notion, Are.na, CloudFront, Sanity CDN
- Prefetch enabled with `prefetchAll: true`; experimental client prerender enabled
- Vite config includes Three.js alias resolution and custom asset naming to avoid Netlify path-traversal issues with `[...slug]` routes

**TypeScript Config:**
- Path aliases: `@/*` maps to `src/*`
- Three.js specific path mappings for proper module resolution

### Asset Management
- Images organized by category in `src/images/` (blog, works, about)
- Video assets in `src/images/videos/` and work-specific directories
- `src/scripts/imageLoader.js` - adds a `.loaded` class for image fade-ins
- Removed works are archived (non-rendering) under repo-root `archive/works-removed/`

### API Integration
- **Sanity CMS** - Primary content management system with Portable Text support
- **Notion API** - Additional dynamic content integration (`@notionhq/client`)
- **LastFM API** - Music data display and now playing information
- **Are.na API** - Photodiary content (note: this endpoint intermittently 504s during builds; the page still builds)
- **RSS feed** - Automated feed generation

### Development Notes
- Uses ES modules (`"type": "module"` in package.json)
- Prettier configured with Astro plugin; environment variables via dotenv
- `src/lib/buildMeta.ts` exposes `buildVersion()` — the short git commit hash read at build time (`git rev-parse --short HEAD`), falling back to a `v.YYYY.MM` date stamp. Used by the Footer colophon
- **Build-time content reports:** the works and blog routes deliberately `console.warn` about missing editorial fields rather than rendering placeholders. These warnings are a to-do list for Óscar, not build failures
- Site identity constants in `src/consts.ts` (`SITE_TITLE` "Óscar A. Montiel", `SITE_SUBTITLE` "Creative Developer & Interactive Media Artist", `SITE_DESCRIPTION`). The homepage intentionally uses the longer "Creative **Software** Developer & Interactive Media Artist" in its `<BaseHead title>` and thesis intro — don't "fix" this to match `consts.ts`
- **Positioning:** the tone is creative-technologist — "Creative Developer" is intentional (studio roles, freelance, commissions). Avoid corporate-dev framing ("Software Engineer", "Front-End Developer"). Blog post *content* retains its original developer language; that's content, not identity
- **Known gap:** the portrait video (`src/images/about/oam-optim.webm`) was removed with the old footer and currently renders nowhere. The homepage thesis section is its natural home if it should return
- Additional libraries: **astro-embed**, **astro-seo**, **react-player**, **r3f-perf**, **leva**
