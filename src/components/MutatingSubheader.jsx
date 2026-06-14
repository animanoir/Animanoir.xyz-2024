import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
const { throttle } = _;

const MutatingSubheader = ({ goWild, sortSpeed = 1000 }) => {
  const descriptionArray = [
    "Sound Sculptor",
    "Game Artist",
    "Sonic Explorer",
    "(Another) Generative Artist",
    "Three.js Dreamer",
    "Digital Ritualist",
    "Play Metaphysician",
    "Interactivity Poet",
    "Curator of Chaos",
    "Chaos Choreographer",
    "Socialist Cybernethicist",
    "Taoist Technologist",
    "Space-time Storyteller",
    "A Confused Monkey",
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
    "Friend",
    "Human",
    "Ex-boyfriend",
    "Incredibly DuMb",
    "Meta-vibe-coder",
    "Neo-Buddhist",
    "Deleuzean Zhuangzian",
    "Metamodern Non-Dualist",
    "Algorithmic Artist",
    "Genuine Pretender",
    "Anhedonia Kamikaze",
    "~·:| ⡷⠂〇º °•.⠐⢾ |:·~",
    "Devenir-Payaso",
    "The Dog That Experienced God",
    "Árbitro de la Realidad",
    "Are.na Addict",
    "Fear & Laughter Technician",
    "Ontological Clown",
    "Voluntarily Confused",
    "Professionally Astonished",
    "Broken Mirror Collector",
    "Identity Dissolvent",
    "My Personality Is a Bug",
    "Conjurer of Realities",
    "Play > Talk",
    "Fragrance Ontologist",
    "Eternally Lovesick",
    "Hallucinating Happiness",
    "Recursive Self-Doubter",
    "The '&' Between Fear & Laughter",
    "My Greatest Sin Is Believing I'm Real",
    "Fractal Evangelist",
    "Consciousness Is Latex",
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
