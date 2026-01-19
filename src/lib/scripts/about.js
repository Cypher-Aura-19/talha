import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations, cleanupAnimations } from "./anime";

// Store all instances for cleanup
let splitInstances = [];
let scrollTriggers = [];
let engine = null;
let runner = null;
let bodies = [];
let topWall = null;
let mouse = null;
let mouseConstraint = null;
let physicsInitialized = false;
let randomForceInterval = null;

// Export cleanup function
export function cleanupAbout() {
  if (typeof window === 'undefined') return;
  
  console.log('[About Cleanup] Starting cleanup...');
  
  try {
    // Clear random force interval
    if (randomForceInterval) {
      clearInterval(randomForceInterval);
      randomForceInterval = null;
    }
    
    // Cleanup Matter.js physics
    if (engine && window.Matter) {
      console.log('[About Cleanup] Cleaning up Matter.js');
      
      if (runner) {
        window.Matter.Runner.stop(runner);
        runner = null;
      }
      
      if (mouseConstraint) {
        window.Matter.World.remove(engine.world, mouseConstraint);
        mouseConstraint = null;
      }
      
      if (mouse) {
        mouse = null;
      }
      
      window.Matter.World.clear(engine.world);
      window.Matter.Engine.clear(engine);
      engine = null;
      bodies = [];
      topWall = null;
      physicsInitialized = false;
    }
    
    // Kill all ScrollTriggers
    console.log('[About Cleanup] Killing ScrollTriggers:', scrollTriggers.length);
    scrollTriggers.forEach((st, index) => {
      try {
        if (st && st.kill) {
          st.kill();
        }
      } catch (e) {
        console.error(`[About Cleanup] Error killing ScrollTrigger ${index}:`, e);
      }
    });
    scrollTriggers = [];
    
    // Revert all SplitText instances
    console.log('[About Cleanup] Reverting SplitText instances:', splitInstances.length);
    splitInstances.forEach((split, index) => {
      try {
        if (split && split.revert) {
          // Check if the element still exists in the DOM
          if (split.element && document.body.contains(split.element)) {
            console.log(`[About Cleanup] Reverting SplitText ${index}`, split.element);
            split.revert();
          } else {
            console.log(`[About Cleanup] Skipping SplitText ${index} - element not in DOM`);
          }
        }
      } catch (e) {
        console.error(`[About Cleanup] Error reverting SplitText ${index}:`, e);
      }
    });
    splitInstances = [];
    
    // Cleanup text animations
    console.log('[About Cleanup] Cleaning up text animations');
    try {
      cleanupAnimations();
    } catch (e) {
      console.error('[About Cleanup] Error cleaning animations:', e);
    }
    
    // Kill all GSAP animations
    console.log('[About Cleanup] Killing all GSAP tweens');
    try {
      gsap.killTweensOf("*");
    } catch (e) {
      console.error('[About Cleanup] Error killing tweens:', e);
    }
    
    // Clear all ScrollTriggers globally
    console.log('[About Cleanup] Clearing all ScrollTriggers globally');
    try {
      ScrollTrigger.getAll().forEach((st) => {
        st.kill();
      });
    } catch (e) {
      console.error('[About Cleanup] Error clearing ScrollTriggers:', e);
    }
    
    console.log('[About Cleanup] Cleanup complete');
  } catch (error) {
    console.error('[About Cleanup] Fatal error during cleanup:', error);
  }
}

// Export init function
export function initAbout() {
  if (typeof window === 'undefined') return;
  
  console.log('[About Init] Starting initialization...');
  
  // Cleanup any existing instances first
  cleanupAbout();
  
  gsap.registerPlugin(ScrollTrigger, SplitText);
  
  // Initialize text animations (including hero text - it will animate after transition)
  initAnimations();

  // ========== ANIME TEXT SECTION ==========
  const animeTextParagraphs = document.querySelectorAll(".anime-text p");
  const wordHighlightBgColor = "191, 188, 180";

  const keywords = [
    "outpost",
    "bandwidth",
    "altitude",
    "systems",
    "storm",
    "signals",
    "rhythm",
    "nature",
    "machine",
    "precision",
    "field-tested",
    "perspective",
    "horizon",
    "command",
    "exploration",
  ];

  animeTextParagraphs.forEach((paragraph) => {
    const text = paragraph.textContent;
    const words = text.split(/\s+/);
    paragraph.innerHTML = "";

    words.forEach((word) => {
      if (word.trim()) {
        const wordContainer = document.createElement("div");
        wordContainer.className = "word";

        const wordText = document.createElement("span");
        wordText.textContent = word;

        const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
        if (keywords.includes(normalizedWord)) {
          wordContainer.classList.add("keyword-wrapper");
          wordText.classList.add("keyword", normalizedWord);
        }

        wordContainer.appendChild(wordText);
        paragraph.appendChild(wordContainer);
      }
    });
  });

  const animeTextContainers = document.querySelectorAll(".anime-text-container");

  animeTextContainers.forEach((container) => {
    const st = ScrollTrigger.create({
      trigger: container,
      pin: container,
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const words = Array.from(container.querySelectorAll(".anime-text .word"));
        const totalWords = words.length;

        words.forEach((word, index) => {
          const wordText = word.querySelector("span");

          if (progress <= 0.7) {
            const progressTarget = 0.7;
            const revealProgress = Math.min(1, progress / progressTarget);

            const overlapWords = 15;
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
                ? (wordProgress - textRevealThreshold) / (1 - textRevealThreshold)
                : 0;
            wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
          } else {
            const reverseProgress = (progress - 0.7) / 0.3;
            word.style.opacity = 1;
            const targetTextOpacity = 1;

            const reverseOverlapWords = 5;
            const reverseWordStart = index / totalWords;
            const reverseWordEnd = reverseWordStart + reverseOverlapWords / totalWords;

            const reverseTimelineScale =
              1 /
              Math.max(
                1,
                (totalWords - 1) / totalWords + reverseOverlapWords / totalWords
              );

            const reverseAdjustedStart = reverseWordStart * reverseTimelineScale;
            const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
            const reverseDuration = reverseAdjustedEnd - reverseAdjustedStart;

            const reverseWordProgress =
              reverseProgress <= reverseAdjustedStart
                ? 0
                : reverseProgress >= reverseAdjustedEnd
                  ? 1
                  : (reverseProgress - reverseAdjustedStart) / reverseDuration;

            if (reverseWordProgress > 0) {
              wordText.style.opacity = targetTextOpacity * (1 - reverseWordProgress);
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
            } else {
              wordText.style.opacity = targetTextOpacity;
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
            }
          }
        });
      },
    });
    scrollTriggers.push(st);
  });

  // ========== MATTER.JS PHYSICS ==========
  const animateOnScroll = true;

  const config = {
    gravity: { x: 0, y: 1 },
    restitution: 0.5,
    friction: 0.15,
    frictionAir: 0.02,
    density: 0.002,
    wallThickness: 200,
  };

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function initPhysics(container) {
    if (physicsInitialized || !window.Matter) {
      console.log('[About Init] Physics already initialized or Matter.js not loaded');
      return;
    }
    
    physicsInitialized = true;
    console.log('[About Init] Initializing Matter.js physics');
    
    engine = window.Matter.Engine.create();
    engine.gravity = config.gravity;

    engine.constraintIterations = 15;
    engine.positionIterations = 25;
    engine.velocityIterations = 20;

    engine.enableSleeping = true;
    engine.timing.timeScale = 1;

    const containerRect = container.getBoundingClientRect();
    const wallThickness = config.wallThickness;
    const floorOffset = 8;

    const walls = [
      window.Matter.Bodies.rectangle(
        containerRect.width / 2,
        containerRect.height - floorOffset + wallThickness / 2,
        containerRect.width + wallThickness * 2,
        wallThickness,
        { isStatic: true }
      ),
      window.Matter.Bodies.rectangle(
        -wallThickness / 2,
        containerRect.height / 2,
        wallThickness,
        containerRect.height + wallThickness * 2,
        { isStatic: true }
      ),
      window.Matter.Bodies.rectangle(
        containerRect.width + wallThickness / 2,
        containerRect.height / 2,
        wallThickness,
        containerRect.height + wallThickness * 2,
        { isStatic: true }
      ),
    ];
    window.Matter.World.add(engine.world, walls);

    const objects = container.querySelectorAll(".object");
    objects.forEach((obj, index) => {
      const objRect = obj.getBoundingClientRect();

      const startX =
        Math.random() * (containerRect.width - objRect.width) + objRect.width / 2;
      const startY = -500 - index * 200;
      const startRotation = (Math.random() - 0.5) * Math.PI;

      const body = window.Matter.Bodies.rectangle(
        startX,
        startY,
        objRect.width,
        objRect.height,
        {
          restitution: config.restitution,
          friction: config.friction,
          frictionAir: config.frictionAir,
          density: config.density,
          chamfer: { radius: 10 },
          slop: 0.02,
        }
      );

      window.Matter.Body.setAngle(body, startRotation);

      bodies.push({
        body: body,
        element: obj,
        width: objRect.width,
        height: objRect.height,
      });

      window.Matter.World.add(engine.world, body);
    });

    window.Matter.Events.on(engine, "beforeUpdate", function () {
      bodies.forEach(({ body }) => {
        const maxVelocity = 250;

        if (Math.abs(body.velocity.x) > maxVelocity) {
          window.Matter.Body.setVelocity(body, {
            x: body.velocity.x > 0 ? maxVelocity : -maxVelocity,
            y: body.velocity.y,
          });
        }
        if (Math.abs(body.velocity.y) > maxVelocity) {
          window.Matter.Body.setVelocity(body, {
            x: body.velocity.x,
            y: body.velocity.y > 0 ? maxVelocity : -maxVelocity,
          });
        }
      });
    });

    setTimeout(() => {
      if (engine) {
        topWall = window.Matter.Bodies.rectangle(
          containerRect.width / 2,
          -wallThickness / 2,
          containerRect.width + wallThickness * 2,
          wallThickness,
          { isStatic: true }
        );
        window.Matter.World.add(engine.world, topWall);
      }
    }, 3000);

    randomForceInterval = setInterval(() => {
      if (bodies.length > 0 && Math.random() < 0.3 && engine) {
        const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
        const randomForce = {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.01,
        };
        window.Matter.Body.applyForce(
          randomBody.body,
          randomBody.body.position,
          randomForce
        );
      }
    }, 2000);

    runner = window.Matter.Runner.create();
    window.Matter.Runner.run(runner, engine);

    mouse = window.Matter.Mouse.create(container);
    mouseConstraint = window.Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    window.Matter.World.add(engine.world, mouseConstraint);

    container.addEventListener('touchstart', (e) => {
      if (mouseConstraint && mouseConstraint.body) {
        e.preventDefault();
      }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
      if (mouseConstraint && mouseConstraint.body) {
        e.preventDefault();
      }
    }, { passive: false });

    function updatePositions() {
      if (!engine) return; // Stop if engine was cleaned up
      
      bodies.forEach(({ body, element, width, height }) => {
        const x = clamp(
          body.position.x - width / 2,
          0,
          containerRect.width - width
        );
        const y = clamp(
          body.position.y - height / 2,
          -height * 3,
          containerRect.height - height - floorOffset
        );

        element.style.left = x + "px";
        element.style.top = y + "px";
        element.style.transform = `rotate(${body.angle}rad)`;
      });

      if (engine) {
        requestAnimationFrame(updatePositions);
      }
    }
    updatePositions();
  }

  if (animateOnScroll) {
    document.querySelectorAll("section").forEach((section) => {
      if (section.querySelector(".object-container")) {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          once: true,
          onEnter: () => {
            const container = section.querySelector(".object-container");
            if (container && !physicsInitialized) {
              initPhysics(container);
            }
          },
        });
        scrollTriggers.push(st);
      }
    });
  }

  // ========== ABOUT SKILLS PIN ==========
  const skillsPin = ScrollTrigger.create({
    trigger: ".about-skills",
    start: "top top",
    end: `+=${window.innerHeight * 1.5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
  });
  scrollTriggers.push(skillsPin);

  // ========== OUTRO SECTION ==========
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
    scrub: 1,
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
    scrub: 1,
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
  
  console.log('[About Init] Initialization complete');
}
