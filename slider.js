gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const slides = [
  {
    title:
      "Under the soft hum of streetlights she watches the world ripple through glass, her calm expression mirrored in the fragments of drifting light.",
    image: "/slider_img_1.jpg",
  },
  {
    title:
      "A car slices through the desert, shadow chasing the wind as clouds of dust rise behind, blurring the horizon into gold and thunder.",
    image: "/slider_img_2.jpg",
  },
  {
    title:
      "Reflections ripple across mirrored faces, each one a fragment of identity, caught between defiance, doubt, and the silence of thought.",
    image: "/slider_img_3.jpg",
  },
  {
    title:
      "Soft light spills through the café windows as morning settles into wood and metal, capturing the rhythm of quiet human routine.",
    image: "/slider_img_4.jpg",
  },
  {
    title:
      "Every serve becomes a battle between focus and instinct, movement flowing like rhythm as the court blurs beneath the sunlight.",
    image: "/slider_img_5.jpg",
  },
  {
    title:
      "Amber light spills over the stage as guitars cry into smoke and shadow, where music and motion merge into pure energy.",
    image: "/slider_img_6.jpg",
  },
  {
    title:
      "Dust erupts beneath his stride as sweat glints under floodlights, every step pushing closer to victory, grit, and pure determination.",
    image: "/slider_img_7.jpg",
  },
];

const pinDistance = window.innerHeight * slides.length;
const progressBar = document.querySelector(".slider-progress");
const sliderImages = document.querySelector(".slider-images");
const sliderTitle = document.querySelector(".slider-title");
const sliderIndices = document.querySelector(".slider-indices");

let activeSlide = 0;

// Custom split text function to replace SplitText plugin
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

  words.forEach((word, i) => {
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
