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
- **Astro 6.4.4** - Main framework with experimental client prerender enabled
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
- `src/content/works/` - Portfolio works (`.mdx`, organized into year subfolders). Schema: `title`, `description`, `pubDate` (all required), `heroImage` (required `image()`), `updatedDate`, `year`, `tools` (string[]), and `workType` (required enum, see below)
- `src/content/blog/` - Blog MDX with schema (`title`, `pubDate` required; `summary`, `heroImage`, `tags` optional). Feeds related-article and notifier components only — does NOT render as `/blog` pages

**Sanity CMS (the live blog source):**
- Project ID / dataset via env vars (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`)
- Helpers in `src/lib/sanity.ts` — `getAllPosts()`, `getPostBySlug(slug)`, `getAllPostSlugs()`, and `urlFor()` image builder; `SanityPost` interface
- Schema types in `sanity/schemas/` (`post.ts`, `youTubeType/`); body supports text, images, code blocks, and YouTube embeds
- Portable Text rendering via `PortableTextRenderer.tsx`
- `/blog` index and `/blog/[...slug]` posts are generated from Sanity

**Work Categories (`workType` — STRICT ENUM, only these 4 values):**
- `Games` - Videogame development
- `Installations` - Interactive / gallery installations
- `Sound & Music` - Sound and music experiments
- `Web & Code` - Web tools and creative coding

Two additional practice areas exist as standalone pages (NOT works-collection MDX), surfaced as homepage cards: **3D Animation / A-visuals** → `/3Dworks`, and **Videoart** → `/videoart`.

### Component Structure

**Interactive Components:**
- `src/components/3DIndex/` - Three.js scenes for homepage (AnimanoirLogoScene, ModelANLogo, AndrosFetal/, SceneIndex, useScrollEffect.js)
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
- `src/layouts/MainLayout.astro` - Base layout (also `src/layouts/index.astro`)
- `src/layouts/BlogPost.astro` - Blog post layout
- `src/layouts/WorkPost.astro` - Portfolio work layout
- `src/components/Header.astro` - Main header (homepage)
- `src/components/ModifiedHeader.astro` - Alternative header variant (inner pages)
- `src/components/Navbar.astro` - Navigation bar (links to homepage section anchors)
- `src/components/Footer/Footer.astro` - Site footer (with social icon SVGs)
- `src/components/HeaderLink.astro` - Header navigation links

**Utility Components:**
- `src/components/BaseHead.astro` - HTML head setup
- `src/components/SEO.jsx` - SEO meta tags
- `src/components/FormattedDate.astro` - Date formatting
- `src/components/Ornaments.astro` - Decorative elements

### Routing Structure
- `/` - Homepage with 3D animations; the ONLY works listing (there is no `/works` index page). Section anchor ids: `#games #installations #sound-art #web-code #3d-animation #videoart` (referenced by `Navbar.astro`)
- `/aboutMe` - About page with canvas animations
- `/3Dworks` - 3D animation / A-visuals showcase
- `/videoart` - Videoart showcase
- `/photodiary` - Photo diary page
- `/blog/` - Blog index (`blog/index.astro`) and individual posts via `blog/[...slug].astro` — both generated from Sanity
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