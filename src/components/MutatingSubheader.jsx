import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
const { throttle } = _;

const MutatingSubheader = ({ goWild, sortSpeed = 1000 }) => {
  const descriptionArray = [
    // === las que se quedan ===
    "Sound Sculptor",
    "Game Artist",
    "Sonic Explorer",
    "(Another) Generative Artist",
    "Max/MSP Mystic",
    "Three.js Dreamer",
    "Godot Wanderer",
    "Digital Ritualist",
    "Tritúrame el Zen Advocate",
    "Play Metaphysician",
    "Interactivity Poet",
    "Curator of Chaos",
    "Chaos Choreographer",
    "Socialist Cybernethicist",
    "Taoist Technologist",
    "Space-time Storyteller",
    "Mystic Mathematician",
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
    "DuMb",
    "Post Vibe-Coder",
    "Neo-Buddhist",
    "Neo-Dadaist",
    "Neo-Surrealist",
    "Deleuzean Zhuangzian",
    "Metamodern Non-Dualist",
    "Algorithmic Artist",

    // === las nuevas ===
    "Genuine Pretender",
    "Anhedonia Kamikaze",
    "Professional People Borer",
    "LinkedIn Despiser",
    "Devenir-Payaso",
    "The Dog That Experienced God",
    "Árbitro de la Realidad",
    "Happily Girlfriendless",
    "Certified Nagarjuna Fanboy",
    "Wu Wei Debugger",
    "Are.na Addict",
    "Fear & Laughter Technician",
    "Ontological Clown",
    "Mil Mesetas Enjoyer",
    "Mezcal Metaphysician",
    "Buddhist Provocateur",
    "Voluntarily Confused",
    "Beauty Over Justice",
    "Ableton Shaman",
    "Professionally Astonished",
    "SuperCollider Witch",
    "Broken Mirror Collector",
    "Identity Dissolvent",
    "My Personality Is a Bug",
    "Definitely Not Your Boyfriend",
    "Homo Ludens Apologist",
    "Conjurer of Realities",
    "Play > Talk",
    "Fragrance Ontologist",
    "Eternally Lovesick",
    "Hallucinating Happiness",
    "Recursive Self-Doubter",
    "Neo-Nagarjunist",
    "Terrified of Being Ordinary",
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
