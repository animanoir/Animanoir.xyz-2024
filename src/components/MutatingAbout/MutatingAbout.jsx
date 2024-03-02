import React, { useState, useEffect } from "react";
import _ from "lodash";
import "./MutatingAbout.css";

const MutatingAbout = () => {
  const titles = [
    "Hola, dicen que soy Óscar", // Spanish
    "Hello, they say I am Óscar ", // English
    "Bonjour, on dit que je suis Óscar ", // French
    "Hallo, sie sagen, ich bin Óscar ", // German
    "Ciao, dicono che sono Óscar ", // Italian
    "Olá, dizem que sou Óscar ", // Portuguese
    "Привет, говорят, я Оскар А. Монтиель", // Russian
    "你好，他们说我是奥斯卡·A·蒙蒂尔", // Chinese
    "こんにちは、私はオスカー・A・モンティエルだと言われています", // Japanese
    "안녕하세요, 저는 오스카 A. 몬티엘라고 합니다", // Korean
    "Merhaba, benim Óscar  olduğumu söylüyorlar", // Turkish
    "سلام، می‌گویند من اسکار آ. منتیل هستم", // Persian
    "Hej, de säger att jag är Óscar ", // Swedish
    "Hei, de sier at jeg er Óscar ", // Norwegian
    "Hoi, ze zeggen dat ik Óscar  ben", // Dutch
    "Hej, de siger, jeg er Óscar ", // Danish
    "Sawubona, bathi ngingu Óscar ", // Zulu
    "Hallo, hulle sê ek is Óscar ", // Afrikaans
    "Ahoj, říkají, že jsem Óscar ", // Czech
    "Witaj, mówią, że jestem Óscar ", // Polish
  ];

  const [title, setTitle] = useState(titles[0]);

  const changeName = () => {
    const randomIndex = Math.floor(Math.random() * titles.length);
    setTitle(titles[randomIndex]);
  };

  const throttledChangeName = _.throttle(changeName, 100, { trailing: false });

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
      <h1 id="aboutName">{title}</h1>
      <p>
        It's <b>metaphisically</b> hard to describe myself—I believe those who
        think they "truly" know themselves are lying! For some I am a son, a
        brother, a friend. For the ex-gf I'm the ex-bf, for those with
        unrequited love for me I'm the platonic soul. For others I'm a
        co-worker, a payroll. A student, a master, an idiot. For the government
        I'm a number, for the bank I'm a debtor. In the future I could be a
        father, even a hobo, or maybe a doctor. Before I was born I was an
        angel. And, when I die, I'll be death!{" "}
      </p>
      <h3>
        So, have I been, and will be, <i>someone</i> or <i>something</i> for all
        eternity?
      </h3>
      <p>
        Honestly, I don't know. The only think I know is that I <i>need</i> to{" "}
        <i>Be</i> whatever I want (or can) to <i>truly</i> exist.
      </p>
      <hr></hr>
      <p>
        For Capitalism, I'm a <strike>another proletariat</strike>{" "}
        <b>software engineer, specialized in web full-stack development</b>—if
        you're interested on my services, please take a look at my{" "}
        <a
          href="https://www.animanoir.xyz/cv/Oscar-A-Montiel-CV-2024v4.pdf"
          target="_blank"
        >
          utility card
        </a>{" "}
        .
      </p>
      <small>
        Photo by{" "}
        <a href="https://www.instagram.com/caudillophoto/">Mario Cruz</a>.
      </small>
    </div>
  );
};

export default MutatingAbout;
