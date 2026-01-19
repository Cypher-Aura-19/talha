import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations, cleanupAnimations } from "./anime";
import { initLenis } from "./lenis-scroll";

// Store all SplitText instances and ScrollTriggers for cleanup
let splitInstances = [];
let scrollTriggers = [];

// Export cleanup function
export function cleanupHome() {
  if (typeof window === 'undefined') return;
  
  console.log('[Home Cleanup] Starting cleanup...');
  
  try {
    // Kill all ScrollTriggers first
    console.log('[Home Cleanup] Killing ScrollTriggers:', scrollTriggers.length);
    scrollTriggers.forEach((st, index) => {
      try {
        if (st && st.kill) {
          st.kill();
          console.log(`[Home Cleanup] Killed ScrollTrigger ${index}`);
        }
      } catch (e) {
        console.error(`[Home Cleanup] Error killing ScrollTrigger ${index}:`, e);
      }
    });
    scrollTriggers = [];
    
    // Revert all SplitText instances BEFORE React unmounts
    console.log('[Home Cleanup] Reverting SplitText instances:', splitInstances.length);
    splitInstances.forEach((split, index) => {
      try {
        if (split && split.revert) {
          // Check if the element still exists in the DOM
          if (split.element && document.body.contains(split.element)) {
            console.log(`[Home Cleanup] Reverting SplitText ${index}`, split.element);
            split.revert();
          } else {
            console.log(`[Home Cleanup] Skipping SplitText ${index} - element not in DOM`);
          }
        }
      } catch (e) {
        console.error(`[Home Cleanup] Error reverting SplitText ${index}:`, e);
      }
    });
    splitInstances = [];
    
    // Cleanup text animations
    console.log('[Home Cleanup] Cleaning up text animations');
    try {
      cleanupAnimations();
    } catch (e) {
      console.error('[Home Cleanup] Error cleaning animations:', e);
    }
    
    // Kill all GSAP animations
    console.log('[Home Cleanup] Killing all GSAP tweens');
    try {
      gsap.killTweensOf("*");
    } catch (e) {
      console.error('[Home Cleanup] Error killing tweens:', e);
    }
    
    // Clear all ScrollTriggers globally
    console.log('[Home Cleanup] Clearing all ScrollTriggers globally');
    try {
      ScrollTrigger.getAll().forEach((st, index) => {
        console.log(`[Home Cleanup] Killing global ScrollTrigger ${index}`);
        st.kill();
      });
    } catch (e) {
      console.error('[Home Cleanup] Error clearing ScrollTriggers:', e);
    }
    
    console.log('[Home Cleanup] Cleanup complete');
  } catch (error) {
    console.error('[Home Cleanup] Fatal error during cleanup:', error);
  }
}

// Export init function for Next.js
export function initHome() {
  if (typeof window === 'undefined') return;
  
  console.log('[Home Init] Starting initialization...');
  
  // Cleanup any existing instances first
  cleanupHome();
  
  // Lenis is already initialized in page.js, just ensure it exists
  if (!window.lenis) {
    console.warn('[Home Init] Lenis not found, initializing...');
    initLenis();
  } else {
    console.log('[Home Init] Lenis already initialized');
  }
  
  // Initialize text animations
  initAnimations();

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Enable GPU acceleration globally
  gsap.config({
    force3D: true,
  });

  // Check if cards are already visible (from transition reveal)
  const heroCards = document.querySelectorAll(".hero .hero-cards .card");
  const cardsAlreadyVisible = heroCards.length > 0 && 
    gsap.getProperty(heroCards[0], "opacity") > 0;

  if (!cardsAlreadyVisible) {
    // Only set initial state if cards aren't already visible
    gsap.set(".hero .hero-cards .card", {
      transformOrigin: "center center",
      scale: 0.001,
      opacity: 0,
      force3D: true,
    });

    gsap.to(".hero .hero-cards .card", {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      delay: 0.2,
      stagger: 0.08,
      ease: "power3.out",
      force3D: true,
      onComplete: () => {
        gsap.set("#hero-card-1", { transformOrigin: "top right" });
        gsap.set("#hero-card-3", { transformOrigin: "top left" });
      },
    });
  } else {
    // Cards are already visible, just set transform origins
    console.log('[Home Init] Cards already visible, skipping initial animation');
    gsap.set("#hero-card-1", { transformOrigin: "top right" });
    gsap.set("#hero-card-3", { transformOrigin: "top left" });
  }

  const smoothStep = (p) => p * p * (3 - 2 * p);

  if (window.innerWidth > 1000) {
    const heroScrollTrigger = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "75% top",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        const heroCardsContainerOpacity = gsap.utils.interpolate(
          1,
          0.5,
          smoothStep(progress)
        );
        gsap.set(".hero-cards", {
          opacity: heroCardsContainerOpacity,
        });

        ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach(
          (cardId, index) => {
            const delay = index * 0.9;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (1 - delay * 0.1)
            );

            const y = gsap.utils.interpolate(
              "0%",
              "400%",
              smoothStep(cardProgress)
            );
            const scale = gsap.utils.interpolate(
              1,
              0.75,
              smoothStep(cardProgress)
            );

            let x = "0%";
            let rotation = 0;
            if (index === 0) {
              x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(
                0,
                -15,
                smoothStep(cardProgress)
              );
            } else if (index === 2) {
              x = gsap.utils.interpolate(
                "0%",
                "-90%",
                smoothStep(cardProgress)
              );
              rotation = gsap.utils.interpolate(
                0,
                15,
                smoothStep(cardProgress)
              );
            }

            gsap.set(cardId, {
              y: y,
              x: x,
              rotation: rotation,
              scale: scale,
            });
          }
        );
      },
    });
    scrollTriggers.push(heroScrollTrigger);

    const servicesPin = ScrollTrigger.create({
      trigger: ".home-services",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      pin: ".home-services",
      pinSpacing: true,
    });
    scrollTriggers.push(servicesPin);

    const servicesScroll = ScrollTrigger.create({
      trigger: ".home-services",
      start: "top bottom",
      end: `+=${window.innerHeight * 4}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
        const headerOpacity = gsap.utils.interpolate(
          0,
          1,
          smoothStep(headerProgress)
        );
        gsap.set(".home-services-header", {
          opacity: headerOpacity,
        });

        ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
          const delay = index * 0.5;
          const cardProgress = gsap.utils.clamp(
            0,
            1,
            (progress - delay * 0.1) / (0.9 - delay * 0.1)
          );

          const innerCard = document.querySelector(
            `${cardId} .flip-card-inner`
          );

          let y;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            y = gsap.utils.interpolate(
              "-100%",
              "50%",
              smoothStep(normalizedProgress)
            );
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            y = gsap.utils.interpolate(
              "50%",
              "0%",
              smoothStep(normalizedProgress)
            );
          } else {
            y = "0%";
          }

          let scale;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            scale = gsap.utils.interpolate(
              0.25,
              0.75,
              smoothStep(normalizedProgress)
            );
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            scale = gsap.utils.interpolate(
              0.75,
              1,
              smoothStep(normalizedProgress)
            );
          } else {
            scale = 1;
          }

          let opacity;
          if (cardProgress < 0.2) {
            const normalizedProgress = cardProgress / 0.2;
            opacity = smoothStep(normalizedProgress);
          } else {
            opacity = 1;
          }

          let x, rotate, rotationY;
          if (cardProgress < 0.6) {
            x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
            rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
            rotationY = 0;
          } else if (cardProgress < 1) {
            const normalizedProgress = (cardProgress - 0.6) / 0.4;
            x = gsap.utils.interpolate(
              index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
              "0%",
              smoothStep(normalizedProgress)
            );
            rotate = gsap.utils.interpolate(
              index === 0 ? -5 : index === 1 ? 0 : 5,
              0,
              smoothStep(normalizedProgress)
            );
            rotationY = smoothStep(normalizedProgress) * 180;
          } else {
            x = "0%";
            rotate = 0;
            rotationY = 180;
          }

          gsap.set(cardId, {
            opacity: opacity,
            y: y,
            x: x,
            rotate: rotate,
            scale: scale,
          });

          if (innerCard) {
            gsap.set(innerCard, {
              rotationY: rotationY,
            });
          }
        });
      },
    });
    scrollTriggers.push(servicesScroll);
  }

  const spotlightImages = document.querySelector(".home-spotlight-images");
  if (!spotlightImages) return;
  
  const containerHeight = spotlightImages.offsetHeight;
  const viewportHeight = window.innerHeight;

  const initialOffset = containerHeight * 0.05;
  const totalMovement = containerHeight + initialOffset + viewportHeight;

  const spotlightHeader = document.querySelector(".spotlight-mask-header h3");
  let headerSplit = null;

  if (spotlightHeader) {
    headerSplit = SplitText.create(spotlightHeader, {
      type: "words",
      wordsClass: "spotlight-word",
    });
    splitInstances.push(headerSplit);

    gsap.set(headerSplit.words, { opacity: 0 });
  }

  const spotlightScrollTrigger = ScrollTrigger.create({
    trigger: ".home-spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 7}px`,
    pin: true,
    pinSpacing: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress <= 0.5) {
        const animationProgress = progress / 0.5;

        const startY = 5;
        const endY = -(totalMovement / containerHeight) * 100;

        const currentY = startY + (endY - startY) * animationProgress;

        gsap.set(spotlightImages, {
          y: `${currentY}%`,
        });
      }

      const maskContainer = document.querySelector(
        ".spotlight-mask-image-container"
      );
      const maskImage = document.querySelector(".spotlight-mask-image");

      if (maskContainer && maskImage) {
        if (progress >= 0.25 && progress <= 0.75) {
          const maskProgress = (progress - 0.25) / 0.5;
          const maskSize = `${maskProgress * 475}%`;

          const imageScale = 1.25 - maskProgress * 0.25;

          maskContainer.style.setProperty("-webkit-mask-size", maskSize);
          maskContainer.style.setProperty("mask-size", maskSize);

          gsap.set(maskImage, {
            scale: imageScale,
          });
        } else if (progress < 0.25) {
          maskContainer.style.setProperty("-webkit-mask-size", "0%");
          maskContainer.style.setProperty("mask-size", "0%");

          gsap.set(maskImage, {
            scale: 1.25,
          });
        } else if (progress > 0.75) {
          maskContainer.style.setProperty("-webkit-mask-size", "475%");
          maskContainer.style.setProperty("mask-size", "475%");

          gsap.set(maskImage, {
            scale: 1,
          });
        }
      }

      if (headerSplit && headerSplit.words.length > 0) {
        if (progress >= 0.75 && progress <= 0.95) {
          const textProgress = (progress - 0.75) / 0.2;
          const totalWords = headerSplit.words.length;

          headerSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.75) {
          gsap.set(headerSplit.words, { opacity: 0 });
        } else if (progress > 0.95) {
          gsap.set(headerSplit.words, { opacity: 1 });
        }
      }
    },
  });
  scrollTriggers.push(spotlightScrollTrigger);

  const outroHeader = document.querySelector(".outro h3");
  let outroSplit = null;

  if (outroHeader) {
    outroSplit = SplitText.create(outroHeader, {
      type: "words",
      wordsClass: "outro-word",
    });
    splitInstances.push(outroSplit);

    gsap.set(outroSplit.words, { opacity: 0 });
  }

  const outroStrips = document.querySelectorAll(".outro-strip");
  const stripSpeeds = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

  const outroPin = ScrollTrigger.create({
    trigger: ".outro",
    start: "top top",
    end: `+=${window.innerHeight * 3}px`,
    pin: true,
    pinSpacing: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;

      if (outroSplit && outroSplit.words.length > 0) {
        if (progress >= 0.25 && progress <= 0.75) {
          const textProgress = (progress - 0.25) / 0.5;
          const totalWords = outroSplit.words.length;

          outroSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.25) {
          gsap.set(outroSplit.words, { opacity: 0 });
        } else if (progress > 0.75) {
          gsap.set(outroSplit.words, { opacity: 1 });
        }
      }
    },
  });
  scrollTriggers.push(outroPin);

  const outroScroll = ScrollTrigger.create({
    trigger: ".outro",
    start: "top bottom",
    end: `+=${window.innerHeight * 6}px`,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;

      outroStrips.forEach((strip, index) => {
        if (stripSpeeds[index] !== undefined) {
          const speed = stripSpeeds[index];
          const movement = progress * 100 * speed;

          gsap.set(strip, {
            x: `${movement}%`,
          });
        }
      });
    },
  });
  scrollTriggers.push(outroScroll);

  // Home About Hover Effect - Instant with pre-loaded images
  const aboutCards = document.querySelectorAll(".home-about-card");
  const previewImages = document.querySelectorAll(".home-about-preview .preview-img");

  if (aboutCards.length > 0 && previewImages.length > 0) {
    aboutCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        const previewId = card.dataset.preview;
        if (previewId) {
          // Hide all preview images
          previewImages.forEach((img) => img.classList.remove("active"));
          // Show the matching one
          const targetImg = document.querySelector(
            `.preview-img[data-for="${previewId}"]`
          );
          if (targetImg) {
            targetImg.classList.add("active");
          }
        }
      });

      card.addEventListener("mouseleave", () => {
        // Hide all preview images
        previewImages.forEach((img) => img.classList.remove("active"));
      });
    });
  }
}
