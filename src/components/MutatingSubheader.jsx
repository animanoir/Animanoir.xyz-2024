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
    "3D Developer",
    "Game Maker",
    "Sex Lover",
    "Pixel Philosopher",
    "Chaos Choreographer",
    "Synaptic Software Engineer",
    "Socialist Cybernethicist",
    "Taoist Technologist",
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
    "A Confused Monkey",
    "Cognitive Conductor",
    "Temporal Technician",
    "Sonic Sculptor",
    "Numinous Networker",
    "Mystical Machine Learner",
    "Interstellar Interface Designer",
    "Quantum Quilter",
    "Virtual Visionary",
    "Silicon Sage",
    "Prophetic Programmer",
    "Ethereal Ethnographer",
    "Circuit Conductor",
    "Binary Bard",
    "Galactic Game Developer",
    "Intuitive Interface Innovator",
    "Digital Dreamer",
    "Neural Network Navigator",
    "Surreal Systems Strategist",
    "Timeless Technology Tactician",
    "Reality Rewriter",
    "Cosmic Compiler",
    "Artificial Intelligence Artisan",
    "Data Dimensionalist",
    "Enigmatic Engineer",
    "Mindful Machine Maker",
    "Phenomenal Programmer",
    "Luminous Logician",
    "Imaginative Information Architect",
    "Cybernetic Composer",
    "Astrological Algorithmist",
    "Dimensional Designer",
    "Stellar Software Stylist",
    "Techno Transcendentalist",
    "Cyberspace Cartographer",
    "Futuristic Functionalist",
    "Plasma Programmer",
    "Tech Tinkerer",
    "Worldly Web Weaver",
    "Spiritual Software Savant",
    "Holographic Harmonizer",
    "Algorithmic Alchemist",
    "Digital Dreamweaver",
    "Code Conjurer",
    "Metaverse Mapper",
    "Quantum Quester",
    "Astral Architect",
    "Phantasmal Programmer",
    "Nano Networker",
    "Celestial Coder",
    "Mythic Modeler",
    "Euphoric Engineer",
    "Pixel Painter",
    "Virtual Virtuoso",
    "Techno-mystical Translator",
    "Dancing Chango",
    "Winephiliac",
    "Sarcastic Ontologist",
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
