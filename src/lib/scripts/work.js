import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import slides from "./slides";

// Store instances for cleanup
let splitInstances = [];
let wheelListener = null;
let touchStartListener = null;
let touchMoveListener = null;
let touchEndListener = null;
let workInitialized = false;
let preInitialized = false;

// Export pre-init function to create first slide immediately (before transition)
export function preInitWork() {
  if (typeof window === 'undefined') return;
  if (preInitialized) return;
  
  console.log('[Work Pre-Init] Creating first slide...');
  preInitialized = true;
  
  const slider = document.querySelector(".slider");
  if (!slider) return;
  
  // Show slider immediately
  gsap.set(slider, { opacity: 1 });
  
  // Create first slide with image (no text animations yet)
  const slideData = slides[0];
  
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.dataset.preInit = "true"; // Mark as pre-initialized
  
  const slideImg = document.createElement("div");
  slideImg.className = "slide-img";
  const img = document.createElement("img");
  img.src = slideData.slideImg;
  img.alt = "";
  img.style.opacity = "1";
  
  slideImg.appendChild(img);
  
  const slideHeader = document.createElement("div");
  slideHeader.className = "slide-header";
  
  const slideTitle = document.createElement("div");
  slideTitle.className = "slide-title";
  const h2 = document.createElement("h2");
  h2.textContent = slideData.slideTitle;
  slideTitle.appendChild(h2);
  
  const slideDescription = document.createElement("div");
  slideDescription.className = "slide-description";
  const p = document.createElement("p");
  p.textContent = slideData.slideDescription;
  slideDescription.appendChild(p);
  
  const slideLink = document.createElement("div");
  slideLink.className = "slide-link";
  const a = document.createElement("a");
  a.href = slideData.slideUrl;
  a.textContent = "Access Log";
  slideLink.appendChild(a);
  
  slideHeader.appendChild(slideTitle);
  slideHeader.appendChild(slideDescription);
  slideHeader.appendChild(slideLink);
  
  const slideInfo = document.createElement("div");
  slideInfo.className = "slide-info";
  
  const slideTags = document.createElement("div");
  slideTags.className = "slide-tags";
  const tagsLabel = document.createElement("p");
  tagsLabel.className = "mono";
  tagsLabel.textContent = "Specs";
  slideTags.appendChild(tagsLabel);
  
  slideData.slideTags.forEach((tag) => {
    const tagP = document.createElement("p");
    tagP.className = "mono";
    tagP.textContent = tag;
    slideTags.appendChild(tagP);
  });
  
  const slideIndexWrapper = document.createElement("div");
  slideIndexWrapper.className = "slide-index-wrapper";
  const slideIndexCopy = document.createElement("p");
  slideIndexCopy.className = "mono";
  slideIndexCopy.textContent = "01";
  const slideIndexSeparator = document.createElement("p");
  slideIndexSeparator.className = "mono";
  slideIndexSeparator.textContent = "/";
  const slidesTotalCount = document.createElement("p");
  slidesTotalCount.className = "mono";
  slidesTotalCount.textContent = slides.length.toString().padStart(2, "0");
  
  slideIndexWrapper.appendChild(slideIndexCopy);
  slideIndexWrapper.appendChild(slideIndexSeparator);
  slideIndexWrapper.appendChild(slidesTotalCount);
  
  slideInfo.appendChild(slideTags);
  slideInfo.appendChild(slideIndexWrapper);
  
  slide.appendChild(slideImg);
  slide.appendChild(slideHeader);
  slide.appendChild(slideInfo);
  
  slider.appendChild(slide);
  
  console.log('[Work Pre-Init] First slide created with image');
}

// Export cleanup function
export function cleanupWork() {
  if (typeof window === 'undefined') return;
  
  console.log('[Work Cleanup] Starting cleanup...');
  
  try {
    // CRITICAL: Remove event listeners FIRST to stop all interactions
    if (wheelListener) {
      console.log('[Work Cleanup] Removing wheel listener');
      window.removeEventListener('wheel', wheelListener);
      wheelListener = null;
    }
    if (touchStartListener) {
      console.log('[Work Cleanup] Removing touchstart listener');
      window.removeEventListener('touchstart', touchStartListener);
      touchStartListener = null;
    }
    if (touchMoveListener) {
      console.log('[Work Cleanup] Removing touchmove listener');
      window.removeEventListener('touchmove', touchMoveListener);
      touchMoveListener = null;
    }
    if (touchEndListener) {
      console.log('[Work Cleanup] Removing touchend listener');
      window.removeEventListener('touchend', touchEndListener);
      touchEndListener = null;
    }
    
    // Revert all SplitText instances
    console.log('[Work Cleanup] Reverting SplitText instances:', splitInstances.length);
    splitInstances.forEach((split, index) => {
      try {
        if (split && split.revert) {
          if (split.element && document.body.contains(split.element)) {
            split.revert();
          }
        }
      } catch (e) {
        console.error(`[Work Cleanup] Error reverting SplitText ${index}:`, e);
      }
    });
    splitInstances = [];
    
    // Kill all GSAP animations
    console.log('[Work Cleanup] Killing all GSAP tweens');
    try {
      gsap.killTweensOf("*");
    } catch (e) {
      console.error('[Work Cleanup] Error killing tweens:', e);
    }
    
    // DON'T clear slider content - leave it visible so it shows behind transition blocks
    // The new page will replace it when it loads
    console.log('[Work Cleanup] Leaving slider content visible for transition');
    
    workInitialized = false;
    
    console.log('[Work Cleanup] Cleanup complete');
  } catch (error) {
    console.error('[Work Cleanup] Fatal error during cleanup:', error);
  }
}

// Export init function for Next.js
export function initWork() {
  if (typeof window === 'undefined') return;
  if (workInitialized) {
    console.log('[Work Init] Already initialized, skipping');
    return;
  }

  console.log('[Work Init] Starting initialization...');
  workInitialized = true;
  
  // Cleanup any existing instances first
  cleanupWork();

  const totalSlides = slides.length;
  let currentSlide = 1;

  let isAnimating = false;
  let scrollAllowed = false;
  let lastScrollTime = 0;
  let imagesPreloaded = false;

  // Show slider immediately so image is visible during transition
  const slider = document.querySelector(".slider");
  if (slider) {
    gsap.set(slider, {
      opacity: 1,
    });
  }

  function preloadImages() {
    return new Promise((resolve) => {
      let loadedCount = 0;
      const totalImages = slides.length;

      if (totalImages === 0) {
        resolve();
        return;
      }

      slides.forEach((slide) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            imagesPreloaded = true;
            resolve();
          }
        };
        img.src = slide.slideImg;
      });
    });
  }

  function createSlide(slideIndex) {
    const slideData = slides[slideIndex - 1];

    const slide = document.createElement("div");
    slide.className = "slide";

    const slideImg = document.createElement("div");
    slideImg.className = "slide-img";
    const img = document.createElement("img");
    img.src = slideData.slideImg;
    img.alt = "";

    // Show image immediately (don't hide it)
    img.style.opacity = "1";

    if (!imagesPreloaded) {
      img.onload = () => {
        gsap.to(img, { opacity: 1, duration: 0.3 });
      };
    }

    slideImg.appendChild(img);

    const slideHeader = document.createElement("div");
    slideHeader.className = "slide-header";

    const slideTitle = document.createElement("div");
    slideTitle.className = "slide-title";
    const h2 = document.createElement("h2");
    h2.textContent = slideData.slideTitle;
    slideTitle.appendChild(h2);

    const slideDescription = document.createElement("div");
    slideDescription.className = "slide-description";
    const p = document.createElement("p");
    p.textContent = slideData.slideDescription;
    slideDescription.appendChild(p);

    const slideLink = document.createElement("div");
    slideLink.className = "slide-link";
    const a = document.createElement("a");
    a.href = slideData.slideUrl;
    a.textContent = "Access Log";
    slideLink.appendChild(a);

    slideHeader.appendChild(slideTitle);
    slideHeader.appendChild(slideDescription);
    slideHeader.appendChild(slideLink);

    const slideInfo = document.createElement("div");
    slideInfo.className = "slide-info";

    const slideTags = document.createElement("div");
    slideTags.className = "slide-tags";
    const tagsLabel = document.createElement("p");
    tagsLabel.className = "mono";
    tagsLabel.textContent = "Specs";
    slideTags.appendChild(tagsLabel);

    slideData.slideTags.forEach((tag) => {
      const tagP = document.createElement("p");
      tagP.className = "mono";
      tagP.textContent = tag;
      slideTags.appendChild(tagP);
    });

    const slideIndexWrapper = document.createElement("div");
    slideIndexWrapper.className = "slide-index-wrapper";
    const slideIndexCopy = document.createElement("p");
    slideIndexCopy.className = "mono";
    slideIndexCopy.textContent = slideIndex.toString().padStart(2, "0");
    const slideIndexSeparator = document.createElement("p");
    slideIndexSeparator.className = "mono";
    slideIndexSeparator.textContent = "/";
    const slidesTotalCount = document.createElement("p");
    slidesTotalCount.className = "mono";
    slidesTotalCount.textContent = totalSlides.toString().padStart(2, "0");

    slideIndexWrapper.appendChild(slideIndexCopy);
    slideIndexWrapper.appendChild(slideIndexSeparator);
    slideIndexWrapper.appendChild(slidesTotalCount);

    slideInfo.appendChild(slideTags);
    slideInfo.appendChild(slideIndexWrapper);

    slide.appendChild(slideImg);
    slide.appendChild(slideHeader);
    slide.appendChild(slideInfo);

    return slide;
  }

  function splitText(slide) {
    const slideHeader = slide.querySelector(".slide-title h2");
    if (slideHeader) {
      const split = SplitText.create(slideHeader, {
        type: "words",
        wordsClass: "word",
        mask: "words",
      });
      splitInstances.push(split);
    }

    const slideContent = slide.querySelectorAll("p, a");
    slideContent.forEach((element) => {
      const split = SplitText.create(element, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
        reduceWhiteSpace: false,
      });
      splitInstances.push(split);
    });
  }

  function initializeFirstSlide() {
    const slider = document.querySelector(".slider");
    if (!slider) return;

    // Check if slide was pre-rendered in JSX
    let firstSlide = slider.querySelector('.slide[data-pre-rendered="true"]');
    
    if (!firstSlide) {
      // Create slide if it wasn't pre-rendered
      firstSlide = createSlide(1);
      slider.appendChild(firstSlide);
    } else {
      // Remove the pre-rendered marker
      firstSlide.removeAttribute('data-pre-rendered');
    }

    // Apply SplitText FIRST while containers are still hidden
    splitText(firstSlide);

    const words = firstSlide.querySelectorAll(".word");
    const lines = firstSlide.querySelectorAll(".line");

    // Keep text hidden initially
    gsap.set([...words, ...lines], {
      y: "100%",
      force3D: true,
    });

    // NOW show text containers (after SplitText has created masks)
    const slideHeader = firstSlide.querySelector('.slide-header');
    const slideInfo = firstSlide.querySelector('.slide-info');
    if (slideHeader) gsap.set(slideHeader, { visibility: 'visible' });
    if (slideInfo) gsap.set(slideInfo, { visibility: 'visible' });

    // Animate text after a short delay (transition should be complete by then)
    const tl = gsap.timeline({ delay: 0.3 });

    const headerWords = firstSlide.querySelectorAll(".slide-title .word");
    tl.to(
      headerWords,
      {
        y: "0%",
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.03,
        force3D: true,
      },
      0
    );

    const tagsLines = firstSlide.querySelectorAll(".slide-tags .line");
    const indexLines = firstSlide.querySelectorAll(
      ".slide-index-wrapper .line"
    );
    const descriptionLines = firstSlide.querySelectorAll(
      ".slide-description .line"
    );

    tl.to(
      tagsLines,
      {
        y: "0%",
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.03,
      },
      "-=0.5"
    );

    tl.to(
      indexLines,
      {
        y: "0%",
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.03,
      },
      "<"
    );

    tl.to(
      descriptionLines,
      {
        y: "0%",
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.03,
      },
      "<"
    );

    const linkLines = firstSlide.querySelectorAll(".slide-link .line");
    tl.to(
      linkLines,
      {
        y: "0%",
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.8"
    );

    setTimeout(() => {
      scrollAllowed = true;
      lastScrollTime = Date.now();
    }, 1000);
  }

  function animateSlide(direction) {
    if (isAnimating || !scrollAllowed) return;

    isAnimating = true;
    scrollAllowed = false;

    const slider = document.querySelector(".slider");
    if (!slider) return;
    
    const currentSlideElement = slider.querySelector(".slide");
    if (!currentSlideElement) return;

    if (direction === "down") {
      currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
    } else {
      currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
    }

    const exitY = direction === "down" ? "-200vh" : "200vh";
    const entryY = direction === "down" ? "100vh" : "-100vh";

    gsap.to(currentSlideElement, {
      scale: 0.25,
      opacity: 0,
      rotation: 30,
      y: exitY,
      duration: 2,
      ease: "power4.inOut",
      force3D: true,
      onComplete: () => {
        if (currentSlideElement.parentNode) {
          currentSlideElement.remove();
        }
      },
    });

    setTimeout(() => {
      const newSlide = createSlide(currentSlide);
      const newSlideImg = newSlide.querySelector(".slide-img img");

      gsap.set(newSlide, {
        y: entryY,
        force3D: true,
      });

      gsap.set(newSlideImg, {
        scale: 2,
        force3D: true,
      });

      slider.appendChild(newSlide);

      splitText(newSlide);

      const words = newSlide.querySelectorAll(".word");
      const lines = newSlide.querySelectorAll(".line");

      gsap.set([...words, ...lines], {
        y: "100%",
        force3D: true,
      });

      gsap.to(newSlide, {
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        force3D: true,
        onStart: () => {
          gsap.to(newSlideImg, {
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            force3D: true,
          });

          const tl = gsap.timeline();

          const headerWords = newSlide.querySelectorAll(".slide-title .word");
          tl.to(
            headerWords,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
              force3D: true,
            },
            0.75
          );

          const tagsLines = newSlide.querySelectorAll(".slide-tags .line");
          const indexLines = newSlide.querySelectorAll(
            ".slide-index-wrapper .line"
          );
          const descriptionLines = newSlide.querySelectorAll(
            ".slide-description .line"
          );

          tl.to(
            tagsLines,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
            },
            "-=0.75"
          );

          tl.to(
            indexLines,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
            },
            "<"
          );

          tl.to(
            descriptionLines,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
            },
            "<"
          );

          const linkLines = newSlide.querySelectorAll(".slide-link .line");
          tl.to(
            linkLines,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
            },
            "-=1"
          );
        },
        onComplete: () => {
          isAnimating = false;
          setTimeout(() => {
            scrollAllowed = true;
            lastScrollTime = Date.now();
          }, 100);
        },
      });
    }, 750);
  }

  function handleScroll(direction) {
    const now = Date.now();

    if (isAnimating || !scrollAllowed) return;
    if (now - lastScrollTime < 1000) return;

    lastScrollTime = now;
    animateSlide(direction);
  }

  async function init() {
    try {
      await preloadImages();
    } catch (error) {
      console.warn("Image preloading failed", error);
    }

    initializeFirstSlide();

    wheelListener = (e) => {
      // Only prevent default if the target is within the slider
      // This allows navigation links to work properly
      const slider = document.querySelector(".slider");
      if (!slider) return;
      
      // Check if the event target is a link or inside a link
      const isLink = e.target.closest('a');
      if (isLink) {
        // Don't prevent default on links - let them navigate
        return;
      }
      
      // Only prevent default for slider scrolling
      e.preventDefault();
      const direction = e.deltaY > 0 ? "down" : "up";
      handleScroll(direction);
    };
    
    window.addEventListener("wheel", wheelListener, { passive: false });

    let touchStartY = 0;
    let isTouchActive = false;

    touchStartListener = (e) => {
      // Check if touch started on a link
      const isLink = e.target.closest('a');
      if (isLink) {
        // Don't handle touch on links
        return;
      }
      
      touchStartY = e.touches[0].clientY;
      isTouchActive = true;
    };
    
    window.addEventListener("touchstart", touchStartListener, { passive: false });

    touchMoveListener = (e) => {
      if (!isTouchActive || isAnimating || !scrollAllowed) return;
      
      // Check if touch is on a link
      const isLink = e.target.closest('a');
      if (isLink) {
        return;
      }
      
      e.preventDefault();

      const touchCurrentY = e.touches[0].clientY;
      const difference = touchStartY - touchCurrentY;

      if (Math.abs(difference) > 50) {
        isTouchActive = false;
        const direction = difference > 0 ? "down" : "up";
        handleScroll(direction);
      }
    };
    
    window.addEventListener("touchmove", touchMoveListener, { passive: false });

    touchEndListener = () => {
      isTouchActive = false;
    };
    
    window.addEventListener("touchend", touchEndListener);
  }

  init();
  
  console.log('[Work Init] Initialization complete');
}
