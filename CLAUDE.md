# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm run dev` or `pnpm start` - Start development server
- `pnpm run build` - Build the site for production
- `pnpm run preview` - Preview the production build locally
- `pnpm run sanity` - Start Sanity Studio for content management

## Project Architecture

This is an Astro-based portfolio website for an Interactive Media Artist, featuring a hybrid approach with both static content and React components for interactive elements.

### Key Technologies
- **Astro 7.0.7** - Main framework with experimental client prerender enabled
- **React 19** - For interactive components (Three.js scenes, animations, LastFM integration)
- **Sanity CMS** - Headless CMS for blog content management with Portable Text support (@sanity/astro, @sanity/client, @portabletext/react)
- **Three.js 0.182** - 3D graphics via React Three Fiber ecosystem (@react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing)
- **TypeScript** - Type safety throughout the codebase
- **MDX** - For content authoring in works (blog is Sanity-backed; see Content Architecture)
- **GSAP & Motion** - Animation libraries
- **Lenis** - Smooth scrolling (astro-lenis integration)
- **Leva** - GUI controls for development/debugging 3D scenes
- **r3f-perf** - React Three Fiber performance monitoring

### Content Architecture

The site uses both Astro's content collections and Sanity CMS. **Important:** the blog is fully Sanity-backed — the `src/content/blog/` collection does NOT render as pages (it only feeds `RelatedArticles.astro` and `BlogPostsNotifier.astro`). You cannot publish a blog post by dropping an MDX file.

**Astro Content Collections (`src/content.config.ts`):**
- `src/content/works/` - Portfolio works (`.mdx`, organized into year subfolders). Schema: `title`, `description`, `pubDate` (all required), `heroImage` (required `image()`), `updatedDate`, `year` (number), `tools` (string[]), and `workType` (required **array** of one or more enum values, e.g. `workType: ["Web & Code"]`, see below)
- `src/content/blog/` - Blog MDX (loader matches both `.md` and `.mdx`) with schema (`title`, `pubDate` required; `summary`, `heroImage`, `tags` optional). Feeds related-article and notifier components only — does NOT render as `/blog` pages
- `src/drafts/` - Unpublished scratch/staging markdown (`.md`/`.mdx`) plus a `books.astro`. NOT wired into any content collection or route — nothing here renders

**Sanity CMS (the live blog source):**
- Project ID / dataset via env vars (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`)
- Helpers in `src/lib/sanity.ts` — `getAllPosts()`, `getPostBySlug(slug)`, `getAllPostSlugs()`, and `urlFor()` image builder; `SanityPost` interface
- Schema types in `sanity/schemas/` (`post.ts`, `youTubeType/`); body supports text, images, code blocks, and YouTube embeds
- Portable Text rendering via `PortableTextRenderer.tsx`
- `/blog` index and `/blog/[...slug]` posts are generated from Sanity

**Work Categories (`workType` — STRICT ENUM array; each work declares one or more of these 4 values):**
- `Games` - Videogame development
- `Installations` - Interactive / gallery installations
- `Sound & Music` - Sound and music experiments
- `Web & Code` - Web tools and creative coding

Two additional practice areas exist as standalone pages (NOT works-collection MDX), surfaced as homepage cards: **3D Animation / A-visuals** → `/3Dworks`, and **Videoart** → `/videoart`.

### Component Structure

**Interactive Components:**
- `src/components/3DIndex/` - Three.js scenes for homepage (AnimanoirLogoScene, ModelANLogo, AndrosFetal/, SceneIndex, useScrollEffect.js)
- `src/components/ProjectGrid/` - Homepage filterable project grid (`ProjectGrid.jsx` + `ProjectGrid.module.css`); hash-driven category filter with Motion layout animations and a hover/focus caption
- `src/components/CanvasAbout.jsx` - WebGL canvas for about page
- `src/components/MutatingAbout/MutatingAbout.jsx` - Text mutation effects
- `src/components/MutatingSubheader.jsx` - Subheader text mutations
- `src/components/RandomVideo/` - Video background components (RandomVideo, Video)
- `src/components/LastFm.jsx` - Music integration with LastFM API
- `src/components/HoverTextEffect/HoverTextEffect.jsx` - Interactive text hover effects
- `src/components/MagicHeading.jsx` - Animated heading component
- `src/components/Misc/LorenzAttractor.jsx` - Mathematical visualization
- `src/components/hooks/` - Shared React hooks (`useArrayRef.js`, `useLastFmData.js`)

**Content & Media Components:**
- `src/components/YouTubeGrid/YoutubeGrid.jsx` - YouTube content grid display
- `src/components/PortableTextRenderer.tsx` - Sanity Portable Text renderer
- `src/components/BlogPostsNotifier.astro` - Blog post notifications
- `src/components/RelatedArticles.astro` - Related content suggestions

**Layout & Navigation Components:**
- `src/layouts/MainLayout.astro` - Base layout, only referenced by `src/layouts/index.astro` — and neither is wired to a live route, so this layout (and the `Header.astro` it pulls in) is effectively unused
- `src/layouts/BlogPost.astro` - Blog post layout (uses `ModifiedHeader`)
- `src/layouts/WorkPost.astro` - Portfolio work layout (uses `ModifiedHeader`)
- `src/components/ModifiedHeader.astro` - **The header on every rendered page** (homepage, aboutMe, 3Dworks, videoart, photodiary, blog, plus the BlogPost/WorkPost layouts). Renders `MutatingSubheader` + `LastFm` + `Navbar` + `Ornaments`. Props: `animated` (homepage only — opts into the sequential quote → header → navbar Motion reveal), and `goWild` + `sortSpeed` (aboutMe — tune the `MutatingSubheader` text scramble)
- `src/components/Header.astro` - Older base header; only referenced by `MainLayout.astro`, so it does NOT appear on any live page. `ModifiedHeader` is what's actually used
- `src/components/Navbar.astro` - Navigation bar. Work links drive the homepage `ProjectGrid` filter via URL hashes (`#all`, `#games`, `#installations`, `#sound-art`, `#web-design-dev`; off the homepage they navigate home carrying the hash); **3D Animation** and **VideoArt** link straight to `/3Dworks` and `/videoart`. Accepts an `animated` prop (passed only by the homepage, via `ModifiedHeader animated`) that reveals nav items one by one, alternating right/left (Motion)
- `src/components/Footer/Footer.astro` - Site footer; social icons live as separate assets in `src/components/Footer/icons/` (github, ig, linkedin, steam, youtube SVGs + arena PNG)
- `src/components/HeaderLink.astro` - Header navigation links

**Utility Components:**
- `src/components/BaseHead.astro` - HTML head setup
- `src/components/SEO.jsx` - SEO meta tags
- `src/components/FormattedDate.astro` - Date formatting
- `src/components/Ornaments.astro` - Decorative elements

### Routing Structure
- `/` - Homepage with 3D animations; the ONLY works listing (there is no `/works` index page). On load it plays a sequential narrative reveal (quote → header → navbar) via `<ModifiedHeader animated />` (Motion). Below a `100vh` scene spacer it renders a single filterable project grid (`ProjectGrid.jsx`, a React island). The navbar drives the filter via URL hash — `#all`, `#games`, `#installations`, `#sound-art`, `#web-design-dev` — which `ProjectGrid` maps onto `workType`; the grid animates the re-flow (Motion `layout` + `AnimatePresence`) and shows a hover/focus caption below it. **3D Animation** and **Videoart** are featured tiles that link out to `/3Dworks` and `/videoart` (their navbar links go straight to those pages, not the grid). Hero images are pre-optimized in the page frontmatter via `getImage()` and passed to the island as `srcset` (Astro `<Picture>` can't run inside a React component)
- `/aboutMe` - About page with canvas animations
- `/3Dworks` - 3D animation / A-visuals showcase
- `/videoart` - Videoart showcase
- `/photodiary` - Photo diary page
- `/blog/` - Blog index (`blog/index.astro`) and individual posts via `blog/[...slug].astro` — both generated from Sanity. The index has a `LAYOUT_MODE` toggle constant: `"vertical"` (default — a clean, year-grouped vertical list, pure CSS) or `"random"` (legacy scattered / absolutely-positioned layout positioned by a client script, including a now-commented-out Are.na text background). Posts are grouped and sorted by year, newest first
- `/works/[...slug]` - Individual work pages from the works content collection
- `/rss.xml` - RSS feed (`rss.xml.js`)

### Configuration Notes

**Astro Config:**
- Site URL: https://animanoir.xyz
- Integrations: MDX, Sitemap, React, Lenis, Sanity
- Sanity integration configured with project ID and dataset from environment variables
- Image service configured with Sharp for optimization:
  - Quality: 90
  - Formats: avif, webp, jpg
  - Max dimensions: 1920x1080
  - Fit: cover, position: center
- Allowed image domains: YouTube, S3, Notion, Are.na, CloudFront, Sanity CDN
- Remote patterns configured for S3, Notion, and Are.na content
- Prefetch enabled with prefetchAll: true
- Lenis integration for smooth scrolling
- Experimental client prerender enabled
- Vite config includes Three.js alias resolution and custom asset naming to avoid Netlify path-traversal issues with `[...slug]` routes

**TypeScript Config:**
- Path aliases: `@/*` maps to `src/*` 
- Three.js specific path mappings for proper module resolution

### Asset Management
- Images organized by category in `src/images/` (blog, works, about)
- Video assets in `src/images/videos/` and work-specific directories
- Extensive use of optimized images (jpg/webp) and video (webm)
- `src/scripts/imageLoader.js` - helper script for image loading

### API Integration
- **Sanity CMS** - Primary content management system with Portable Text support
- **Notion API** - Additional dynamic content integration (`@notionhq/client`)
- **LastFM API** - Music data display and now playing information
- **RSS feed** - Automated feed generation for blog posts

### Development Notes
- Uses ES modules (`"type": "module"` in package.json)
- Prettier configured with Astro plugin for code formatting
- Environment variables managed via dotenv
- Sharp image service configured for optimal performance
- Site identity constants in `src/consts.ts` (`SITE_TITLE` "Óscar A. Montiel", `SITE_SUBTITLE` "Interactive Media Artist", `SITE_DESCRIPTION`)
- Removed works are archived (non-rendering) under repo-root `archive/works-removed/`
- Additional libraries integrated:
  - **astro-embed** - Content embedding capabilities
  - **astro-seo** - SEO optimization
  - **react-player** - Video player component
  - **r3f-perf** - React Three Fiber performance monitoring
  - **leva** - GUI controls for development/debugging