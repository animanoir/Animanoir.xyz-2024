import React, { useEffect, useRef, useState } from "react";

export default function MagicHeading() {
  const ref = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const texts = [
    { __html: "Animations that evoke a sense of <b>dreams</b> and <b>confusion</b>." },
    { __html: "Visual poetry in <b>motion</b> and <b>stillness</b>." },
    { __html: "<b>Blender</b>, <b>Max/MSP</b>, <b>shaders</b>, whatever tbh..." },
    { __html: "My works are best understood when in <b>drukqs</b>."},
    { __html: "Somewhere between <b>meta-glitch art</b> and <b>wet dreams</b>." },
    { __html: "Powered by <b>LSD</b> and <b>esoteric software</b>." },
    { __html: "Embracing new ways to <b>break</b> your <b>mind</b>." }
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
    <div style={{ 
      height: "200px", // Fixed container height
    }}>
      <h3
        ref={ref}
        style={{ 
          fontSize: "4.2rem",
          lineHeight: "1.2",
          minHeight: "180px", // Minimum height to prevent jumps
          transition: "opacity 0.3s ease",
          margin: 0
        }}
        dangerouslySetInnerHTML={texts[currentIndex]}
      />
    </div>
  );
}