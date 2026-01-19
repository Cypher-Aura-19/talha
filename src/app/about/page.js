'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function About() {
  useEffect(() => {
    console.log('[About Page] Component mounted');
    
    let cleanup = null;
    let eventListenerAdded = false;
    let scriptsLoaded = false;
    
    // Load scripts after component mounts
    const loadScripts = async () => {
      // Prevent double loading
      if (scriptsLoaded) {
        console.log('[About Page] Scripts already loaded, skipping');
        return () => {};
      }
      
      try {
        console.log('[About Page] Loading scripts...');
        scriptsLoaded = true;
        
        // Load Matter.js first (needed by about.js)
        if (typeof window !== 'undefined' && !window.Matter) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
          });
          console.log('[About Page] Matter.js loaded');
        } else {
          console.log('[About Page] Matter.js already loaded');
        }
        
        // Load and initialize Lenis (only if not already loaded)
        if (!window.lenis) {
          const lenisModule = await import('@/lib/scripts/lenis-scroll.js');
          lenisModule.initLenis();
          console.log('[About Page] Lenis loaded and initialized');
        } else {
          console.log('[About Page] Lenis already loaded');
        }
        
        // Load and initialize about module
        const aboutModule = await import('@/lib/scripts/about.js');
        console.log('[About Page] About module loaded');
        
        // Always initialize about (it handles its own cleanup)
        aboutModule.initAbout();
        window.aboutInitialized = true;
        console.log('[About Page] About initialized');
        
        // Return cleanup function
        return () => {
          console.log('[About Page] Cleanup function called');
          if (aboutModule.cleanupAbout) {
            aboutModule.cleanupAbout();
          }
          window.aboutInitialized = false;
          scriptsLoaded = false;
        };
      } catch (error) {
        console.error('[About Page] Error loading scripts:', error);
        scriptsLoaded = false;
        return () => {};
      }
    };

    // ALWAYS wait for transition to complete
    console.log('[About Page] Waiting for transition to complete');
    
    // Handler for transition complete event
    const handleTransitionComplete = async () => {
      console.log('[About Page] Transition complete event received, loading scripts');
      cleanup = await loadScripts();
    };

    // Listen for the transition complete event
    window.addEventListener('pageTransitionComplete', handleTransitionComplete, { once: true });
    eventListenerAdded = true;

    // Fallback: if event doesn't fire within 500ms, load anyway
    const fallbackTimer = setTimeout(async () => {
      console.log('[About Page] Fallback: loading scripts after timeout');
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      cleanup = await loadScripts();
    }, 500);

    return () => {
      console.log('[About Page] Component unmounting');
      clearTimeout(fallbackTimer);
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      if (cleanup && typeof cleanup === 'function') {
        console.log('[About Page] Calling cleanup');
        cleanup();
      }
    };
  }, []);

  return (
    <>
      <section className="about-hero">
        <div className="about-hero-img">
          <img src="/about/hero.webp" alt="" />
        </div>
        <div className="container">
          <div className="about-header">
            <h2 data-animate-type="line-reveal" data-animate-delay="0.25">
              The Operator at the Edge
            </h2>
          </div>
        </div>
      </section>

      <section className="anime-text-container">
        <div className="home-spotlight-top-bar">
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
        <div className="home-spotlight-bottom-bar">
          <div className="container">
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.2" data-animate-on-scroll="true">
              <span>&#9654;</span> Dossier Loaded
            </p>
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.25" data-animate-on-scroll="true">
              / Readme.md
            </p>
          </div>
        </div>
        <div className="container">
          <div className="copy-container">
            <div className="anime-text">
              <p>
                Welcome to the outpost. Here, high bandwidth meets high
                altitude. This is where systems are forged to survive
                the storm. Built for function, designed for the wild.
              </p>
              <p>
                I'm Talha. I trade city noise for clear signals. Designing
                with the rhythm of nature, building with the precision of
                a machine. Everything here is field-tested and deployed
                with intent.
              </p>
              <p>
                Operating from the edge gives me perspective. While the
                industry chases trends, I focus on the signal. No
                distractions, just pure code and the horizon. My
                workspace isn't an office; it's a command center for
                digital exploration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-skills">
        <div className="container">
          <div className="about-skills-col">
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-light.png" alt="Symbol" />
              </div>
              <div className="symbol">
                <img src="/symbols/s2-light.png" alt="Symbol" />
              </div>
            </div>
            <div className="about-skills-copy-wrapper">
              <div className="about-skills-callout">
                <p className="mono" data-animate-type="scramble" data-animate-delay="0.2" data-animate-on-scroll="true">
                  <span>&#9654;</span> Gravity works here too
                </p>
              </div>
              <div className="about-skills-header">
                <h3 data-animate-type="line-reveal" data-animate-delay="0.4" data-animate-on-scroll="true">
                  Arsenal for the Digital Wild
                </h3>
              </div>
            </div>
          </div>
          <div className="about-skills-col skills-playground">
            <div className="object-container">
              <div className="object os-1">
                <p className="mono">React.js</p>
              </div>
              <div className="object os-2">
                <p className="mono">Next.js</p>
              </div>
              <div className="object os-3">
                <p className="mono">Node.js</p>
              </div>
              <div className="object os-1">
                <p className="mono">Python Flask</p>
              </div>
              <div className="object os-2">
                <p className="mono">TypeScript</p>
              </div>
              <div className="object os-3">
                <p className="mono">Tailwind</p>
              </div>
              <div className="object os-1">
                <p className="mono">GSAP</p>
              </div>
              <div className="object os-2">
                <p className="mono">MongoDB</p>
              </div>
              <div className="object os-3">
                <p className="mono">MySQL</p>
              </div>
              <div className="object os-1">
                <p className="mono">Three.js</p>
              </div>
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
              <p className="mono">Frontend</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">UX</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Vibe Check</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Clean Code</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Creative Flow</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Pixel Logic</p>
            </div>
          </div>
          <div className="outro-strip os-2">
            <div className="skill skill-var-2">
              <p className="mono">Motion</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Taste</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Grid Game</p>
            </div>
          </div>
          <div className="outro-strip os-3">
            <div className="skill skill-var-2">
              <p className="mono">Details</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Islamabad</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Builds</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Case Studies</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Scroll Love</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Easings</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">HTML Mindset</p>
            </div>
          </div>
          <div className="outro-strip os-4">
            <div className="skill skill-var-1">
              <p className="mono">Type Systems</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Keyframes</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Component Life</p>
            </div>
          </div>
          <div className="outro-strip os-5">
            <div className="skill skill-var-1">
              <p className="mono">Side Projects</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Studio Vibes</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">GSAP Fanboy</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">No Filler</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Live Sites</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">FAST NUCES</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Launch Ready</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">CodegridPRO</p>
            </div>
          </div>
          <div className="outro-strip os-6">
            <div className="skill skill-var-3">
              <p className="mono">UI Nerd</p>
            </div>
            <div className="skill skill-var-1">
              <p className="mono">Quietly Bold</p>
            </div>
            <div className="skill skill-var-2">
              <p className="mono">Shipped</p>
            </div>
            <div className="skill skill-var-3">
              <p className="mono">Real CSS</p>
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
                    <img src="/global/footer-right-arrow.webp" alt="" />
                  </button>
                </div>
              </div>
            </div>
            <div className="footer-col"></div>
          </div>
          <div className="footer-bottom">
            <div className="footer-col">
              <div className="footer-logo">
                <img src="/global/logo.webp" alt="" />
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
    </>
  );
}
