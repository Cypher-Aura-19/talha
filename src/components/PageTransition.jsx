"use client";

import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import Logo from "./Logo";

const PageTransition = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const logoRef = useRef(null);
  const blocksRef = useRef([]);
  const isTransitioning = useRef(false);
  const pathLengthRef = useRef(0);
  const revealTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const contentRef = useRef(null);

  const preloadPageImages = useCallback((targetPath) => {
    const pageImages = {
      '/work': [
        '/work/1.webp',
        '/work/2.webp',
        '/work/3.webp',
        '/work/4.webp'
      ],
      '/about': [
        '/about/hero.webp'
      ],
      '/story': [
        '/story/hero.webp',
        '/story/1.png',
        '/story/2.png',
        '/story/3.png',
        '/story/4.png',
        '/story/5.png',
        '/story/6.png',
        '/story/7.png',
        '/story/8.png'
      ]
    };

    const imagesToLoad = pageImages[targetPath] || [];
    
    if (imagesToLoad.length === 0) {
      return Promise.resolve();
    }

    console.log(`[PageTransition] Preloading ${imagesToLoad.length} images for ${targetPath}`);

    const promises = imagesToLoad.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log(`[PageTransition] Loaded: ${url}`);
          resolve(url);
        };
        img.onerror = () => {
          console.warn(`[PageTransition] Failed to load: ${url}`);
          resolve(url);
        };
        img.src = url;
      });
    });

    return Promise.all(promises);
  }, []);

  const handleRouteChange = useCallback(async (url) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    
    console.log('[PageTransition] Starting navigation to:', url);
    
    // CRITICAL: Close menu FIRST with smooth animation
    let menuClosePromise = Promise.resolve();
    if (typeof window !== "undefined") {
      menuClosePromise = import("@/lib/scripts/menu")
        .then((mod) => {
          if (mod?.closeMenuOnNavigate) {
            console.log('[PageTransition] Starting smooth menu close');
            mod.closeMenuOnNavigate();
            // Give menu time to animate (700ms for overlay close)
            return new Promise(resolve => setTimeout(resolve, 300));
          }
        })
        .catch(() => {});
    }
    
    // CRITICAL: Cleanup work page event listeners IMMEDIATELY if we're on work page
    if (pathname === '/work') {
      try {
        const workModule = await import("@/lib/scripts/work");
        if (workModule?.cleanupWork) {
          console.log('[PageTransition] Immediately cleaning up work page listeners');
          workModule.cleanupWork();
        }
      } catch (e) {
        console.error('[PageTransition] Error cleaning up work:', e);
      }
    }
    
    // Preload images while menu is closing (parallel operation)
    const imagePreloadPromise = preloadPageImages(url);
    
    // Wait for both menu close and image preload
    await Promise.all([menuClosePromise, imagePreloadPromise]);
    console.log('[PageTransition] Menu closed and images preloaded for:', url);
    
    // CRITICAL: Stop Lenis scroll immediately to prevent page jumping
    if (typeof window !== "undefined" && window.lenis) {
      console.log('[PageTransition] Stopping Lenis scroll');
      window.lenis.stop();
    }
    
    // Start transition immediately
    proceedWithTransition(url);
  }, [pathname, preloadPageImages]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      console.log('[PageTransition] Browser back/forward detected');
      const newPath = window.location.pathname;
      
      if (newPath !== pathname) {
        console.log('[PageTransition] Path changed via browser navigation:', newPath);
        // Trigger transition for browser navigation
        handleRouteChange(newPath);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, handleRouteChange]);

  const proceedWithTransition = useCallback((url) => {
    console.log('[PageTransition] Proceeding with transition to:', url);
    
    // Cleanup page animations BEFORE navigation
    if (typeof window !== "undefined") {
      try {
        // Cleanup home page if we're leaving it
        if (pathname === '/') {
          import("@/lib/scripts/home")
            .then((mod) => {
              if (mod?.cleanupHome) {
                console.log('[PageTransition] Calling cleanupHome');
                mod.cleanupHome();
              }
            })
            .catch((e) => console.error('[PageTransition] Error cleaning up home:', e));
        }
        // Cleanup about page if we're leaving it
        else if (pathname === '/about') {
          import("@/lib/scripts/about")
            .then((mod) => {
              if (mod?.cleanupAbout) {
                console.log('[PageTransition] Calling cleanupAbout');
                mod.cleanupAbout();
              }
            })
            .catch((e) => console.error('[PageTransition] Error cleaning up about:', e));
        }
        // Cleanup work page if we're leaving it
        else if (pathname === '/work') {
          import("@/lib/scripts/work")
            .then((mod) => {
              if (mod?.cleanupWork) {
                console.log('[PageTransition] Calling cleanupWork');
                mod.cleanupWork();
              }
            })
            .catch((e) => console.error('[PageTransition] Error cleaning up work:', e));
        }
        // Cleanup project pages if we're leaving them
        else if (pathname.startsWith('/project-')) {
          import("@/lib/scripts/project")
            .then((mod) => {
              if (mod?.cleanupProject) {
                console.log('[PageTransition] Calling cleanupProject');
                mod.cleanupProject();
              }
            })
            .catch((e) => console.error('[PageTransition] Error cleaning up project:', e));
        }
        // Cleanup contact page if we're leaving it
        else if (pathname === '/contact') {
          import("@/lib/scripts/contact")
            .then((mod) => {
              if (mod?.cleanupContact) {
                console.log('[PageTransition] Calling cleanupContact');
                mod.cleanupContact();
              }
            })
            .catch((e) => console.error('[PageTransition] Error cleaning up contact:', e));
        }
      } catch (e) {
        console.error('[PageTransition] Error during cleanup:', e);
      }
    }
    
    // Small delay to ensure cleanup and menu close complete before covering page
    setTimeout(() => {
      coverPage(url);
    }, 150);
  }, [pathname]);

  const onAnchorClick = useCallback(
    (e) => {
      if (isTransitioning.current) {
        e.preventDefault();
        return;
      }

      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        e.currentTarget.target === "_blank"
      ) {
        return;
      }

      e.preventDefault();
      const href = e.currentTarget.href;
      const url = new URL(href).pathname;
      if (url !== pathname) {
        console.log('[PageTransition] Link clicked:', url);
        handleRouteChange(url);
      }
    },
    [pathname, handleRouteChange]
  );

  const revealPage = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }

    console.log('[PageTransition] Starting reveal animation');

    // Ensure content is visible before revealing
    if (contentRef.current) {
      gsap.set(contentRef.current, { autoAlpha: 1 });
    }

    // CRITICAL: Set blocks to fully cover the page from the LEFT side first
    // This ensures they're in the correct position before revealing
    gsap.set(blocksRef.current, { 
      scaleX: 1, 
      transformOrigin: "left",
      x: 0,
      force3D: true
    });

    // Small delay to ensure GSAP state is applied
    requestAnimationFrame(() => {
      // Now reveal: blocks shrink from LEFT side (revealing content from left to right)
      gsap.to(blocksRef.current, {
        scaleX: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "power3.inOut",
        transformOrigin: "left",
        force3D: true,
        onComplete: () => {
          console.log('[PageTransition] Reveal animation complete');
          isTransitioning.current = false;
          if (overlayRef.current) {
            overlayRef.current.style.pointerEvents = "none";
          }
          if (logoOverlayRef.current) {
            logoOverlayRef.current.style.pointerEvents = "none";
          }
          
          // Ensure all blocks are completely hidden
          gsap.set(blocksRef.current, { scaleX: 0, x: 0, force3D: false });
          
          // Restart Lenis scroll after transition
          if (typeof window !== "undefined" && window.lenis) {
            console.log('[PageTransition] Restarting Lenis scroll');
            window.lenis.start();
          }
          
          // Dispatch custom event to signal transition complete
          console.log('[PageTransition] Dispatching transitionComplete event');
          window.dispatchEvent(new CustomEvent('pageTransitionComplete'));
        },
      });
    });
  }, []);

  // Ensure menu stays closed when pathname changes
  useEffect(() => {
    console.log('[PageTransition] Pathname changed to:', pathname);
    
    if (typeof window !== "undefined") {
      // Close menu immediately and synchronously
      const closeMenu = async () => {
        try {
          const mod = await import("@/lib/scripts/menu");
          if (mod?.closeMenuOnNavigate) {
            console.log('[PageTransition] Force closing menu on pathname change');
            mod.closeMenuOnNavigate();
          }
        } catch (e) {
          console.error('[PageTransition] Error closing menu:', e);
        }
      };
      
      closeMenu();
    }
  }, [pathname]);

  // Hide content immediately on initial mount to prevent flash before transition
  useLayoutEffect(() => {
    if (isInitialMount.current) {
      // Ensure overlay is visible immediately to cover page
      if (overlayRef.current) {
        overlayRef.current.style.display = "flex";
        overlayRef.current.style.position = "fixed";
        overlayRef.current.style.top = "0";
        overlayRef.current.style.left = "0";
        overlayRef.current.style.width = "100vw";
        overlayRef.current.style.height = "100vh";
        overlayRef.current.style.zIndex = "9999";
        
        // Create blocks immediately and cover the page
        overlayRef.current.innerHTML = "";
        blocksRef.current = [];
        
        for (let i = 0; i < 20; i++) {
          const block = document.createElement("div");
          block.className = "block";
          overlayRef.current.appendChild(block);
          blocksRef.current.push(block);
        }
        
        // Set blocks to cover the page immediately (synchronously, before paint)
        if (blocksRef.current.length > 0) {
          blocksRef.current.forEach(block => {
            block.style.transform = "scaleX(1)";
            block.style.transformOrigin = "left";
          });
        }
      }
      
      // Content should be visible but covered by blocks
      if (contentRef.current) {
        contentRef.current.style.opacity = "1";
        contentRef.current.style.visibility = "visible";
      }
      
      // Mark body as ready - this removes the body::before overlay
      if (typeof document !== "undefined") {
        document.body.classList.add("transition-ready");
      }
    }
  }, []);

  useEffect(() => {
    // Only create blocks if they weren't already created in useLayoutEffect
    if (blocksRef.current.length === 0) {
      const createBlocks = () => {
        if (!overlayRef.current) return;
        overlayRef.current.innerHTML = "";
        blocksRef.current = [];

        for (let i = 0; i < 20; i++) {
          const block = document.createElement("div");
          block.className = "block";
          overlayRef.current.appendChild(block);
          blocksRef.current.push(block);
        }
      };

      createBlocks();
    }

    // On initial mount, blocks should already be covering (set in useLayoutEffect)
    // On subsequent navigations (when transitioning), blocks should be covering the page
    if (isInitialMount.current) {
      // Blocks are already covering from useLayoutEffect, just ensure GSAP state matches
      if (blocksRef.current.length > 0) {
        gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "left", force3D: true });
      }
      // Show content behind the blocks (it will be covered)
      if (contentRef.current) {
        gsap.set(contentRef.current, { autoAlpha: 1 });
      }
    } else if (isTransitioning.current) {
      // After navigation, blocks should be covering the page (set by coverPage)
      // Ensure blocks are covering before revealing (from LEFT side)
      gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "left", force3D: true });
      // Content should be visible but covered by blocks
      if (contentRef.current) {
        gsap.set(contentRef.current, { autoAlpha: 1 });
      }
    } else {
      // No transition - blocks start hidden
      gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });
    }

    if (logoRef.current) {
      const path = logoRef.current.querySelector("path");
      if (path) {
        pathLengthRef.current = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLengthRef.current,
          strokeDashoffset: pathLengthRef.current,
          fill: "transparent",
        });
      }
    }

    // Only reveal if we're transitioning or on initial mount
    if (isTransitioning.current || isInitialMount.current) {
      revealPage();
    }

    // Mark initial mount as complete after first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener("click", onAnchorClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", onAnchorClick);
      });
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, [router, pathname, onAnchorClick, revealPage]);

  const coverPage = (url) => {
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = "auto";
    }
    if (logoOverlayRef.current) {
      logoOverlayRef.current.style.pointerEvents = "auto";
    }

    // DON'T hide the content - keep it visible so it shows behind the blocks
    // The blocks will cover it as they animate

    const tl = gsap.timeline({
      onComplete: () => router.push(url),
    });

    // Smooth left-to-right cover animation
    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: 1.2,
      stagger: 0.05,
      ease: "power3.inOut",
      transformOrigin: "left",
    })

      .set(logoOverlayRef.current, { opacity: 1 }, "-=0.4")

      .set(
        logoRef.current.querySelector("path"),
        {
          strokeDashoffset: pathLengthRef.current,
          fill: "transparent",
        },
        "-=0.5"
      )

      .to(
        logoRef.current.querySelector("path"),
        {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "power2.inOut",
        },
        "-=0.8"
      )

      .to(
        logoRef.current.querySelector("path"),
        {
          fill: "#e3e4d8",
          duration: 1.2,
          ease: "power2.out",
        },
        "-=0.8"
      )

      .to(logoOverlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });
  };

  return (
    <>
      <div ref={overlayRef} className="transition-overlay" />
      <div ref={logoOverlayRef} className="logo-overlay">
        <div className="logo-container">
          <Logo ref={logoRef} />
        </div>
      </div>
      <div ref={contentRef} className="page-content-wrapper">
        {children}
      </div>
    </>
  );
};

export default PageTransition;
