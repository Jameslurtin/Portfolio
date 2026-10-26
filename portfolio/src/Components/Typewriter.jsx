import { useEffect, useState } from "react";
import { useLanguage } from "../lib/Language";
import useReducedMotion from "../lib/useReducedMotion";
import { profile } from "../data/profile";

const roles = profile.roles;

export default function Typewriter() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const [text, setText] = useState("");
  useEffect(() => {
    if (reduced) return;
    let timer, phrase = 0, index = 0, deleting = false;
    const tick = () => {
      const value = roles[language][phrase];
      index += deleting ? -1 : 1;
      setText(value.slice(0, index));
      let delay = deleting ? 60 : 90;
      if (!deleting && index === value.length) { deleting = true; delay = 1800; }
      else if (deleting && index === 0) { deleting = false; phrase = (phrase + 1) % roles[language].length; }
      timer = setTimeout(tick, delay);
    };
    tick();
    return () => clearTimeout(timer);
  }, [language, reduced]);
  return <><span className="sr-only">{roles[language].join(" · ")}</span><span aria-hidden="true">{reduced ? roles[language][0] : text}<span className="terminal-caret">_</span></span></>;
}
