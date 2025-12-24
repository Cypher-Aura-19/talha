import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  initAnimations();

  setTimeout(() => {
    // Initialize in DOM order for proper ScrollTrigger sequencing
    // 1. First anime-text (background story) - before snapshots
    // 2. Snapshots horizontal scroll
    // 3. Second anime-text (client review) - after snapshots
    initAllAnimationsInOrder();
    // Refresh all ScrollTriggers after setup
    ScrollTrigger.refresh();
  }, 100);
});

function initAllAnimationsInOrder() {
  // Prepare all anime-text word splitting first
  prepareAnimeTextWords();

  // Get all sections that need ScrollTrigger in DOM order
  const backgroundStory = document.querySelector(".anime-text-container.project-anime-text");
  const snapshots = document.querySelector(".project-snapshots");
  const clientReview = document.querySelector(".project-client-review.project-anime-text");

  // Initialize in DOM order
  if (backgroundStory) {
    initSingleAnimeTextAnimation(backgroundStory);
  }

  if (snapshots) {
    initSnapshotsScroll();
  }

  if (clientReview) {
    initSingleAnimeTextAnimation(clientReview);
  }
}

function initSnapshotsScroll() {
  const wrapper = document.querySelector(".project-snapshots-wrapper");
  const snapshotsSection = document.querySelector(".project-snapshots");

  if (!wrapper || !snapshotsSection) return;

  const snapshots = wrapper.querySelectorAll(".project-snapshot");
  const snapshotCount = snapshots.length;

  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "snapshots-progress-bar";

  for (let i = 0; i < 30; i++) {
    const indicator = document.createElement("div");
    indicator.className = "progress-indicator";
    progressBarContainer.appendChild(indicator);
  }

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBarContainer.appendChild(progressBar);

  snapshotsSection.appendChild(progressBarContainer);

  const calculateDimensions = () => {
    const wrapperWidth = wrapper.offsetWidth;
    const viewportWidth = window.innerWidth;
    return -(wrapperWidth - viewportWidth);
  };

  let moveDistance = calculateDimensions();

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Track last active slide index
  let lastSlideIndex = -1;
  const activeSlideLabel = document.querySelector("#active-slide-label");

  ScrollTrigger.create({
    trigger: ".project-snapshots",
    start: "top top",
    end: () => `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: isSafari && isIOS ? 0.5 : 1,
    invalidateOnRefresh: true,
    onRefresh: () => {
      moveDistance = calculateDimensions();
    },
    onUpdate: (self) => {
      const progress = self.progress;
      const currentTranslateX = progress * moveDistance;

      gsap.set(wrapper, {
        x: currentTranslateX,
        force3D: true,
        transformOrigin: "left center",
      });

      if (progressBar) {
        gsap.set(progressBar, {
          width: `${progress * 100}%`,
        });
      }

      // Dynamic Text Update based on Active Slide
      if (activeSlideLabel && snapshotCount > 0) {
        const currentIndex = Math.round(progress * (snapshotCount - 1));

        if (currentIndex !== lastSlideIndex) {
          const slide = snapshots[currentIndex];
          const img = slide ? slide.querySelector("img") : null;

          if (img) {
            const altText = img.getAttribute("alt");
            if (altText) {
              // Update text content with animation
              activeSlideLabel.textContent = "/ " + altText;
              gsap.fromTo(activeSlideLabel,
                { opacity: 0.4, x: 10 },
                { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
              );
            }
          }
          lastSlideIndex = currentIndex;
        }
      }
    },
  });

  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      moveDistance = calculateDimensions();
      ScrollTrigger.refresh();
    }, 250);
  };

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 500);
  });

  if (isIOS) {
    const setViewportHeight = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", () => {
      setTimeout(setViewportHeight, 500);
    });
  }
}


// Keywords to highlight with colored pills
const keywords = [
  // Project content keywords
  "platform", "nurseries", "donations", "tracking", "coordination", "impact",
  "reporting", "backend", "apis", "seamless", "workflows", "developing",
  "educational", "mini-games", "gamified", "interactive", "quizzes", "challenges",
  "level-based", "progression", "engagement", "3d", "experiences", "immersive",
  "ai-powered", "saas", "contracts", "risks", "clauses", "protective", "pdf",
  "analysis", "secure", "trust-focused", "intelligent", "resumes", "descriptions",
  "automates", "tailoring", "interview", "practice", "capabilities", "streamlines",
  "parsing", "scraping", "simulations", "actionable", "feedback",
  // Tech stack
  "react", "node.js", "unity", "c#", "next.js", "gemini", "python", "openai"
];

const wordHighlightBgColor = "191, 188, 180";

// Color classes for balanced distribution
const colorClasses = ["accent-1", "accent-2", "accent-3"];

// Prepare all anime-text words (split into word elements)
function prepareAnimeTextWords() {
  const animeTextParagraphs = document.querySelectorAll(".anime-text p");
  let keywordIndex = 0; // Track for balanced color distribution

  animeTextParagraphs.forEach((paragraph) => {
    const text = paragraph.textContent;
    const words = text.split(/\s+/);
    paragraph.innerHTML = "";

    let lastWordHighlighted = false;

    words.forEach((word) => {
      if (word.trim()) {
        const wordContainer = document.createElement("div");
        wordContainer.className = "word";

        const wordText = document.createElement("span");
        wordText.textContent = word;

        const normalizedWord = word.toLowerCase().replace(/[.,!?;:"'—-]/g, "");

        // Highlight logic: Check if keyword AND previous word wasn't highlighted
        if (keywords.includes(normalizedWord) && !lastWordHighlighted) {
          wordContainer.classList.add("keyword-wrapper");
          // Assign color class in rotating order (blue, pink, yellow)
          const colorClass = colorClasses[keywordIndex % 3];
          wordText.classList.add("keyword", colorClass);
          keywordIndex++;
          lastWordHighlighted = true;
        } else {
          lastWordHighlighted = false;
        }

        wordContainer.appendChild(wordText);
        paragraph.appendChild(wordContainer);
      }
    });
  });
}

// Initialize ScrollTrigger for a single anime-text container
function initSingleAnimeTextAnimation(container) {
  if (!container) return;

  // Get all anime-text blocks separately
  const animeTextBlocks = container.querySelectorAll(".anime-text");
  const allWords = container.querySelectorAll(".anime-text .word");
  const wordCount = allWords.length;
  const scrollMultiplier = Math.max(4, Math.ceil(wordCount / 10));

  // Get section elements
  const sectionLabels = container.querySelectorAll(".section-label");
  const overviewLabel = sectionLabels[0] || null;
  const stackLabel = sectionLabels[1] || null;
  const sectionDivider = container.querySelector(".section-divider");
  const reviewHeader = container.querySelector(".review-header");
  const reviewFooter = container.querySelector(".review-footer");

  // Calculate word counts per section for timing
  let overviewWordCount = 0;
  let stackWordCount = 0;

  animeTextBlocks.forEach((block, idx) => {
    const blockWords = block.querySelectorAll(".word").length;
    if (block.classList.contains("stack-text")) {
      stackWordCount = blockWords;
    } else if (idx === 0) {
      overviewWordCount = blockWords;
    }
  });

  const totalWords = overviewWordCount + stackWordCount;
  const stackStartProgress = totalWords > 0 ? (overviewWordCount / totalWords) * 0.8 : 0.5;

  // Set initial states
  if (overviewLabel) gsap.set(overviewLabel, { opacity: 0, y: 15 });
  if (stackLabel) gsap.set(stackLabel, { opacity: 0, y: 15 });
  if (sectionDivider) gsap.set(sectionDivider, { opacity: 0, scaleX: 0 });
  if (reviewHeader) gsap.set(reviewHeader, { opacity: 0, y: 15 });
  if (reviewFooter) gsap.set(reviewFooter, { opacity: 0, y: 15 });

  // Track animation states for bidirectional scrolling
  let overviewShown = false;
  let stackShown = false;
  let elementsHidden = false;

  ScrollTrigger.create({
    trigger: container,
    pin: true,
    start: "top top",
    end: `+=${window.innerHeight * scrollMultiplier}`,
    pinSpacing: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const direction = self.direction; // 1 = scroll down, -1 = scroll up
      const wordsArray = Array.from(allWords);
      const totalWordsCount = wordsArray.length;

      // Overview label - show at start
      if (progress > 0.01 && progress < 0.85 && !overviewShown) {
        overviewShown = true;
        if (overviewLabel) {
          gsap.to(overviewLabel, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        }
        if (reviewHeader) {
          gsap.to(reviewHeader, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        }
      }

      // Hide overview label when scrolling back up past start
      if (progress <= 0.01 && overviewShown) {
        overviewShown = false;
        if (overviewLabel) {
          gsap.to(overviewLabel, { opacity: 0, y: 15, duration: 0.3, ease: "power2.in" });
        }
        if (reviewHeader) {
          gsap.to(reviewHeader, { opacity: 0, y: 15, duration: 0.3, ease: "power2.in" });
        }
      }

      // Stack label and divider - show when stack text starts animating
      if (progress > stackStartProgress - 0.05 && progress < 0.85 && !stackShown) {
        stackShown = true;
        if (sectionDivider) {
          gsap.to(sectionDivider, { opacity: 0.15, scaleX: 1, duration: 0.4, ease: "power2.out" });
        }
        if (stackLabel) {
          gsap.to(stackLabel, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power2.out" });
        }
        if (reviewFooter) {
          gsap.to(reviewFooter, { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" });
        }
      }

      // Hide stack elements when scrolling back up
      if (progress <= stackStartProgress - 0.05 && stackShown) {
        stackShown = false;
        if (sectionDivider) {
          gsap.to(sectionDivider, { opacity: 0, scaleX: 0, duration: 0.3, ease: "power2.in" });
        }
        if (stackLabel) {
          gsap.to(stackLabel, { opacity: 0, y: 15, duration: 0.3, ease: "power2.in" });
        }
        if (reviewFooter) {
          gsap.to(reviewFooter, { opacity: 0, y: 15, duration: 0.3, ease: "power2.in" });
        }
      }

      // Hide all elements at end
      if (progress > 0.85 && !elementsHidden) {
        elementsHidden = true;
        const hideTargets = [overviewLabel, stackLabel, sectionDivider, reviewHeader, reviewFooter].filter(Boolean);
        gsap.to(hideTargets, { opacity: 0, y: -10, duration: 0.4, ease: "power2.in" });
      }

      // Show elements again when scrolling back from end
      if (progress <= 0.85 && elementsHidden) {
        elementsHidden = false;
        if (overviewLabel && overviewShown) {
          gsap.to(overviewLabel, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        }
        if (reviewHeader && overviewShown) {
          gsap.to(reviewHeader, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        }
        if (stackLabel && stackShown) {
          gsap.to(stackLabel, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        }
        if (sectionDivider && stackShown) {
          gsap.to(sectionDivider, { opacity: 0.15, scaleX: 1, duration: 0.3, ease: "power2.out" });
        }
        if (reviewFooter && stackShown) {
          gsap.to(reviewFooter, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        }
      }

      wordsArray.forEach((word, index) => {
        const wordText = word.querySelector("span");

        if (progress <= 0.8) {
          const progressTarget = 0.8;
          const revealProgress = Math.min(1, progress / progressTarget);

          const overlapWords = 8;
          const totalAnimationLength = 1 + overlapWords / totalWords;

          const wordStart = index / totalWords;
          const wordEnd = wordStart + overlapWords / totalWords;

          const timelineScale =
            1 /
            Math.min(
              totalAnimationLength,
              1 + (totalWords - 1) / totalWords + overlapWords / totalWords
            );

          const adjustedStart = wordStart * timelineScale;
          const adjustedEnd = wordEnd * timelineScale;
          const duration = adjustedEnd - adjustedStart;

          const wordProgress =
            revealProgress <= adjustedStart
              ? 0
              : revealProgress >= adjustedEnd
                ? 1
                : (revealProgress - adjustedStart) / duration;

          word.style.opacity = wordProgress;

          const backgroundFadeStart =
            wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
          const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
          word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

          const textRevealThreshold = 0.9;
          const textRevealProgress =
            wordProgress >= textRevealThreshold
              ? (wordProgress - textRevealThreshold) /
              (1 - textRevealThreshold)
              : 0;
          wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
        } else {
          const reverseProgress = (progress - 0.8) / 0.2;
          word.style.opacity = 1;
          const targetTextOpacity = 1;

          const reverseOverlapWords = 5;
          const reverseWordStart = index / totalWords;
          const reverseWordEnd =
            reverseWordStart + reverseOverlapWords / totalWords;

          const reverseTimelineScale =
            1 /
            Math.max(
              1,
              (totalWords - 1) / totalWords + reverseOverlapWords / totalWords
            );

          const reverseAdjustedStart =
            reverseWordStart * reverseTimelineScale;
          const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
          const reverseDuration = reverseAdjustedEnd - reverseAdjustedStart;

          const reverseWordProgress =
            reverseProgress <= reverseAdjustedStart
              ? 0
              : reverseProgress >= reverseAdjustedEnd
                ? 1
                : (reverseProgress - reverseAdjustedStart) / reverseDuration;

          if (reverseWordProgress > 0) {
            wordText.style.opacity =
              targetTextOpacity * (1 - reverseWordProgress);
            word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
          } else {
            wordText.style.opacity = targetTextOpacity;
            word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
          }
        }
      });
    },
  });
}