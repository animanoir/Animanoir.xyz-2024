import React, { useEffect, useRef, useState } from "react";
import styles from './MagicHeading.module.css';


export default function MagicHeading() {
  const ref = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const texts = [
    { __html: "Animations that evoke a sense of <b>dreams</b> and <b>confusion</b>." },
    { __html: "Visual poetry in <b>motion</b> and <b>stillness</b>." },
    { __html: "<b>Blender</b>, <b>Max/MSP</b>, <b>shaders</b>, whatever tbh..." },
    { __html: "My works are best understood when in <b>drukqs</b>."},
    { __html: "Somewhere between <b>meta-glitch art</b> and <b>wet dreams</b>." },
    { __html: "Powered by <b>mind-altering</b> acts & <b>esoteric software</b>." },
    { __html: "Embracing <b>new ways</b> to <b>break</b> your <b>mind</b>." },
    { __html: "Most of my work comes from the <b>music</b> I listen to." }

  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div className={styles.headingContainer}>
      <h3
        ref={ref}
        className={styles.heading}
        dangerouslySetInnerHTML={texts[currentIndex]}
      />
    </div>
  );
}