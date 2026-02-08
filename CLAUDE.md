# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm run dev` or `pnpm start` - Start development server
- `pnpm run build` - Build the site for production
- `pnpm run preview` - Preview the production build locally
- `pnpm run sanity` - Start Sanity Studio for content management

## Project Architecture

This is an Astro-based portfolio website for an interactive media developer, featuring a hybrid approach with both static content and React components for interactive elements.

### Key Technologies
- **Astro 5.16.3** - Main framework with experimental client prerender enabled
- **React** - For interactive components (Three.js scenes, animations, LastFM integration)
- **Sanity CMS** - Headless CMS for blog content management with Portable Text support
- **Three.js** - 3D graphics via React Three Fiber ecosystem (@react-three/fiber, @react-three/drei, @react-three/postprocessing)
- **TypeScript** - Type safety throughout the codebase
- **MDX** - For content authoring in blog posts and works
- **GSAP & Motion** - Animation libraries
- **Lenis** - Smooth scrolling
- **Styled Components** - CSS-in-JS styling
- **Lottie** - Animation rendering via lottie-react

### Content Architecture

The site uses both Astro's content collections and Sanity CMS for content management:

**Astro Content Collections:**
- `src/content/blog/` - Blog posts with frontmatter schema (title, summary, pubDate, heroImage, tags)
- `src/content/works/` - Portfolio works with schema (title, description, pubDate, updatedDate, heroImage, year, tools, workType)

**Sanity CMS:**
- Project ID: in .env file
- Configured with structure tool, vision tool, and code input plugin
- Schema types defined in `sanity/schemas/` directory
- Portable Text rendering via PortableTextRenderer component
- Integration enabled via @sanity/astro

**Content Schema (src/content/config.ts):**
- Works collection includes professional portfolio pieces with categorization by workType and tools
- Blog collection supports optional hero images and tagging system

### Component Structure

**Interactive Components:**
- `src/components/3DIndex/` - Three.js scenes for homepage (AnimanoirLogoScene, ModelANLogo, AndrosFetal, SceneIndex)
- `src/components/CanvasAbout.jsx` - WebGL canvas for about page
- `src/components/MutatingAbout/MutatingAbout.jsx` - Text mutation effects
- `src/components/MutatingSubheader.jsx` - Subheader text mutations
- `src/components/RandomVideo/` - Video background components (RandomVideo, Video)
- `src/components/LastFm.jsx` - Music integration with LastFM API
- `src/components/HoverTextEffect/HoverTextEffect.jsx` - Interactive text hover effects
- `src/components/MagicHeading.jsx` - Animated heading component
- `src/components/Misc/LorenzAttractor.jsx` - Mathematical visualization

**Content & Media Components:**
- `src/components/YouTubeGrid/YoutubeGrid.jsx` - YouTube content grid display
- `src/components/PortableTextRenderer.tsx` - Sanity Portable Text renderer
- `src/components/BlogPostsNotifier.astro` - Blog post notifications
- `src/components/RelatedArticles.astro` - Related content suggestions

**Layout & Navigation Components:**
- `src/layouts/MainLayout.astro` - Base layout
- `src/layouts/BlogPost.astro` - Blog post layout
- `src/layouts/WorkPost.astro` - Portfolio work layout
- `src/components/Header.astro` - Main header
- `src/components/ModifiedHeader.astro` - Alternative header variant
- `src/components/Navbar.astro` - Navigation bar
- `src/components/Footer/Footer.astro` - Site footer
- `src/components/HeaderLink.astro` - Header navigation links

**Utility Components:**
- `src/components/BaseHead.astro` - HTML head setup
- `src/components/SEO.jsx` - SEO meta tags
- `src/components/FormattedDate.astro` - Date formatting
- `src/components/Ornaments.astro` - Decorative elements

### Routing Structure
- `/` - Homepage with 3D animations
- `/aboutMe` - About page with canvas animations
- `/blog/` - Blog index and individual posts via `[...slug].astro`
- `/works/` - Portfolio index and individual works via `[...slug].astro`
- `/3Dworks` - 3D work showcase
- `/books` - Books page
- `/fotodiario` - Photo diary page
- Special routes: `/rss.xml.js` for RSS feed

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
- Additional libraries integrated:
  - **astro-embed** - Content embedding capabilities
  - **astro-particles** - Particle effects
  - **astro-seo** - SEO optimization
  - **lottie-react** - Lottie animation support
  - **styled-components** - CSS-in-JS styling
  - **r3f-perf** - React Three Fiber performance monitoring
  - **leva** - GUI controls for development/debugging