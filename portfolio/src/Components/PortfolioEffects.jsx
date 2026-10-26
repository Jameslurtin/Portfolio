import { useEffect, useRef } from "react";
import useReducedMotion from "../lib/useReducedMotion";

export default function PortfolioEffects() {
  const dot = useRef(null);
  const ring = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    let stop = () => {};
    const setup = () => {
      stop();
      if (reduced || !media.matches) return;
      let frame, x = 0, y = 0, rx = 0, ry = 0, visible = false;
      const animate = () => {
        rx += (x - rx) * .12;
        ry += (y - ry) * .12;
        dot.current.style.left = `${x}px`; dot.current.style.top = `${y}px`;
        ring.current.style.left = `${rx}px`; ring.current.style.top = `${ry}px`;
        frame = requestAnimationFrame(animate);
      };
      const hide = () => {
        visible = false;
        cancelAnimationFrame(frame);
        document.documentElement.classList.remove("custom-cursor", "cursor-hover");
      };
      const move = event => {
        if (event.pointerType !== "mouse") { hide(); return; }
        x = event.clientX; y = event.clientY;
        if (!visible) { rx = x; ry = y; visible = true; document.documentElement.classList.add("custom-cursor"); animate(); }
        document.documentElement.classList.toggle("cursor-hover", Boolean(event.target.closest("a,button,input,textarea,summary")));
      };
      document.addEventListener("pointermove", move);
      document.documentElement.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);
      stop = () => {
        hide(); document.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
      };
    };
    setup(); media.addEventListener("change", setup);
    return () => { stop(); media.removeEventListener("change", setup); };
  }, [reduced]);
  useEffect(() => {
    if (reduced || !("IntersectionObserver" in window)) return;
    const elements = document.querySelectorAll("main > section:not(#home) h2, main article, #skills .grid > div, #about .space-y-5, .about-stats > div, #contact form");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    elements.forEach(element => { element.classList.add("scroll-reveal"); observer.observe(element); });
    // Keyboard navigation must never land on invisible content.
    const revealFocused = event => event.target.closest(".scroll-reveal")?.classList.add("is-visible");
    document.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect(); document.removeEventListener("focusin", revealFocused);
      elements.forEach(element => element.classList.remove("scroll-reveal", "is-visible"));
    };
  }, [reduced]);
  return <><span ref={dot} className="cursor-dot" aria-hidden="true" /><span ref={ring} className="cursor-ring" aria-hidden="true" /></>;
}
