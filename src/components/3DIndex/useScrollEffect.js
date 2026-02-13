import { useRef, useEffect } from "react";

/**
 * Tracks the page scroll position and computes a U-shaped effect intensity:
 *   - 0 at the very top of the page
 *   - 1 at the midpoint of the scroll range
 *   - 0 at the very bottom of the page
 *
 * Returns a ref (not state) so consumers inside useFrame can read it
 * without triggering React re-renders.
 */
export function useScrollEffect() {
  const intensityRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) {
        intensityRef.current = 0;
        return;
      }

      // t goes from 0 (top) to 1 (bottom)
      const t = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      // sin(π·t) gives us a smooth U-shaped curve:
      // 0 → 1 → 0  as  t goes  0 → 0.5 → 1
      intensityRef.current = Math.sin(t * Math.PI);
    };

    // Compute initial value
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return intensityRef;
}
