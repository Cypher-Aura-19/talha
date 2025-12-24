import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { initAnimations } from "./anime.js";

gsap.registerPlugin(Flip);

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();

  const contactGif = document.querySelector(".contact-gif");

  if (contactGif) {
    const video = contactGif.querySelector("video");
    const originalCssText = contactGif.style.cssText;

    // 1. Force state to "Big" (Fullscreen) immediately
    Object.assign(contactGif.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "9999",
      transform: "none",
      borderRadius: "0",
      right: "auto"
    });

    const performAnimation = () => {
      // Use video duration or fallback
      const duration = (video && video.duration) ? video.duration : 3;

      // 2. Capture the "Big" state
      const state = Flip.getState(contactGif);

      // 3. Revert to "Small" state (Natural CSS)
      contactGif.style.cssText = originalCssText;

      // 4. Animate from "Big" to "Small" after delay
      Flip.from(state, {
        delay: duration, // Wait for first loop
        duration: 2,
        ease: "power4.inOut",
        absolute: true,
        onComplete: () => {
          gsap.set(contactGif, { clearProps: "all" });
        }
      });
    };

    if (video && video.readyState >= 1) {
      performAnimation();
    } else if (video) {
      video.addEventListener("loadedmetadata", performAnimation, { once: true });
    } else {
      performAnimation();
    }
  }
});
