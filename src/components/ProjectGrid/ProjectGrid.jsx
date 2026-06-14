import { useEffect, useState } from "react";
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

export default function ProjectGrid({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState(null); // null = show all
  const [activeId, setActiveId] = useState(null); // currently hovered/focused tile

  // Drive the filter from the URL hash so the existing navbar links keep working
  // and the view stays deep-linkable (e.g. /#games) with working back/forward.
  useEffect(() => {
    const applyHash = () => {
      setActiveCategory(HASH_TO_CATEGORY[window.location.hash] ?? null);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const visible = projects.filter(
    (p) => !activeCategory || (p.categories || []).includes(activeCategory),
  );

  const active = visible.find((p) => p.id === activeId) || null;

  return (
    <div className={styles.wrapper}>
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
