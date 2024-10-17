import React, { useState, useEffect } from "react";
import _ from "lodash";
import "./MutatingAbout.css";

const MutatingAbout = () => {
  const funnyTexts = [
    "The world is a just giant theater with simultaneous plays and actors everywhere.",
    "Hola, dicen que soy Óscar.", // Spanish
    "Hello, they say I am Óscar.", // English
    "Bonjour, on dit que je suis Óscar.", // French
    "Hallo, sie sagen, ich bin Óscar.", // German
    "Ciao, dicono che sono Óscar.", // Italian
    "Olá, dizem que sou Óscar.", // Portuguese
    "Привет, говорят, я Оскар А. Монтиель.", // Russian
    "你好，他们说我是奥斯卡·A·蒙蒂尔.", // Chinese
    "こんにちは、私はオスカー・A・モンティエルだと言われています.", // Japanese
    "Merhaba, benim Óscar  olduğumu söylüyorlar,", // Turkish
    "سلام، می‌گویند من اسکار آ. منتیل هستم", // Persian
    "Hej, de säger att jag är Óscar.", // Swedish
    "Hei, de sier at jeg er Óscar.", // Norwegian
    "Hoi, ze zeggen dat ik Óscar ben.", // Dutch
    "Hej, de siger, jeg er Óscar.", // Danish
    "Sawubona, bathi ngingu Óscar.", // Zulu
    "Hallo, hulle sê ek is Óscar.", // Afrikaans
    "Ahoj, říkají, že jsem Óscar.", // Czech
    "Witaj, mówią, że jestem Óscar.", // Polish
    "नमस्ते, वे कहते हैं कि मैं ओस्कर हूँ", // Hindi
  ];

  const [funnyText, setFunnyText] = useState(funnyTexts[0]);

  const changeText = () => {
    const randomIndex = Math.floor(Math.random() * funnyTexts.length);
    setFunnyText(funnyTexts[randomIndex]);
  };

  const throttledChangeName = _.throttle(changeText, 100, { trailing: false });

  useEffect(() => {
    const handleMouseMove = () => {
      throttledChangeName();
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      throttledChangeName.cancel();
    };
  }, []);

  return (
    <div className="about-info">
      <div className="about-info-inner">
        <p>
          <b>Software developer</b>, multidisciplinary <b>visual & sound artist</b>—most of the time everything at once.
        </p>
        <p>
          Have teached <b>artistic programming</b> using <b>Processing</b> & <b>Max/MSP</b>.
        </p>
        <p>
          Absolute <b>philosophy</b> freak—currently reading{" "}
          <a href="https://animanoir.notion.site/Mi-biblioteca-digital-06dfea2aa5e048bba145b85d5395c68f" target="_blank">these books.</a>
        </p>
        <p>
          At the moment working as a <b>front-end developer</b> (it just pays!), but always open to actually have fun & more money.
        </p>
        <p>
          {funnyText}
        </p>
      </div>
    </div>
  );
};

export default MutatingAbout;


/* <small>
Photo by{" "}
<a href="https://www.instagram.com/caudillophoto/" target="_blank">
  Mario Cruz
</a>
</small> */