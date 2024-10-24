import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
const { throttle } = _;

const MutatingSubheader = ({ goWild, sortSpeed = 1000 }) => {
  const descriptionArray = [
    "Poet of Existence",
    "Front-End Developer",
    "Generative Art/Software & Philosophy",
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
    "Creative Software Engineer",
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
    "Galactic Game Guru",
    "Virtual Visionary",
    "Circuit Satirist",
    "Neural Network Nurturer",
    "Ethereal Ethicist",
    "Cosmic Comedian",
    "Silicon Sorcerer",
    "Interstellar Ironist",
    "Cryptographic Clown",
    "Meme Mechanic",
    "Data Druid",
    "Robotic Raconteur",
    "Surreal System Specialist",
    "Cloud Computing Clown",
    "Blockchain Buffoon",
    "Witty Widget Wizard",
    "Hyperdrive Humorist",
    "AI Agitator",
    "Eco-friendly Electron Enthusiast",
    "Poet of Systems",
    "Front-End Futurist",
    "Generative Guide",
    "Creative Alchemist",
    "Digital Architect",
    "Artistic Strategist",
    "Cybernetic Visionary",
    "Quantum Explorer",
    "Virtual Dreamer",
    "Algorithmic Philosopher",
    "Cosmic Composer",
    "Dream Hacker",
    "Metaphysical Coder",
    "Soulful Designer",
    "Abstract Thinker",
    "Harmony Weaver",
    "Existential Explorer",
    "Profound Creator",
    "Metaphor Sculptor",
    "Artful Programmer",
    "Ex-boyfriend",
    "Poet of Dreams",
    "Poet of Systems",
    "Poet of Algorithms",
    "Front-End Futurist",
    "Front-End Visionary",
    "Front-End Creator",
    "Creative Developer",
    "Creative Alchemist",
    "Creative Explorer",
    "Digital Philosopher",
    "Neo-Buddhist",
    "Neo-Dadaist",
    "Neo-Surrealist",
    "Neo-Expressionist",
    "Neo-Expressionist",
    "Neo-Expressionist",
    "Metamodern Nagarjuna"
  ];

  const getRandomWord = (words) => {
    return words[Math.floor(Math.random() * words.length)];
  };

  const [description, setDescription] = useState("I don't know what I am yet");
  const [scrollY, setScrollY] = useState(0);

  const updateScrollPosition = useCallback(
    throttle(() => {
      setScrollY(window.scrollY);
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
    setDescription(newDescrìption);
  }, [scrollY]);

  const handleOrientationChange = useCallback(
    throttle((event) => {
      const { alpha, beta, gamma } = event;
      if (Math.abs(beta) > 20 || Math.abs(gamma) > 20) {
        setDescription(getRandomWord(descriptionArray));
      }
    }, 50),
    []
  );

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientationChange);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientationChange);
    };
  }, [handleOrientationChange]);

  useEffect(() => {
    if (goWild) {
      const interval = setInterval(() => {
        descriptionArray.sort(() => Math.random() - 0.5);
        setDescription(getRandomWord(descriptionArray));
      }, sortSpeed);

      return () => clearInterval(interval);
    }
  }, [goWild, sortSpeed]);

  return <span>{description}</span>;
};

export default MutatingSubheader;
