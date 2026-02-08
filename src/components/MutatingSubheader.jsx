import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
const { throttle } = _;

const MutatingSubheader = ({ goWild, sortSpeed = 1000 }) => {
  const descriptionArray = [
    "Interactive Media Artist",
    "Videoart Explorer",
    "Sound Sculptor",
    "Game Artist",
    "Visual Alchemist",
    "Installation Artist",
    "Sonic Explorer",
    "Generative Artist",
    "Immersive Artist",
    "Max/MSP Mystic",
    "Three.js Dreamer",
    "Godot Wanderer",
    "Digital Ritualist",
    "Audiovisual Weaver",
    "Play Metaphysician",
    "Interactivity Poet",
    "Poet of Existence",
    "Digital Philosopher",
    "Architect of Reality",
    "Cybernetic Ethicist",
    "Quantum Thinker",
    "Virtual Naturalist",
    "Algorithmic Artist",
    "Metaphysical Designer",
    "Abstract Architect",
    "Reality Sculptor",
    "Curator of Chaos",
    "Idea Incubator",
    "Dream Weaver",
    "Pixel Philosopher",
    "Chaos Choreographer",
    "Socialist Cybernethicist",
    "Taoist Technologist",
    "Space-time Storyteller",
    "Innovative Introspector",
    "Ethereal Explorer",
    "Vivid Visionary",
    "Mystic Mathematician",
    "Cosmic Cartographer",
    "Harmonic Harmonizer",
    "Digital Druid",
    "A Confused Monkey",
    "Cognitive Conductor",
    "Sonic Sculptor",
    "Virtual Visionary",
    "Silicon Sage",
    "Digital Dreamer",
    "Reality Rewriter",
    "Cybernetic Composer",
    "Dimensional Designer",
    "Techno Transcendentalist",
    "Algorithmic Alchemist",
    "Metaverse Mapper",
    "Quantum Quester",
    "Astral Architect",
    "Mythic Modeler",
    "Pixel Painter",
    "Virtual Virtuoso",
    "Dancing Chango",
    "Winephiliac",
    "Sarcastic Ontologist",
    "Cosmic Comedian",
    "Silicon Sorcerer",
    "Interstellar Ironist",
    "Meme Mechanic",
    "Data Druid",
    "Surreal System Specialist",
    "Hyperdrive Humorist",
    "Poet of Systems",
    "Generative Guide",
    "Friend",
    "Human",
    "Creative Alchemist",
    "Artistic Strategist",
    "Cybernetic Visionary",
    "Quantum Explorer",
    "Virtual Dreamer",
    "Algorithmic Philosopher",
    "Cosmic Composer",
    "Soulful Designer",
    "Abstract Thinker",
    "Harmony Weaver",
    "Existential Explorer",
    "Profound Creator",
    "Metaphor Sculptor",
    "Ex-boyfriend",
    "DuMb",
    "Poet of Dreams",
    "Poet of Algorithms",
    "Creative Explorer",
    "Neo-Buddhist",
    "Neo-Dadaist",
    "Neo-Surrealist",
    "Neo-Expressionist",
    "Metamodern Non-Dualist"
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
