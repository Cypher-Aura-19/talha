'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    console.log('[Home Page] Component mounted');
    
    let cleanup = null;
    let eventListenerAdded = false;
    let scriptsLoaded = false;
    
    // Load scripts after component mounts
    const loadScripts = async () => {
      // Prevent double loading
      if (scriptsLoaded) {
        console.log('[Home Page] Scripts already loaded, skipping');
        return () => {};
      }
      
      try {
        console.log('[Home Page] Loading scripts...');
        scriptsLoaded = true;
        
        // Load and initialize Lenis (only if not already loaded)
        if (!window.lenis) {
          const lenisModule = await import('@/lib/scripts/lenis-scroll.js');
          lenisModule.initLenis();
          console.log('[Home Page] Lenis loaded and initialized');
        } else {
          console.log('[Home Page] Lenis already loaded');
        }
        
        // Load and initialize menu (only if not already initialized)
        const menuElement = document.querySelector('.menu');
        const menuInitialized = menuElement && menuElement.dataset.initialized === 'true';
        
        if (!menuInitialized) {
          await import('@/lib/scripts/menu.js').then(mod => {
            mod.initMenuScript();
            if (menuElement) {
              menuElement.dataset.initialized = 'true';
            }
            console.log('[Home Page] Menu initialized');
          });
        } else {
          console.log('[Home Page] Menu already initialized');
        }
        
        // Load and initialize home module
        const homeModule = await import('@/lib/scripts/home.js');
        console.log('[Home Page] Home module loaded');
        
        // Always initialize home (it handles its own cleanup)
        homeModule.initHome();
        window.homeInitialized = true;
        console.log('[Home Page] Home initialized');
        
        // Return cleanup function
        return () => {
          console.log('[Home Page] Cleanup function called');
          if (homeModule.cleanupHome) {
            homeModule.cleanupHome();
          }
          window.homeInitialized = false;
          scriptsLoaded = false;
        };
      } catch (error) {
        console.error('[Home Page] Error loading scripts:', error);
        scriptsLoaded = false;
        return () => {};
      }
    };

    // ALWAYS wait for transition to complete, regardless of how we got here
    // This ensures consistent behavior whether it's initial load or navigation
    console.log('[Home Page] Waiting for transition to complete');
    
    // Handler for transition complete event
    const handleTransitionComplete = async () => {
      console.log('[Home Page] Transition complete event received, loading scripts');
      
      // Reset hero animations flag so text doesn't re-animate
      window.heroAnimationsPlayed = false;
      
      cleanup = await loadScripts();
    };

    // Listen for the transition complete event
    window.addEventListener('pageTransitionComplete', handleTransitionComplete, { once: true });
    eventListenerAdded = true;

    // Fallback: if event doesn't fire within 3 seconds, load anyway
    const fallbackTimer = setTimeout(async () => {
      console.log('[Home Page] Fallback: loading scripts after timeout');
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      
      // Reset hero animations flag
      window.heroAnimationsPlayed = false;
      
      cleanup = await loadScripts();
    }, 3000);

    return () => {
      console.log('[Home Page] Component unmounting');
      clearTimeout(fallbackTimer);
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      if (cleanup && typeof cleanup === 'function') {
        console.log('[Home Page] Calling cleanup');
        cleanup();
      }
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="home-services-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-dark.png" alt="Symbol" />
              </div>
            </div>
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-dark.png" alt="Symbol" />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-header">
              <h1 data-animate-type="reveal" data-animate-delay="0.25">
                Talha Rizwan
              </h1>
            </div>
            <div className="hero-footer">
              <div className="hero-footer-copy">
                <p className="md" data-animate-type="line-reveal" data-animate-delay="0.25">
                  Building digital ecosystems from a cabin in the clouds. Remote
                  operations, high-altitude code, and pixel-perfect signal
                  transmission.
                </p>
              </div>
              <div className="hero-footer-tags">
                <p className="mono" data-animate-type="scramble" data-animate-delay="0.5">
                  <span>&#9654;</span> Remote Operative
                </p>
                <p className="mono" data-animate-type="scramble" data-animate-delay="0.5">
                  <span>&#9654;</span> Base: Faroe
                </p>
              </div>
            </div>
          </div>
          <div className="hero-cards">
            <div className="card" id="hero-card-1">
              <div className="hero-card-inner">
                <div className="card-bg-img"><img src="/cards/1.webp" alt="Plan" priority="high" /></div>
                <div className="card-title">
                  <p className="mono">Scout</p>
                  <p className="mono">01</p>
                </div>
                <div className="card-title">
                  <p className="mono">01</p>
                  <p className="mono">Scout</p>
                </div>
              </div>
            </div>
            <div className="card" id="hero-card-2">
              <div className="hero-card-inner">
                <div className="card-bg-img"><img src="/cards/2.webp" alt="Design" priority="high" /></div>
                <div className="card-title">
                  <p className="mono">Map</p>
                  <p className="mono">02</p>
                </div>
                <div className="card-title">
                  <p className="mono">02</p>
                  <p className="mono">Map</p>
                </div>
              </div>
            </div>
            <div className="card" id="hero-card-3">
              <div className="hero-card-inner">
                <div className="card-bg-img"><img src="/cards/3.webp" alt="Develop" priority="high" /></div>
                <div className="card-title">
                  <p className="mono">Build</p>
                  <p className="mono">03</p>
                </div>
                <div className="card-title">
                  <p className="mono">03</p>
                  <p className="mono">Build</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-about">
        <div className="home-about-preview">
          {/* Pre-load all preview images, toggle visibility via CSS */}
          <img className="preview-img" data-for="1" src="/home/wideskill-1.webp" alt="" />
          <img className="preview-img" data-for="2" src="/home/wideskill-2.webp" alt="" />
          <img className="preview-img" data-for="3" src="/home/wideskill-3.webp" alt="" />
          <img className="preview-img" data-for="4" src="/home/wideskill-4.webp" alt="" />
          <div className="home-about-preview-overlay"></div>
        </div>
        <div className="container">
          <div className="home-about-col">
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s2-light.png" alt="Symbol" />
              </div>
            </div>
            <div className="home-about-header">
              <p className="mono" data-animate-type="scramble" data-animate-delay="0.2" data-animate-on-scroll="true">
                <span>&#9654;</span> Survival Gear
              </p>
              <h3 data-animate-type="line-reveal" data-animate-delay="0.2" data-animate-on-scroll="true">
                Tools sharpened for the digital frontier
              </h3>
            </div>
          </div>
          <div className="home-about-col">
            <div className="home-about-col-row">
              <div className="home-about-card" data-preview="1">
                <div className="home-about-card-bg"><img src="/home/skill-1.webp" alt="Frontend in Iceland" loading="lazy" />
                </div>
                <p className="mono" data-animate-type="scramble" data-animate-delay="0.2" data-animate-on-scroll="true">
                  [ Sector 01 ]
                </p>
                <h4 data-animate-type="line-reveal" data-animate-delay="0.2" data-animate-on-scroll="true">
                  Frontend
                </h4>
              </div>
              <div className="home-about-card" data-preview="2">
                <div className="home-about-card-bg"><img src="/home/skill-2.webp" alt="Backend in Iceland" loading="lazy" />
                </div>
                <p className="mono" data-animate-type="scramble" data-animate-delay="0.25" data-animate-on-scroll="true">
                  [ Sector 02 ]
                </p>
                <h4 data-animate-type="line-reveal" data-animate-delay="0.25" data-animate-on-scroll="true">
                  Backend
                </h4>
              </div>
            </div>
            <div className="home-about-col-row">
              <div className="home-about-card" data-preview="3">
                <div className="home-about-card-bg"><img src="/home/skill-3.webp" alt="UI/UX in Iceland" loading="lazy" /></div>
                <p className="mono" data-animate-type="scramble" data-animate-delay="0.3" data-animate-on-scroll="true">
                  [ Sector 03 ]
                </p>
                <h4 data-animate-type="line-reveal" data-animate-delay="0.3" data-animate-on-scroll="true">
                  UI/UX
                </h4>
              </div>
              <div className="home-about-card" data-preview="4">
                <div className="home-about-card-bg"><img src="/home/skill-4.webp" alt="DevOps in Iceland" loading="lazy" /></div>
                <p className="mono" data-animate-type="scramble" data-animate-delay="0.35" data-animate-on-scroll="true">
                  [ Sector 04 ]
                </p>
                <h4 data-animate-type="line-reveal" data-animate-delay="0.35" data-animate-on-scroll="true">
                  DevOps
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-services">
        <div className="container">
          <div className="home-services-header">
            <p className="md">Equipped for heavy weather and tight deadlines</p>
          </div>
        </div>
        <div className="home-services-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-dark.png" alt="Symbol" />
              </div>
              <div className="symbol">
                <img src="/symbols/s3-dark.png" alt="Symbol" />
              </div>
            </div>
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s3-dark.png" alt="Symbol" />
              </div>
              <div className="symbol">
                <img src="/symbols/s1-dark.png" alt="Symbol" />
              </div>
            </div>
          </div>
        </div>
        <div className="home-services-bottom-bar">
          <div className="container">
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.2" data-animate-on-scroll="true">
              <span>&#9654;</span> Field-tested Systems
            </p>
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.25" data-animate-on-scroll="true">
              [ Uptime: 100% ]
            </p>
          </div>
        </div>
        <div className="cards">
          <div className="cards-container">
            <div className="card" id="card-1">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-bg-img"><img src="/cards/1.webp" alt="Plan" loading="lazy" /></div>
                    <div className="card-title">
                      <p className="mono">Scout</p>
                      <p className="mono">01</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">01</p>
                      <p className="mono">Scout</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <p className="mono">Scout</p>
                      <p className="mono">01</p>
                    </div>
                    <div className="card-copy">
                      <p>Observartion</p>
                      <p>Terrain Mapping</p>
                      <p>User Recon</p>
                      <p>Data Gathering</p>
                      <p>Route Planning</p>
                      <p>Strategy</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">01</p>
                      <p className="mono">Scout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card" id="card-2">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-bg-img"><img src="/cards/2.webp" alt="Design" loading="lazy" /></div>
                    <div className="card-title">
                      <p className="mono">Map</p>
                      <p className="mono">02</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">02</p>
                      <p className="mono">Map</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <p className="mono">Map</p>
                      <p className="mono">02</p>
                    </div>
                    <div className="card-copy">
                      <p>Blueprints</p>
                      <p>Topography</p>
                      <p>Prototypes</p>
                      <p>Signal Flow</p>
                      <p>Systems</p>
                      <p>Visual Log</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">02</p>
                      <p className="mono">Map</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card" id="card-3">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-bg-img"><img src="/cards/3.webp" alt="Develop" loading="lazy" /></div>
                    <div className="card-title">
                      <p className="mono">Build</p>
                      <p className="mono">03</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">03</p>
                      <p className="mono">Build</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <p className="mono">Build</p>
                      <p className="mono">03</p>
                    </div>
                    <div className="card-copy">
                      <p>React/Next.js</p>
                      <p>Architecture</p>
                      <p>Hardened Code</p>
                      <p>Uptime</p>
                      <p>Testing</p>
                      <p>Launch</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">03</p>
                      <p className="mono">Build</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-spotlight">
        <div className="home-spotlight-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-light.png" alt="Symbol" loading="lazy" decoding="async" />
              </div>
              <div className="symbol">
                <img src="/symbols/s2-light.png" alt="Symbol" loading="lazy" decoding="async" />
              </div>
              <div className="symbol">
                <img src="/symbols/s3-light.png" alt="Symbol" loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s3-light.png" alt="Symbol" loading="lazy" decoding="async" />
              </div>
              <div className="symbol">
                <img src="/symbols/s2-light.png" alt="Symbol" loading="lazy" decoding="async" />
              </div>
              <div className="symbol">
                <img src="/symbols/s1-light.png" alt="Symbol" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
        <div className="home-spotlight-bottom-bar">
          <div className="container">
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.2" data-animate-on-scroll="true">
              <span>&#9654;</span> Field Reports
            </p>
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.25" data-animate-on-scroll="true">
              / Visual Logs
            </p>
          </div>
        </div>
        <div className="container">
          <div className="spotlight-intro-header">
            <h3 data-animate-type="line-reveal" data-animate-delay="0.3" data-animate-on-scroll="true">
              Signals from the Summit
            </h3>
          </div>
        </div>
        <div className="home-spotlight-images">
          <div className="home-spotlight-images-row">
            <div className="home-spotlight-image"></div>
            <div className="home-spotlight-image image-holder">
              <img src="/home/1.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="home-spotlight-image"></div>
            <div className="home-spotlight-image image-holder">
              <img src="/home/2.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="home-spotlight-images-row">
            <div className="home-spotlight-image image-holder">
              <img src="/home/3.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="home-spotlight-image"></div>
            <div className="home-spotlight-image"></div>
            <div className="home-spotlight-image"></div>
          </div>
          <div className="home-spotlight-images-row">
            <div className="home-spotlight-image"></div>
            <div className="home-spotlight-image image-holder">
              <img src="/home/4.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="home-spotlight-image image-holder">
              <img src="/home/5.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="home-spotlight-image"></div>
          </div>
          <div className="home-spotlight-images-row">
            <div className="home-spotlight-image"></div>
            <div className="home-spotlight-image image-holder">
              <img src="/home/6.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="home-spotlight-image"></div>
            <div className="home-spotlight-image image-holder">
              <img src="/home/7.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="home-spotlight-images-row">
            <div className="home-spotlight-image image-holder">
              <img src="/home/8.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="home-spotlight-image"></div>
            <div className="home-spotlight-image image-holder">
              <img src="/home/9.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="home-spotlight-image"></div>
          </div>
        </div>
        <div className="spotlight-mask-image-container">
          <div className="spotlight-mask-image">
            <img src="/home/hero.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="container">
            <div className="spotlight-mask-header">
              <h3>Built This Face<br />with Flexbox</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="outro">
        <div className="container">
          <h3>Transmission Ends. Link Still Active.</h3>
        </div>
        <div className="outro-strips">
          <div className="outro-strip os-1">
            <div className="skill skill-var-1">
              <p className="mono">React.js</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Next.js</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Node.js</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">TypeScript</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Python Flask</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Tailwind</p>
            </div>
          </div>
          <div className="outro-strip os-2">
            <div className="skill skill-var-2">
              <p className="mono">GSAP</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Lenis</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Three.js</p>
            </div>
          </div>
          <div className="outro-strip os-3">
            <div className="skill skill-var-2">
              <p className="mono">MongoDB</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">MySQL</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">REST APIs</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Docker</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Git</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">CI/CD</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Agile</p>
            </div>
          </div>
          <div className="outro-strip os-4">
            <div className="skill skill-var-1">
              <p className="mono">Figma</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">UI/UX</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Responsive</p>
            </div>
          </div>
          <div className="outro-strip os-5">
            <div className="skill skill-var-1">
              <p className="mono">Full Stack</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">SQA</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Cypress</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Unit Testing</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Stripe</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Islamabad</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">FAST NUCES</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Galvan AI</p>
            </div>
          </div>
          <div className="outro-strip os-6">
            <div className="skill skill-var-3">
              <p className="mono">Angular</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Spring Boot</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Unity</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">C#</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
