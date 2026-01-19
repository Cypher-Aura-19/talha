import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Export init function for Next.js
export function initStory() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const scrollTriggers = [];
  const splitInstances = [];

  // ========== HERO ==========
  const heroImg = document.querySelector(".hero-img img");
  if (!heroImg) return; // Safety check

  const heroImages = ["/story/hero/1.png", "/story/hero/2.png", "/story/hero/3.png", "/story/hero/4.png", "/story/hero/5.png", "/story/hero/6.png", "/story/hero/7.png", "/story/hero/8.png", "/story/hero/9.png", "/story/hero/10.png"];
  let currentImageIndex = 0;
  let heroScrollTriggerInstance = null;
  let heroImageInterval = null;

  if (heroImg) {
    heroImageInterval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
      heroImg.src = heroImages[currentImageIndex];
    }, 800);
  }

  const initHeroAnimations = () => {
    if (heroScrollTriggerInstance) heroScrollTriggerInstance.kill();
    const heroImgHolder = document.querySelector(".hero-img-holder");
    if (!heroImgHolder) return;
    
    heroScrollTriggerInstance = ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(".hero-img", { y: `${-110 + 110 * progress}%`, scale: 0.25 + 0.75 * progress, rotation: -15 + 15 * progress });
      },
    });
  };
  initHeroAnimations();
  window.addEventListener("resize", initHeroAnimations);

  // ========== FEATURED WORK ==========
  let featuredScrollTriggerInstance = null;
  const featuredImages = ["/story/1.png", "/story/2.png", "/story/3.png", "/story/4.png", "/story/5.png", "/story/6.png", "/story/7.png", "/story/8.png", "/story/9.png", "/story/10.png"];

  const initFeaturedAnimations = () => {
    if (window.innerWidth <= 1000) {
      if (featuredScrollTriggerInstance) { featuredScrollTriggerInstance.kill(); featuredScrollTriggerInstance = null; }
      return;
    }
    if (featuredScrollTriggerInstance) featuredScrollTriggerInstance.kill();

    const indicatorContainer = document.querySelector(".featured-work-indicator");
    if (!indicatorContainer) return;
    
    indicatorContainer.innerHTML = "";
    for (let section = 1; section <= 5; section++) {
      const sectionNumber = document.createElement("p");
      sectionNumber.className = "mono";
      sectionNumber.textContent = `0${section}`;
      indicatorContainer.appendChild(sectionNumber);
      for (let i = 0; i < 10; i++) {
        const indicator = document.createElement("div");
        indicator.className = "indicator";
        indicatorContainer.appendChild(indicator);
      }
    }

    const featuredCardPosSmall = [
      { y: 100, x: 1000 }, { y: 1500, x: 100 }, { y: 1250, x: 1950 }, { y: 1500, x: 850 }, { y: 200, x: 2100 },
      { y: 250, x: 600 }, { y: 1100, x: 1650 }, { y: 1000, x: 800 }, { y: 900, x: 2200 }, { y: 150, x: 1600 },
    ];
    const featuredCardPosLarge = [
      { y: 800, x: 5000 }, { y: 2000, x: 3000 }, { y: 240, x: 4450 }, { y: 1200, x: 3450 }, { y: 500, x: 2200 },
      { y: 750, x: 1100 }, { y: 1850, x: 3350 }, { y: 2200, x: 1300 }, { y: 3000, x: 1950 }, { y: 500, x: 4500 },
    ];
    const featuredCardPos = window.innerWidth >= 1600 ? featuredCardPosLarge : featuredCardPosSmall;
    const featuredTitles = document.querySelector(".featured-titles");
    if (!featuredTitles) return;
    
    const moveDistance = window.innerWidth * 4;
    const imagesContainer = document.querySelector(".featured-images");
    if (!imagesContainer) return;
    
    imagesContainer.innerHTML = "";

    for (let i = 0; i < 10; i++) {
      const featuredImgCard = document.createElement("div");
      featuredImgCard.className = `featured-img-card featured-img-card-${i + 1}`;
      const img = document.createElement("img");
      img.src = featuredImages[i];
      img.alt = `featured work image ${i + 1}`;
      featuredImgCard.appendChild(img);
      gsap.set(featuredImgCard, { x: featuredCardPos[i].x, y: featuredCardPos[i].y });
      imagesContainer.appendChild(featuredImgCard);
    }

    const featuredImgCards = document.querySelectorAll(".featured-img-card");
    featuredImgCards.forEach((card) => { gsap.set(card, { z: -1500, scale: 0 }); });

    featuredScrollTriggerInstance = ScrollTrigger.create({
      trigger: ".featured-work",
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(featuredTitles, { x: -moveDistance * self.progress });
        featuredImgCards.forEach((card, index) => {
          const staggerOffset = index * 0.075;
          const scaledProgress = (self.progress - staggerOffset) * 2;
          const individualProgress = Math.max(0, Math.min(1, scaledProgress));
          const newZ = -1500 + 3000 * individualProgress;
          const scale = Math.max(0, Math.min(1, Math.min(1, individualProgress * 10)));
          gsap.set(card, { z: newZ, scale: scale });
        });
        const indicators = document.querySelectorAll(".indicator");
        const progressPerIndicator = 1 / indicators.length;
        indicators.forEach((indicator, index) => {
          gsap.to(indicator, { opacity: self.progress > index * progressPerIndicator ? 1 : 0.2, duration: 0.3 });
        });
      },
    });
  };
  initFeaturedAnimations();
  window.addEventListener("resize", initFeaturedAnimations);

  // ========== SERVICES (Card Stacking) ==========
  let servicesScrollTriggerInstances = [];

  const initServicesAnimations = () => {
    servicesScrollTriggerInstances.forEach((instance) => { if (instance) instance.kill(); });
    servicesScrollTriggerInstances = [];
    if (window.innerWidth <= 1000) return;

    const services = gsap.utils.toArray(".service-card");

    services.forEach((service, index) => {
      const isLastServiceCard = index === services.length - 1;
      const serviceCardInner = service.querySelector(".service-card-inner");

      if (!isLastServiceCard && serviceCardInner) {
        const pinTrigger = ScrollTrigger.create({
          trigger: service,
          start: "top 45%",
          endTrigger: services[services.length - 1],
          end: "top 50%",
          pin: true,
          pinSpacing: false,
        });
        servicesScrollTriggerInstances.push(pinTrigger);

        const scrollAnimation = gsap.to(serviceCardInner, {
          y: `-${(services.length - index) * 12}vh`,
          ease: "none",
          scrollTrigger: { trigger: service, start: "top 45%", endTrigger: services[services.length - 1], end: "top 50%", scrub: true },
        });
        servicesScrollTriggerInstances.push(scrollAnimation.scrollTrigger);
      }
    });
  };
  initServicesAnimations();
  window.addEventListener("resize", initServicesAnimations);

  // ========== OUTRO SECTION ==========
  const outroHeader = document.querySelector(".story-outro h3");
  let outroSplit = null;

  if (outroHeader) {
    outroSplit = SplitText.create(outroHeader, {
      type: "words",
      wordsClass: "outro-word",
    });
    splitInstances.push(outroSplit);

    gsap.set(outroSplit.words, { opacity: 0 });
  }

  const outroStrips = document.querySelectorAll(".story-outro .outro-strip");
  const stripSpeeds = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

  const outroPin = ScrollTrigger.create({
    trigger: ".story-outro",
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
    trigger: ".story-outro",
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

  console.log('[Story Init] Initialization complete');
}

export function cleanupStory() {
  // Cleanup function if needed
  console.log('[Story Cleanup] Cleaning up');
}