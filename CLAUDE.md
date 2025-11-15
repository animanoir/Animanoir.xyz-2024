# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun run dev` or `bun start` - Start development server
- `bun run build` - Build the site for production
- `bun run preview` - Preview the production build locally

## Project Architecture

This is an Astro-based portfolio website for an interactive media developer, featuring a hybrid approach with both static content and React components for interactive elements.

### Key Technologies
- **Astro 5.x** - Main framework with experimental client prerender enabled
- **React** - For interactive components (Three.js scenes, animations, LastFM integration)
- **Three.js** - 3D graphics via React Three Fiber ecosystem (@react-three/fiber, @react-three/drei, @react-three/postprocessing)
- **TypeScript** - Type safety throughout the codebase
- **MDX** - For content authoring in blog posts and works
- **GSAP** - Animation library
- **Lenis** - Smooth scrolling

### Content Architecture

The site uses Astro's content collections for structured content:

**Collections:**
- `src/content/blog/` - Blog posts with frontmatter schema (title, summary, pubDate, heroImage, tags)
- `src/content/works/` - Portfolio works with schema (title, description, pubDate, updatedDate, heroImage, year, tools, workType)

**Content Schema (src/content/config.ts):**
- Works collection includes professional portfolio pieces with categorization by workType and tools
- Blog collection supports optional hero images and tagging system

### Component Structure

**Interactive Components:**
- `src/components/3DIndex/` - Three.js scenes for homepage (AnimanoirLogoScene, ModelANLogo, AndrosFetal)
- `src/components/CanvasAbout.jsx` - WebGL canvas for about page
- `src/components/MutatingAbout/` - Text mutation effects
- `src/components/RandomVideo/` - Video background components
- `src/components/LastFm.jsx` - Music integration with LastFM API

**Layout Components:**
- `src/layouts/MainLayout.astro` - Base layout
- `src/layouts/BlogPost.astro` - Blog post layout
- `src/layouts/WorkPost.astro` - Portfolio work layout

### Routing Structure
- `/` - Homepage with 3D animations
- `/aboutMe` - About page with canvas animations  
- `/blog/` - Blog index and individual posts via `[...slug].astro`
- `/works/` - Portfolio index and individual works via `[...slug].astro`
- `/3Dworks` - 3D work showcase
- `/books` - Books page
- Special routes: `/rss.xml.js` for RSS feed

### Configuration Notes

**Astro Config:**
- Site URL: https://animanoir.xyz
- Image service configured with Sharp for optimization (quality: 90, formats: jpg/webp)
- Allowed image domains for external content (YouTube, S3, Notion)
- Prefetch enabled with viewport strategy
- Lenis integration for smooth scrolling

**TypeScript Config:**
- Path aliases: `@/*` maps to `src/*` 
- Three.js specific path mappings for proper module resolution

### Asset Management
- Images organized by category in `src/images/` (blog, works, about)
- Video assets in `src/images/videos/` and work-specific directories
- Extensive use of optimized images (jpg/webp) and video (webm)

### API Integration
- Notion API integration for dynamic content (`@notionhq/client`)
- LastFM API for music data display
- RSS feed generation

### Development Notes
- Uses ES modules (`"type": "module"` in package.json)
- Prettier configured with Astro plugin for code formatting
- Environment variables managed via dotenv
- Sharp image service configured for optimal performance