import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
const { throttle } = _;
import { get } from "@/pages/rss.xml";

const MutatingSubheader = () => {
  const descriptionArray = [
    "Poet of Existence",
    "Front-End Developer",
    "Creative developer",
    "Digital Philosopher",
    "Architect of Reality",
    "Artistic Programmer",
    "Visionary Programmer",
    "Cybernetic Ethicist",
    "Composer of Algorithms",
    "Quantum Thinker",
    "Virtual Naturalist",
    "Algorithmic Artist",
    "Cosmic Coder",
    "Dream Engineer",
    "Metaphysical Designer",
    "Technological Oracle",
    "Soulful Analyst",
    "Abstract Architect",
    "Reality Sculptor",
    "Harmony Hacker",
    "Existential Engineer",
    "Profound Programmer",
    "Metaphor Mechanic",
    "Artful Logician",
    "Curator of Chaos",
    "Sentient Scientist",
    "Idea Incubator",
    "Dream Weaver",
    "Wisdom Worker",
    "Dialectical Developer",
    "Code Conjurer",
    "Nebulous Networker",
    "Pixel Philosopher",
    "Chaos Choreographer",
    "Synaptic Software Engineer",
    "Space-time Storyteller",
    "Conscious Coder",
    "Innovative Introspector",
    "Philosophical Programmer",
    "Majestic Modeler",
    "Holistic Hacker",
    "Psychonautic Coder",
    "Ethereal Explorer",
    "Vivid Visionary",
    "Mystic Mathematician",
    "Cosmic Cartographer",
    "Futuristic Fabricator",
    "Kaleidoscopic Coder",
    "Esoteric Engineer",
    "Harmonic Harmonizer",
    "Digital Druid",
    "A Monkey",
    "Cognitive Conductor",
    "Temporal Technician",
    "Sonic Sculptor",
    "Numinous Networker",
  ];

  const getRandomWord = (words) => {
    return words[Math.floor(Math.random() * words.length)];
  };

  const [description, setDescrpition] = useState("I don't know what I am yet");
  const [scrollY, setScrollY] = useState(0);

  const updateScrollPosition = useCallback(
    throttle(() => {
      setScrollY(window.pageYOffset);
    }, 50),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", updateScrollPosition);
    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, [updateScrollPosition]);

  useEffect(() => {
    let newDescrìption = getRandomWord(descriptionArray);
    setDescrpition(newDescrìption);
  }, [scrollY]);

  return <span>{description}</span>;
};

export default MutatingSubheader;
