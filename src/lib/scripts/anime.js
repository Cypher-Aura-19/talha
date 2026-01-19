import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

let splitInstances = [];

function getTextContent(element) {
  return element.textContent || element.innerText || "";
}

export function scrambleAnimation(element, delay = 0) {
  if (typeof window === 'undefined' || window.innerWidth < 1200) return;

  const textContent = getTextContent(element);

  if (!textContent.trim()) return;

  const split = new SplitText(element, {
    type: "chars",
  });

  splitInstances.push(split);

  gsap.set(split.chars, {
    opacity: 0,
  });

  setTimeout(() => {
    scrambleTextStaggered(split.chars, 0.4);
  }, delay * 1000);
}

export function revealAnimation(element, delay = 0) {
  if (typeof window === 'undefined' || window.innerWidth < 1200) return;

  const textContent = getTextContent(element);

  if (!textContent.trim()) return;

  const split = new SplitText(element, {
    type: "words",
    mask: "words",
  });

  splitInstances.push(split);

  gsap.set(split.words, {
    yPercent: 120,
  });

  gsap.to(split.words, {
    duration: 0.75,
    yPercent: 0,
    stagger: 0.1,
    ease: "power4.out",
    delay: delay,
    onStart: () => {
      // Ensure parent element is visible
      gsap.set(element, { opacity: 1 });
    }
  });
}

export function lineRevealAnimation(element, delay = 0) {
  if (typeof window === 'undefined') return;

  const textContent = getTextContent(element);

  if (!textContent.trim()) return;

  console.log('[Anime] Line reveal animation for:', element, 'delay:', delay);

  const split = new SplitText(element, {
    type: "lines",
    mask: "lines",
  });

  splitInstances.push(split);

  gsap.set(split.lines, {
    yPercent: 120,
  });

  gsap.to(split.lines, {
    duration: 0.8,
    yPercent: 0,
    stagger: 0.1,
    ease: "power4.out",
    delay: delay,
    onStart: () => {
      // Ensure parent element is visible
      gsap.set(element, { opacity: 1 });
    }
  });
}

function scrambleTextStaggered(elements, duration = 0.4) {
  elements.forEach((char, index) => {
    setTimeout(() => {
      scrambleText([char], duration);
    }, index * 30);
  });
}

function scrambleText(elements, duration = 0.4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  elements.forEach((char, index) => {
    const originalText = char.textContent;
    let iterations = 0;
    const maxIterations = Math.floor(Math.random() * 6) + 3;

    gsap.set(char, { opacity: 1 });

    const scrambleInterval = setInterval(() => {
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval);
        char.textContent = originalText;
      }
    }, 50);

    setTimeout(() => {
      clearInterval(scrambleInterval);
      char.textContent = originalText;
    }, duration * 1000);
  });
}

export function initAnimations() {
  if (typeof window === 'undefined') {
    console.log('[Anime] Skipping animations - no window');
    return;
  }

  console.log('[Anime] Initializing animations...');

  // Function to process animations
  const processAnimations = () => {
    const animatedElements = document.querySelectorAll("[data-animate-type]");
    console.log('[Anime] Found animated elements:', animatedElements.length);

    const sectionsWithScrollElements = new Set();
    const sectionObservers = new Map();

    animatedElements.forEach((element) => {
      const animationType = element.getAttribute("data-animate-type");
      const delay = parseFloat(element.getAttribute("data-animate-delay")) || 0;
      const animateOnScroll =
        element.getAttribute("data-animate-on-scroll") === "true";

      console.log('[Anime] Processing element:', element, 'type:', animationType, 'onScroll:', animateOnScroll);

      if (animateOnScroll) {
        gsap.set(element, { opacity: 0 });

        const parentSection = element.closest("section");
        if (!parentSection) {
          console.warn(
            "No parent section found for scroll animation:",
            element
          );
          return;
        }

        if (!sectionsWithScrollElements.has(parentSection)) {
          sectionsWithScrollElements.add(parentSection);

          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                  const sectionElements = entry.target.querySelectorAll(
                    '[data-animate-on-scroll="true"]'
                  );

                  sectionElements.forEach((el) => {
                    const elAnimationType =
                      el.getAttribute("data-animate-type");
                    const elDelay =
                      parseFloat(el.getAttribute("data-animate-delay")) || 0;

                    gsap.set(el, { opacity: 1 });

                    switch (elAnimationType) {
                      case "scramble":
                        scrambleAnimation(el, elDelay);
                        break;
                      case "reveal":
                        revealAnimation(el, elDelay);
                        break;
                      case "line-reveal":
                        lineRevealAnimation(el, elDelay);
                        break;
                    }
                  });

                  observer.unobserve(entry.target);
                }
              });
            },
            {
              threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
              rootMargin: "0px 0px -20% 0px",
            }
          );

          observer.observe(parentSection);
          sectionObservers.set(parentSection, observer);
        }
      } else {
        // Skip animations for hero section elements on initial load for HOME page only
        // They should already be visible from the transition
        const isHeroElement = element.closest('.hero');
        const isHomePage = window.location.pathname === '/';
        
        if (isHeroElement && isHomePage && !window.heroAnimationsPlayed) {
          console.log('[Anime] Skipping hero animation for home page:', element);
          // Just make sure element is visible, don't animate
          gsap.set(element, { opacity: 1 });
          return;
        }

        // For non-home pages hero elements, start animation before transition ends
        const effectiveDelay = isHeroElement && !isHomePage ? -1.5 : delay;

        switch (animationType) {
          case "scramble":
            scrambleAnimation(element, effectiveDelay);
            break;
          case "reveal":
            revealAnimation(element, effectiveDelay);
            break;
          case "line-reveal":
            lineRevealAnimation(element, effectiveDelay);
            break;
          default:
            console.warn(`Unknown animation type: ${animationType}`);
        }
      }
    });
    
    // Mark that hero animations have been handled
    if (!window.heroAnimationsPlayed) {
      window.heroAnimationsPlayed = true;
    }
  };

  // For hero elements on non-home pages, start immediately without waiting for fonts
  const isHomePage = window.location.pathname === '/';
  if (!isHomePage) {
    console.log('[Anime] Non-home page detected, starting hero animations immediately');
    processAnimations();
  } else {
    // For home page, wait for fonts to be ready
    document.fonts.ready.then(() => {
      processAnimations();
    });
  }
}

export function cleanupAnimations() {
  console.log('[Anime Cleanup] Starting cleanup, instances:', splitInstances.length);
  
  // First, check if elements still exist in DOM before reverting
  splitInstances.forEach((split, index) => {
    try {
      if (split && split.revert) {
        // Check if the element still exists in the DOM
        if (split.element && document.body.contains(split.element)) {
          console.log(`[Anime Cleanup] Reverting split ${index}`, split.element);
          split.revert();
        } else {
          console.log(`[Anime Cleanup] Skipping split ${index} - element not in DOM`);
        }
      }
    } catch (e) {
      console.error(`[Anime Cleanup] Error reverting split ${index}:`, e);
      // Continue with other cleanups even if one fails
    }
  });
  splitInstances = [];
  
  // Reset hero animations flag so they can play again if needed
  if (window.heroAnimationsPlayed) {
    window.heroAnimationsPlayed = false;
  }
  
  console.log('[Anime Cleanup] Cleanup complete');
}

export function animateElement(selector, type, delay = 0) {
  if (typeof window === 'undefined' || window.innerWidth < 1200) return;

  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return;
  }

  switch (type) {
    case "scramble":
      scrambleAnimation(element, delay);
      break;
    case "reveal":
      revealAnimation(element, delay);
      break;
    case "line-reveal":
      lineRevealAnimation(element, delay);
      break;
    default:
      console.warn(`Unknown animation type: ${type}`);
  }
}

export function animateElements(selector, type, delay = 0, staggerDelay = 0.1) {
  if (typeof window === 'undefined' || window.innerWidth < 1200) return;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) {
    console.warn(`Elements not found: ${selector}`);
    return;
  }

  elements.forEach((element, index) => {
    const totalDelay = delay + index * staggerDelay;

    switch (type) {
      case "scramble":
        scrambleAnimation(element, totalDelay);
        break;
      case "reveal":
        revealAnimation(element, totalDelay);
        break;
      case "line-reveal":
        lineRevealAnimation(element, totalDelay);
        break;
      default:
        console.warn(`Unknown animation type: ${type}`);
    }
  });
}
