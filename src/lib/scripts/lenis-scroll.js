import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function initLenis() {
  if (typeof window === 'undefined') return null;

  if (lenis) {
    console.log('[Lenis] Already initialized, returning existing instance');
    return lenis;
  }

  console.log('[Lenis] Initializing...');
  
  lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Store in window for checking if already loaded
  window.lenis = lenis;
  console.log('[Lenis] Initialized successfully');

  return lenis;
}

export { lenis };
