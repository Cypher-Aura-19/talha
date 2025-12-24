import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";
import { lenis } from "./lenis-scroll";

gsap.registerPlugin(ScrollTrigger, SplitText);

initAnimations();

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

const animeTextContainers = document.querySelectorAll(
  ".anime-text-container"
);

animeTextContainers.forEach((container) => {
  ScrollTrigger.create({
    trigger: container,
    pin: container,
    start: "top top",
    end: `+=${window.innerHeight * 4}`,
    pinSpacing: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const words = Array.from(
        container.querySelectorAll(".anime-text .word")
      );
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
              ? (wordProgress - textRevealThreshold) /
              (1 - textRevealThreshold)
              : 0;
          wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
        } else {
          const reverseProgress = (progress - 0.7) / 0.3;
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
});

const animateOnScroll = true;

const config = {
  gravity: { x: 0, y: 1 },
  restitution: 0.5,
  friction: 0.15,
  frictionAir: 0.02,
  density: 0.002,
  wallThickness: 200,
};

let engine,
  runner,
  bodies = [],
  topWall = null,
  mouse = null,
  mouseConstraint = null;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function initPhysics(container) {
  engine = Matter.Engine.create();
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
    Matter.Bodies.rectangle(
      containerRect.width / 2,
      containerRect.height - floorOffset + wallThickness / 2,
      containerRect.width + wallThickness * 2,
      wallThickness,
      { isStatic: true }
    ),
    Matter.Bodies.rectangle(
      -wallThickness / 2,
      containerRect.height / 2,
      wallThickness,
      containerRect.height + wallThickness * 2,
      { isStatic: true }
    ),
    Matter.Bodies.rectangle(
      containerRect.width + wallThickness / 2,
      containerRect.height / 2,
      wallThickness,
      containerRect.height + wallThickness * 2,
      { isStatic: true }
    ),
  ];
  Matter.World.add(engine.world, walls);

  const objects = container.querySelectorAll(".object");
  objects.forEach((obj, index) => {
    const objRect = obj.getBoundingClientRect();

    const startX =
      Math.random() * (containerRect.width - objRect.width) +
      objRect.width / 2;
    const startY = -500 - index * 200;
    const startRotation = (Math.random() - 0.5) * Math.PI;

    const body = Matter.Bodies.rectangle(
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

    Matter.Body.setAngle(body, startRotation);

    bodies.push({
      body: body,
      element: obj,
      width: objRect.width,
      height: objRect.height,
    });

    Matter.World.add(engine.world, body);
  });

  Matter.Events.on(engine, "beforeUpdate", function () {
    bodies.forEach(({ body }) => {
      const maxVelocity = 250;

      if (Math.abs(body.velocity.x) > maxVelocity) {
        Matter.Body.setVelocity(body, {
          x: body.velocity.x > 0 ? maxVelocity : -maxVelocity,
          y: body.velocity.y,
        });
      }
      if (Math.abs(body.velocity.y) > maxVelocity) {
        Matter.Body.setVelocity(body, {
          x: body.velocity.x,
          y: body.velocity.y > 0 ? maxVelocity : -maxVelocity,
        });
      }
    });
  });

  setTimeout(() => {
    topWall = Matter.Bodies.rectangle(
      containerRect.width / 2,
      -wallThickness / 2,
      containerRect.width + wallThickness * 2,
      wallThickness,
      { isStatic: true }
    );
    Matter.World.add(engine.world, topWall);
  }, 3000);

  setInterval(() => {
    if (bodies.length > 0 && Math.random() < 0.3) {
      const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
      const randomForce = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.01,
      };
      Matter.Body.applyForce(
        randomBody.body,
        randomBody.body.position,
        randomForce
      );
    }
  }, 2000);

  runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  mouse = Matter.Mouse.create(container);
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  Matter.World.add(engine.world, mouseConstraint);

  container.addEventListener('touchstart', (e) => {
    if (mouseConstraint.body) {
      e.preventDefault();
    }
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    if (mouseConstraint.body) {
      e.preventDefault();
    }
  }, { passive: false });

  function updatePositions() {
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

    requestAnimationFrame(updatePositions);
  }
  updatePositions();
}

if (animateOnScroll) {
  document.querySelectorAll("section").forEach((section) => {
    if (section.querySelector(".object-container")) {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        once: true,
        onEnter: () => {
          const container = section.querySelector(".object-container");
          if (container && !engine) {
            initPhysics(container);
          }
        },
      });
    }
  });
} else {
  window.addEventListener("load", () => {
    const container = document.querySelector(".object-container");
    if (container) {
      initPhysics(container);
    }
  });
}

// ========== ABOUT SKILLS PIN ==========
ScrollTrigger.create({
  trigger: ".about-skills",
  start: "top top",
  end: `+=${window.innerHeight * 3}px`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
});

// ========== SLIDER SECTION (exact from slider.js) ==========
const slides = [
  {
    title: "1. Discovery: Mapping the Terrain. Understanding the problem space before writing a single line of code.",
    image: "/about/1.png",
  },
  {
    title: "2. Design: Blueprinting the System. Architecting scalable solutions that withstand valid user load.",
    image: "/about/2.png",
  },
  {
    title: "3. Development: Building the Core. Writing clean, efficient, and well-documented code in the quiet of the wild.",
    image: "/about/3.png",
  },
  {
    title: "4. Deployment: Launching the Signal. Pushing to production with automated pipelines and zero downtime.",
    image: "/about/4.png",
  },
  {
    title: "5. Evolution: Iterating the Future. Monitoring, optimizing, and refining the system based on real-world data.",
    image: "/about/5.png",
  },
];

const pinDistance = window.innerHeight * slides.length;
const progressBar = document.querySelector(".slider-progress");
const sliderImages = document.querySelector(".slider-images");
const sliderTitle = document.querySelector(".slider-title");
const sliderIndices = document.querySelector(".slider-indices");

let activeSlide = 0;

function splitTextIntoLines(element) {
  const text = element.textContent;
  const words = text.split(" ");
  element.innerHTML = "";

  const tempDiv = document.createElement("div");
  tempDiv.style.cssText = window.getComputedStyle(element).cssText;
  tempDiv.style.position = "absolute";
  tempDiv.style.visibility = "hidden";
  tempDiv.style.width = window.getComputedStyle(element).width;
  document.body.appendChild(tempDiv);

  let lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    tempDiv.textContent = testLine;

    if (tempDiv.offsetHeight > (lines.length + 1) * parseFloat(getComputedStyle(tempDiv).lineHeight) && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  document.body.removeChild(tempDiv);

  const lineElements = lines.map((line) => {
    const lineWrapper = document.createElement("span");
    lineWrapper.className = "line";
    const lineInner = document.createElement("span");
    lineInner.className = "line-inner";
    lineInner.textContent = line;
    lineWrapper.appendChild(lineInner);
    return lineWrapper;
  });

  lineElements.forEach((el, i) => {
    element.appendChild(el);
    if (i < lineElements.length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });

  return lineElements.map((el) => el.querySelector(".line-inner"));
}

function createIndices() {
  sliderIndices.innerHTML = "";

  slides.forEach((_, index) => {
    const indexNum = (index + 1).toString().padStart(2, "0");
    const indicatorElement = document.createElement("p");
    indicatorElement.dataset.index = index;
    indicatorElement.innerHTML = `<span class="marker"></span><span class="index">${indexNum}</span>`;
    sliderIndices.appendChild(indicatorElement);

    if (index === 0) {
      gsap.set(indicatorElement.querySelector(".index"), { opacity: 1 });
      gsap.set(indicatorElement.querySelector(".marker"), { scaleX: 1 });
    } else {
      gsap.set(indicatorElement.querySelector(".index"), { opacity: 0.35 });
      gsap.set(indicatorElement.querySelector(".marker"), { scaleX: 0 });
    }
  });
}

function animateNewSlide(index) {
  const newSliderImage = document.createElement("img");
  newSliderImage.src = slides[index].image;
  newSliderImage.alt = `Slide ${index + 1}`;

  gsap.set(newSliderImage, { opacity: 0, scale: 1.1 });
  sliderImages.appendChild(newSliderImage);

  gsap.to(newSliderImage, { opacity: 1, duration: 0.5, ease: "power2.out" });
  gsap.to(newSliderImage, { scale: 1, duration: 1, ease: "power2.out" });

  const allImages = sliderImages.querySelectorAll("img");
  if (allImages.length > 3) {
    const removeCount = allImages.length - 3;
    for (let i = 0; i < removeCount; i++) {
      sliderImages.removeChild(allImages[i]);
    }
  }

  animateNewTitle(index);
  animateIndicators(index);
}

function animateIndicators(index) {
  const indicators = sliderIndices.querySelectorAll("p");

  indicators.forEach((indicator, i) => {
    const markerElement = indicator.querySelector(".marker");
    const indexElement = indicator.querySelector(".index");

    if (i === index) {
      gsap.to(indexElement, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(markerElement, { scaleX: 1, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(indexElement, { opacity: 0.5, duration: 0.3, ease: "power2.out" });
      gsap.to(markerElement, { scaleX: 0, duration: 0.3, ease: "power2.out" });
    }
  });
}

function animateNewTitle(index) {
  sliderTitle.innerHTML = `<h1>${slides[index].title}</h1>`;
  const h1 = sliderTitle.querySelector("h1");
  const lines = splitTextIntoLines(h1);

  gsap.set(lines, { yPercent: 100, opacity: 0 });
  gsap.to(lines, {
    yPercent: 0,
    opacity: 1,
    duration: 0.75,
    stagger: 0.1,
    ease: "power3.out",
  });
}

createIndices();

ScrollTrigger.create({
  trigger: ".slider",
  start: "top top",
  end: `+=${pinDistance}px`,
  scrub: 1,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => {
    gsap.set(progressBar, { scaleY: self.progress });

    const currentSlide = Math.floor(self.progress * slides.length);

    if (activeSlide !== currentSlide && currentSlide < slides.length) {
      activeSlide = currentSlide;
      animateNewSlide(activeSlide);
    }
  },
});

const outroHeader = document.querySelector(".outro h3");
let outroSplit = null;

if (outroHeader) {
  outroSplit = SplitText.create(outroHeader, {
    type: "words",
    wordsClass: "outro-word",
  });

  gsap.set(outroSplit.words, { opacity: 0 });
}

const outroStrips = document.querySelectorAll(".outro-strip");
const stripSpeeds = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

ScrollTrigger.create({
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

ScrollTrigger.create({
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
