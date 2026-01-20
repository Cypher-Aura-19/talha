"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Page() {
  const containerRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroImgElementRef = useRef(null);
  const heroMaskRef = useRef(null);
  const heroGridOverlayRef = useRef(null);
  const heroHeadingRef = useRef(null);
  const marker1Ref = useRef(null);
  const marker2Ref = useRef(null);
  const marker3Ref = useRef(null);
  const marker4Ref = useRef(null);
  const marker5Ref = useRef(null);
  const marker6Ref = useRef(null);
  const marker7Ref = useRef(null);
  const marker8Ref = useRef(null);
  const cardOverlayRef = useRef(null);
  const cardRef = useRef(null);
  const cardCloseRef = useRef(null);
  const cardImageRef = useRef(null);
  const cardImageElRef = useRef(null);
  const cardLabelRef = useRef(null);
  const cardTitleRef = useRef(null);
  const cardDescRef = useRef(null);
  const heroContentRef = useRef(null);
  const progressBarRef = useRef(null);
  const outroHeaderRef = useRef(null);
  const instructionRef = useRef(null);

  useGSAP(
    () => {
      const heroContent = heroContentRef.current;
      const heroImg = heroImgRef.current;
      const heroImgElement = heroImgElementRef.current;
      const heroMask = heroMaskRef.current;
      const heroGridOverlay = heroGridOverlayRef.current;
      const heroHeading = heroHeadingRef.current;
      const marker1 = marker1Ref.current;
      const marker2 = marker2Ref.current;
      const marker3 = marker3Ref.current;
      const marker4 = marker4Ref.current;
      const marker5 = marker5Ref.current;
      const marker6 = marker6Ref.current;
      const marker7 = marker7Ref.current;
      const marker8 = marker8Ref.current;
      const progressBar = progressBarRef.current;
      const cardOverlay = cardOverlayRef.current;
      const card = cardRef.current;
      const cardClose = cardCloseRef.current;
      const cardImage = cardImageRef.current;
      const cardImageEl = cardImageElRef.current;
      const cardLabel = cardLabelRef.current;
      const cardTitle = cardTitleRef.current;
      const cardDesc = cardDescRef.current;

      // Location data
      const locations = {
        1: { label: "Code Review Peak", title: "Cabin Desk", desc: "Reviewing code with a view. Where pull requests meet mountain peaks. Every line scrutinized with the precision of a climber checking their gear.", image: "/story/1.png" },
        2: { label: "Namaz Point", title: "Epic Ledge", desc: "Five times a day, the prayer mat comes out. Facing the peaks in namaz, finding clarity before complex algorithms. Where faith meets focus.", image: "/story/2.png" },
        3: { label: "Barça Fan Zone", title: "Match Day Passion", desc: "Cheering for Barça from the mountains. Where blaugrana colors meet nature's peaks. Every goal celebrated, every match watched with the dedication of a true culé.", image: "/story/3.png" },
        4: { label: "Code Base Camp", title: "Forest Laptop", desc: "The foundation of all operations. Where projects begin and ideas take root. Surrounded by nature, building digital forests.", image: "/story/4.png" },
        5: { label: "API Testing", title: "Server Rack", desc: "Testing endpoints at altitude. Where APIs are stress-tested against the elements. Every request validated, every response verified.", image: "/story/5.png" },
        6: { label: "Problem Solving Peak", title: "Lodge Balcony", desc: "The highest point of clarity. Where complex problems become simple solutions. Perspective changes everything at this altitude.", image: "/story/6.png" },
        7: { label: "Night Coding", title: "Aurora Cabin", desc: "Coding under the northern lights. Where the aurora illuminates late-night debugging sessions. Magic happens when the world sleeps.", image: "/story/7.png" },
        8: { label: "Code Planning", title: "River Notebook", desc: "Planning by the river. Where architecture flows like water. Every system designed with the patience of a flowing stream.", image: "/story/8.png" }
      };

      // ========== HERO HEADING ANIMATION ==========
      // Animate hero heading immediately after page transition - NO DELAY
      if (heroHeading) {
        const heroHeadingSplit = SplitText.create(heroHeading, {
          type: "words",
          mask: "words"
        });

        gsap.set(heroHeadingSplit.words, { yPercent: 120 });

        // Listen for page transition complete
        const animateHeroHeading = () => {
          gsap.to(heroHeadingSplit.words, {
            yPercent: 0,
            duration: 0.5,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 0
          });
        };

        // Check if transition already completed
        if (window.pageTransitionComplete) {
          animateHeroHeading();
        } else {
          window.addEventListener('pageTransitionComplete', animateHeroHeading, { once: true });
        }
      }

      // Function to open card - Slow, smooth, cinematic animation
      const openCard = (locationId) => {
        const location = locations[locationId];
        
        // Set content immediately
        cardLabel.textContent = `▶ ${location.label}`;
        cardTitle.textContent = location.title;
        cardDesc.textContent = location.desc;
        cardImageEl.src = location.image;

        // Show overlay
        gsap.set(cardOverlay, { display: 'flex' });
        
        // Set initial states - card starts small and hidden
        gsap.set(cardOverlay, { 
          opacity: 0,
          force3D: true
        });
        
        gsap.set(card, { 
          scale: 0.85,
          opacity: 0,
          y: 40,
          force3D: true
        });
        
        gsap.set(cardImage, { 
          opacity: 0,
          scale: 1.15,
          y: 20,
          force3D: true
        });
        
        gsap.set(cardLabel, { 
          opacity: 0,
          x: -30,
          force3D: true
        });
        
        gsap.set(cardTitle, { 
          opacity: 0,
          y: 30,
          force3D: true
        });
        
        gsap.set(cardDesc, { 
          opacity: 0,
          y: 30,
          force3D: true
        });

        // Create slow, smooth timeline
        const tl = gsap.timeline();

        // 1. Overlay fades in slowly
        tl.to(cardOverlay, {
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut',
          force3D: true
        }, 0)
        
        // 2. Card gracefully scales and fades in
        .to(card, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          force3D: true
        }, 0.2)
        
        // 3. Image zooms in smoothly
        .to(cardImage, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          force3D: true
        }, 0.5)
        
        // 4. Label slides in from left
        .to(cardLabel, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          force3D: true
        }, 0.9)
        
        // 5. Title rises up
        .to(cardTitle, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          force3D: true
        }, 1.1)
        
        // 6. Description fades in last
        .to(cardDesc, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          force3D: true
        }, 1.3);
      };

      // Function to close card - Slow, smooth reverse animation
      const closeCard = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(cardOverlay, { display: 'none' });
          }
        });

        // Reverse the opening animation - smooth and slow
        tl.to([cardDesc, cardTitle, cardLabel], {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.in',
          force3D: true
        }, 0)
        .to(cardImage, {
          opacity: 0,
          scale: 1.1,
          duration: 0.6,
          ease: 'power2.in',
          force3D: true
        }, 0.2)
        .to(card, {
          scale: 0.9,
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power2.in',
          force3D: true
        }, 0.4)
        .to(cardOverlay, {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.in',
          force3D: true
        }, 0.6);
      };

      // Add click handlers to markers
      marker1.style.cursor = 'pointer';
      marker2.style.cursor = 'pointer';
      marker3.style.cursor = 'pointer';
      marker4.style.cursor = 'pointer';
      marker5.style.cursor = 'pointer';
      marker6.style.cursor = 'pointer';
      marker7.style.cursor = 'pointer';
      marker8.style.cursor = 'pointer';

      marker1.addEventListener('click', () => openCard(1));
      marker2.addEventListener('click', () => openCard(2));
      marker3.addEventListener('click', () => openCard(3));
      marker4.addEventListener('click', () => openCard(4));
      marker5.addEventListener('click', () => openCard(5));
      marker6.addEventListener('click', () => openCard(6));
      marker7.addEventListener('click', () => openCard(7));
      marker8.addEventListener('click', () => openCard(8));

      cardClose.addEventListener('click', closeCard);
      cardOverlay.addEventListener('click', (e) => {
        if (e.target === cardOverlay) closeCard();
      });

      const heroContentHeight = heroContent.offsetHeight;
      const viewportHeight = window.innerHeight;
      const heroContentMovedistance = heroContentHeight - viewportHeight;

      const heroImgHeight = heroImg.offsetHeight;
      const heroImgMovedistance = heroImgHeight - viewportHeight;

      const ease = (x) => x * x * (3 - 2 * x);
      const instruction = instructionRef.current;

      // Set initial state for instruction
      if (instruction) {
        gsap.set(instruction, { opacity: 0, y: 10 });
      }

      ScrollTrigger.create({
        trigger: ".story-hero",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(progressBar, {
            "--progress": self.progress,
          });

          // Show instruction when map section appears (around 50-75% progress)
          if (instruction) {
            if (self.progress >= 0.5 && self.progress <= 0.75) {
              gsap.to(instruction, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
              });
            } else {
              // Instant disappear when exiting section
              gsap.to(instruction, {
                opacity: 0,
                y: 10,
                duration: 0.1,
                ease: 'power1.in'
              });
            }
          }

          gsap.set(heroContent, {
            y: -self.progress * heroContentMovedistance,
          });

          let heroImgProgress;
          if (self.progress <= 0.45) {
            heroImgProgress = ease(self.progress / 0.45) * 0.65;
          } else if (self.progress <= 0.75) {
            heroImgProgress = 0.65;
          } else {
            heroImgProgress = 0.65 + ease((self.progress - 0.75) / 0.25) * 0.35;
          }

          gsap.set(heroImg, {
            y: heroImgProgress * heroImgMovedistance,
          });

          let heroMaskScale;
          let heroImgSaturation;
          let heroImgOverlayOpacity;

          if (self.progress <= 0.4) {
            heroMaskScale = 2.5;
            heroImgSaturation = 1;
            heroImgOverlayOpacity = 0.35;
          } else if (self.progress <= 0.5) {
            const phaseProgress = ease((self.progress - 0.4) / 0.1);
            heroMaskScale = 2.5 - phaseProgress * 1.5;
            heroImgSaturation = 1 - phaseProgress;
            heroImgOverlayOpacity = 0.35 + phaseProgress * 0.35;
          } else if (self.progress <= 0.75) {
            heroMaskScale = 1;
            heroImgSaturation = 0;
            heroImgOverlayOpacity = 0.7;
          } else if (self.progress <= 0.85) {
            const phaseProgress = ease((self.progress - 0.75) / 0.1);
            heroMaskScale = 1 + phaseProgress * 1.5;
            heroImgSaturation = phaseProgress;
            heroImgOverlayOpacity = 0.7 - phaseProgress * 0.35;
          } else {
            heroMaskScale = 2.5;
            heroImgSaturation = 1;
            heroImgOverlayOpacity = 0.35;
          }

          gsap.set(heroMask, {
            scale: heroMaskScale,
          });

          gsap.set(heroImgElement, {
            filter: `saturate(${heroImgSaturation})`,
          });

          gsap.set(heroImg, {
            "--overlay-opacity": heroImgOverlayOpacity,
          });

          let heroGridOpacity;
          if (self.progress <= 0.475) {
            heroGridOpacity = 0;
          } else if (self.progress <= 0.5) {
            heroGridOpacity = ease((self.progress - 0.475) / 0.025);
          } else if (self.progress <= 0.75) {
            heroGridOpacity = 1;
          } else if (self.progress <= 0.775) {
            heroGridOpacity = 1 - ease((self.progress - 0.75) / 0.025);
          } else {
            heroGridOpacity = 0;
          }

          gsap.set(heroGridOverlay, {
            opacity: heroGridOpacity,
          });

          let marker1Opacity;
          if (self.progress <= 0.5) {
            marker1Opacity = 0;
          } else if (self.progress <= 0.525) {
            marker1Opacity = ease((self.progress - 0.5) / 0.025);
          } else if (self.progress <= 0.7) {
            marker1Opacity = 1;
          } else if (self.progress <= 0.75) {
            marker1Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            marker1Opacity = 0;
          }

          gsap.set(marker1, {
            opacity: marker1Opacity,
          });

          let marker2Opacity;
          if (self.progress <= 0.55) {
            marker2Opacity = 0;
          } else if (self.progress <= 0.575) {
            marker2Opacity = ease((self.progress - 0.55) / 0.025);
          } else if (self.progress <= 0.7) {
            marker2Opacity = 1;
          } else if (self.progress <= 0.75) {
            marker2Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            marker2Opacity = 0;
          }

          gsap.set(marker2, {
            opacity: marker2Opacity,
          });

          let marker3Opacity;
          if (self.progress <= 0.5) {
            marker3Opacity = 0;
          } else if (self.progress <= 0.525) {
            marker3Opacity = ease((self.progress - 0.5) / 0.025);
          } else if (self.progress <= 0.7) {
            marker3Opacity = 1;
          } else if (self.progress <= 0.75) {
            marker3Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            marker3Opacity = 0;
          }

          gsap.set(marker3, {
            opacity: marker3Opacity,
          });

          let marker4Opacity;
          if (self.progress <= 0.48) {
            marker4Opacity = 0;
          } else if (self.progress <= 0.505) {
            marker4Opacity = ease((self.progress - 0.48) / 0.025);
          } else if (self.progress <= 0.7) {
            marker4Opacity = 1;
          } else if (self.progress <= 0.75) {
            marker4Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            marker4Opacity = 0;
          }

          gsap.set(marker4, {
            opacity: marker4Opacity,
          });

          let marker5Opacity;
          if (self.progress <= 0.52) {
            marker5Opacity = 0;
          } else if (self.progress <= 0.545) {
            marker5Opacity = ease((self.progress - 0.52) / 0.025);
          } else if (self.progress <= 0.7) {
            marker5Opacity = 1;
          } else if (self.progress <= 0.75) {
            marker5Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            marker5Opacity = 0;
          }

          gsap.set(marker5, {
            opacity: marker5Opacity,
          });

          let marker6Opacity;
          if (self.progress <= 0.53) {
            marker6Opacity = 0;
          } else if (self.progress <= 0.555) {
            marker6Opacity = ease((self.progress - 0.53) / 0.025);
          } else if (self.progress <= 0.7) {
            marker6Opacity = 1;
          } else if (self.progress <= 0.75) {
            marker6Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            marker6Opacity = 0;
          }

          gsap.set(marker6, {
            opacity: marker6Opacity,
          });

          let marker7Opacity;
          if (self.progress <= 0.54) {
            marker7Opacity = 0;
          } else if (self.progress <= 0.565) {
            marker7Opacity = ease((self.progress - 0.54) / 0.025);
          } else if (self.progress <= 0.7) {
            marker7Opacity = 1;
          } else if (self.progress <= 0.75) {
            marker7Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            marker7Opacity = 0;
          }

          gsap.set(marker7, {
            opacity: marker7Opacity,
          });

          let marker8Opacity;
          if (self.progress <= 0.56) {
            marker8Opacity = 0;
          } else if (self.progress <= 0.585) {
            marker8Opacity = ease((self.progress - 0.56) / 0.025);
          } else if (self.progress <= 0.7) {
            marker8Opacity = 1;
          } else if (self.progress <= 0.75) {
            marker8Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            marker8Opacity = 0;
          }

          gsap.set(marker8, {
            opacity: marker8Opacity,
          });
        },
      });

      // ========== OUTRO ANIMATION ==========
      const outroHeader = outroHeaderRef.current;
      let outroSplit = null;

      if (outroHeader) {
        outroSplit = SplitText.create(outroHeader, {
          type: "words",
          mask: "words",
        });

        gsap.set(outroSplit.words, { yPercent: 120 });
      }

      const outroStrips = document.querySelectorAll(".story-outro .outro-strip");
      const stripSpeeds = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

      ScrollTrigger.create({
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
                  gsap.set(word, { yPercent: 0 });
                } else {
                  gsap.set(word, { yPercent: 120 });
                }
              });
            } else if (progress < 0.25) {
              gsap.set(outroSplit.words, { yPercent: 120 });
            } else if (progress > 0.75) {
              gsap.set(outroSplit.words, { yPercent: 0 });
            }
          }
        },
      });

      ScrollTrigger.create({
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
    },
    { scope: containerRef }
  );

  return (
    <>
      <ReactLenis root />
      <div ref={containerRef} className="story-page">
        <section className="story-hero">
          <div className="story-hero-img" ref={heroImgRef}>
            <img ref={heroImgElementRef} src="/story/hero.webp" alt="Story hero background" />
          </div>

          <div className="story-hero-mask" ref={heroMaskRef}></div>

          <div className="story-hero-grid-overlay" ref={heroGridOverlayRef}>
            <Image src="/grid-overlay.svg" alt="Grid overlay" fill style={{ objectFit: 'contain' }} />
          </div>

          <div className="story-marker story-marker-1" ref={marker1Ref}>
            <span className="story-marker-icon"></span>
            <p className="story-marker-label">Code Review Peak</p>
          </div>

          <div className="story-marker story-marker-2" ref={marker2Ref}>
            <span className="story-marker-icon"></span>
            <p className="story-marker-label">Namaz Point</p>
          </div>

          <div className="story-marker story-marker-3" ref={marker3Ref}>
            <span className="story-marker-icon"></span>
            <p className="story-marker-label">Barça Fan Zone</p>
          </div>

          <div className="story-marker story-marker-4" ref={marker4Ref}>
            <span className="story-marker-icon"></span>
            <p className="story-marker-label">Code Base Camp</p>
          </div>

          <div className="story-marker story-marker-5" ref={marker5Ref}>
            <span className="story-marker-icon"></span>
            <p className="story-marker-label">API Testing</p>
          </div>

          <div className="story-marker story-marker-6" ref={marker6Ref}>
            <span className="story-marker-icon"></span>
            <p className="story-marker-label">Problem Solving Peak</p>
          </div>

          <div className="story-marker story-marker-7" ref={marker7Ref}>
            <span className="story-marker-icon"></span>
            <p className="story-marker-label">Night Coding</p>
          </div>

          <div className="story-marker story-marker-8" ref={marker8Ref}>
            <span className="story-marker-icon"></span>
            <p className="story-marker-label">Code Planning</p>
          </div>

          <div className="story-hero-content" ref={heroContentRef}>
            <div className="story-hero-content-block">
              <div className="story-hero-content-copy">
                <h1 ref={heroHeadingRef}>Off The Grid</h1>
              </div>
            </div>
            <div className="story-hero-content-block">
              <div className="story-hero-content-copy">
                <p className="mono story-label"><span>&#9654;</span> 01 / Remote Operations</p>
                <h2>Remote Operations</h2>
                <p className="md">
                  Operating from the mountains. Where altitude meets latitude. 
                  Building digital products from nature's command center.
                </p>
              </div>
            </div>
            <div className="story-hero-content-block">
              <div className="story-hero-content-copy">
                <p className="mono story-label"><span>&#9654;</span> 02 / Signal & Silence</p>
                <h2>Signal & Silence</h2>
                <p className="md">
                  Trading city chaos for mountain clarity. Shipping production code 
                  where the air is thin and focus is sharp. Remote work, redefined.
                </p>
              </div>
            </div>
            <div className="story-hero-content-block">
              <div className="story-hero-content-copy">
                <p className="mono story-label"><span>&#9654;</span> 03 / Field Tested</p>
                <h2>Field Tested</h2>
                <p className="md">
                  Every project built with precision. Systems designed to survive. 
                  Code deployed from the edge where ideas run wild.
                </p>
              </div>
            </div>
          </div>

          <div className="story-hero-scroll-progress-bar" ref={progressBarRef}></div>
          
          {/* Instruction Tooltip */}
          <div className="story-instruction" ref={instructionRef}>
            Click location points to explore
          </div>

          {/* Location Card Modal */}
          <div className="location-card-overlay" ref={cardOverlayRef}>
            <div className="location-card" ref={cardRef}>
              <button className="location-card-close" ref={cardCloseRef}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="location-card-image" ref={cardImageRef}>
                <img src="/story/1.webp" alt="Location" ref={cardImageElRef} />
              </div>
              <div className="location-card-content">
                <p className="mono location-card-label" ref={cardLabelRef}></p>
                <h3 ref={cardTitleRef}></h3>
                <p className="md" ref={cardDescRef}></p>
                <div className="location-card-status">Active</div>
                <div className="location-card-coordinates">
                  <p>Coordinates</p>
                  <h4>35.8765° N, 75.1234° E</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="story-outro">
          <div className="container">
            <h3 ref={outroHeaderRef}>Transmission Ends. Link Still Active.</h3>
          </div>
          <div className="outro-strips">
            <div className="outro-strip os-1">
              <div className="skill skill-var-1">
                <p className="mono">Remote Work</p>
              </div>
              <div className="skill skill-var-2">
                <p className="mono">Mountain Code</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Off Grid</p>
              </div>
              <div className="skill skill-var-1">
                <p className="mono">Field Tested</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Signal Strong</p>
              </div>
              <div className="skill skill-var-1">
                <p className="mono">Peak Station</p>
              </div>
            </div>
            <div className="outro-strip os-2">
              <div className="skill skill-var-2">
                <p className="mono">Base Camp</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Altitude</p>
              </div>
              <div className="skill skill-var-1">
                <p className="mono">Operations</p>
              </div>
            </div>
            <div className="outro-strip os-3">
              <div className="skill skill-var-2">
                <p className="mono">Deployed</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Islamabad</p>
              </div>
              <div className="skill skill-var-1">
                <p className="mono">Systems</p>
              </div>
              <div className="skill skill-var-2">
                <p className="mono">Network</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Coordinates</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Active</p>
              </div>
              <div className="skill skill-var-1">
                <p className="mono">Command</p>
              </div>
            </div>
            <div className="outro-strip os-4">
              <div className="skill skill-var-1">
                <p className="mono">Ridge Point</p>
              </div>
              <div className="skill skill-var-2">
                <p className="mono">Summit HQ</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Trail Node</p>
              </div>
            </div>
            <div className="outro-strip os-5">
              <div className="skill skill-var-1">
                <p className="mono">Valley Base</p>
              </div>
              <div className="skill skill-var-2">
                <p className="mono">Edge Node</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Forward Base</p>
              </div>
              <div className="skill skill-var-1">
                <p className="mono">Mobile</p>
              </div>
              <div className="skill skill-var-2">
                <p className="mono">Relay</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">FAST NUCES</p>
              </div>
              <div className="skill skill-var-1">
                <p className="mono">Production</p>
              </div>
              <div className="skill skill-var-2">
                <p className="mono">CodegridPRO</p>
              </div>
            </div>
            <div className="outro-strip os-6">
              <div className="skill skill-var-3">
                <p className="mono">Uplink</p>
              </div>
              <div className="skill skill-var-1">
                <p className="mono">Precision</p>
              </div>
              <div className="skill skill-var-2">
                <p className="mono">Shipped</p>
              </div>
              <div className="skill skill-var-3">
                <p className="mono">Live</p>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="container">
            <div className="footer-top">
              <div className="footer-col">
                <p className="mono"><span>&#9654;</span> Initialize Encrypted Connection</p>
                <div className="footer-email-container">
                  <div className="footer-email-row">
                    <input type="text" placeholder="your@email.com" />
                    <button>
                      <Image src="/global/footer-right-arrow.webp" alt="Submit" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="footer-col"></div>
            </div>
            <div className="footer-bottom">
              <div className="footer-col">
                <div className="footer-logo">
                  <Image src="/global/logo.webp" alt="Logo" width={120} height={40} />
                </div>
              </div>
              <div className="footer-col">
                <div className="footer-sub-col">
                  <p className="mono">Explore</p>
                  <div className="footer-links">
                    <p><Link href="/">Home Base</Link></p>
                    <p><Link href="/about">The Operator</Link></p>
                    <p><Link href="/work">Mission Logs</Link></p>
                    <p><Link href="/story">Off The Grid</Link></p>
                    <p><Link href="/contact">Establish Uplink</Link></p>
                  </div>
                </div>
                <div className="footer-sub-col">
                  <p className="mono">Connect</p>
                  <div className="footer-copy">
                    <p>Base: Faroe Islands</p>
                    <p>work.talharizwan@gmail.com</p>
                    <br />
                    <p>LinkedIn</p>
                    <p>GitHub</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-copyright">
              <div className="footer-col">
                <p className="mono">MWT July 2025</p>
              </div>
              <div className="footer-col">
                <div className="footer-sub-col">
                  <p className="mono">Made by Talha Rizwan</p>
                </div>
                <div className="footer-sub-col">
                  <p className="mono">&copy; 2025 All Rights Reserved</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

