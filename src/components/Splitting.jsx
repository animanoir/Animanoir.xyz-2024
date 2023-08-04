import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Splitting = React.memo(({ text, delay }) => {
  const splitRef = useRef();
  const delaySec = delay / 1000;

  useEffect(() => {
    gsap.from(splitRef.current.childNodes, {
      duration: 0.8,
      opacity: 0,
      scale: 0,
      y: 80,
      rotationX: 180,
      transformOrigin: "0% 50% -50",
      ease: "back",
      stagger: 0.01,
      delay: delaySec,
    });
  }, [text, delaySec]);

  const splitText = text ? String(text).split("") : [];
  return (
    <span ref={splitRef}>
      {splitText.map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </span>
  );
});

export default Splitting;
