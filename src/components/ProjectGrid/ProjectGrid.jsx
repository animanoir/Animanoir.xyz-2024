import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./ProjectGrid.module.css";

// Navbar hash anchors map onto workType categories. `#all` (or no hash) shows
// everything. The featured tiles (3D Animation / Videoart) carry no categories,
// so they only appear in the "All" view.
const HASH_TO_CATEGORY = {
  "#games": "Games",
  "#installations": "Installations",
  "#sound-art": "Sound & Music",
  "#web-design-dev": "Web & Code",
};

// Hashes that should scroll the grid into view when clicked or deep-linked
// (every navbar "work" link). "#all" carries no category but still targets the
// grid. The featured tiles (3D / Videoart) are cross-page links, not hashes.
const GRID_HASHES = new Set(["#all", ...Object.keys(HASH_TO_CATEGORY)]);

// Lenis offset (px) when scrolling to the grid — negative leaves a little
// breathing room above the first row.
const SCROLL_OFFSET = -24;

export default function ProjectGrid({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState(null); // null = show all
  const [activeId, setActiveId] = useState(null); // currently hovered/focused tile
  const wrapperRef = useRef(null); // grid root — scroll target for category links

  // Drive the filter from the URL hash so the navbar links keep working and the
  // view stays deep-linkable (e.g. /#games) with working back/forward.
  //
  // Gotcha: the navbar lives inside Astro's <ClientRouter /> (View Transitions).
  // For a same-page hash link like /#games it just runs history.pushState and
  // returns early — firing NO hashchange / popstate / astro:page-load. So a
  // hashchange listener alone never sees in-page category clicks. We bridge that
  // by reading the category straight off any clicked same-page hash anchor; the
  // other listeners cover deep-links, back/forward, and cross-page navigation.
  useEffect(() => {
    const applyHash = () => {
      setActiveCategory(HASH_TO_CATEGORY[window.location.hash] ?? null);
    };

    // Bring the grid into view so the projects are visible even if the user
    // hasn't scrolled past the hero yet. Prefer the site's Lenis instance
    // (astro-lenis exposes it as window.lenis) so the motion matches the page's
    // smooth scroll; on a cold deep-link load Lenis may not have initialized in
    // this frame yet, so retry briefly before falling back to native scrolling.
    const scrollToProjects = (attempt = 0) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (window.lenis?.scrollTo) {
        window.lenis.scrollTo(el, { offset: SCROLL_OFFSET, duration: 1.1 });
      } else if (attempt < 20) {
        requestAnimationFrame(() => scrollToProjects(attempt + 1));
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const onClick = (e) => {
      // Ignore modified clicks (new tab / window) and non-primary buttons.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const anchor = e.target.closest?.("a");
      if (!anchor) return;
      let url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      // Only same-page hash links drive the filter. Cross-page links navigate
      // normally and the freshly-mounted grid re-reads the hash on load.
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      )
        return;
      setActiveCategory(HASH_TO_CATEGORY[url.hash] ?? null);
      // Already on the homepage: ClientRouter swallows this same-page hash link
      // (no navigation/scroll), so scroll the re-filtered grid into view here.
      // Wait a frame so the re-flow has started.
      if (GRID_HASHES.has(url.hash)) {
        requestAnimationFrame(() => scrollToProjects());
      }
    };

    applyHash();
    // Arriving with a work hash (deep-link, or a cross-page navbar click that
    // navigated home) should land the viewer on the projects, not the hero.
    if (GRID_HASHES.has(window.location.hash)) {
      requestAnimationFrame(() => scrollToProjects());
    }
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", applyHash);
    window.addEventListener("popstate", applyHash);
    document.addEventListener("astro:page-load", applyHash);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", applyHash);
      window.removeEventListener("popstate", applyHash);
      document.removeEventListener("astro:page-load", applyHash);
    };
  }, []);

  const visible = projects.filter(
    (p) => !activeCategory || (p.categories || []).includes(activeCategory),
  );

  const active = visible.find((p) => p.id === activeId) || null;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <motion.ul
        className={styles.grid}
        layout
        onMouseLeave={() => setActiveId(null)}
      >
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.li
              key={p.id}
              className={styles.tile}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              onMouseEnter={() => setActiveId(p.id)}
              onFocus={() => setActiveId(p.id)}
            >
              <a className={styles.link} href={p.href}>
                <img
                  className={styles.img}
                  src={p.img.src}
                  srcSet={p.img.srcset || undefined}
                  sizes="(max-width: 480px) 100vw, (max-width: 760px) 50vw, 30vw"
                  alt={`${p.title} by Óscar A. Montiel`}
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.tileLabel}>{p.title}</span>
              </a>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && (
        <p className={styles.empty}>No projects in this category yet.</p>
      )}

      {/* Fixed bar pinned to the bottom of the viewport. It appears while a tile
          is hovered/focused so the info is always in view, and slides away when
          the pointer leaves the grid (so it never covers the footer). */}
      <AnimatePresence>
        {active && (
          <motion.aside
            key="bar"
            className={styles.bar}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className={styles.barInner}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <p className={styles.barTitle}>
                  {active.title}
                  {active.year ? (
                    <span className={styles.barYear}>{active.year}</span>
                  ) : null}
                </p>
                <p className={styles.barDesc}>{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
