import gsap from "gsap";

// Export animateTransition function at module level for Next.js
export function animateTransition() {
  if (typeof window === 'undefined') return Promise.resolve();
  
  return new Promise((resolve) => {
    // Use GSAP timeline for better performance and coordination
    const tl = gsap.timeline({
      onComplete: () => {
        // Clean up will-change after animation to save resources
        gsap.set(".transition-overlay", { willChange: "auto", clearProps: "will-change" });
        gsap.set(".transition-logo", { willChange: "auto", clearProps: "will-change" });
        resolve();
      },
      defaults: { force3D: true, ease: "expo.out" }
    });

    // Set initial states with GPU acceleration
    gsap.set(".transition-overlay", { 
      scaleY: 0, 
      transformOrigin: "bottom",
      willChange: "transform"
    });

    gsap.set(".transition-logo", {
      top: "120%",
      opacity: 0,
      willChange: "transform, opacity"
    });

    // Animate overlay
    tl.to(".transition-overlay", {
      scaleY: 1,
      duration: 0.75,
      ease: "expo.out",
    }, 0);

    // Animate logo (starts after delay)
    tl.to(".transition-logo", {
      top: "50%",
      opacity: 1,
      duration: 0.75,
      ease: "expo.out",
    }, 0.4);
  });
}

// Export init function for Next.js
export function initTransition() {
  if (typeof window === 'undefined') return;
  
  // Custom smooth easing for buttery animations
  const smoothEase = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Critical images that must load before reveal
  const criticalImages = [
    "/cards/1.png",
    "/cards/2.png",
    "/cards/3.png",
    "/global/logo.png",
    "/home/wideskill-1.png",
    "/home/wideskill-2.png",
    "/home/wideskill-3.png",
    "/home/wideskill-4.png",
  ];

  // Preload critical images
  function preloadImages(urls) {
    const promises = urls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(url); // Don't block on error
        img.src = url;
      });
    });
    return Promise.all(promises);
  }

  // Preload all visible images in the DOM
  function preloadVisibleImages() {
    const images = document.querySelectorAll('img[src]:not([loading="lazy"])');
    const promises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    return Promise.all(promises);
  }

  function calculateLogoScale() {
    const logoSize = 60;
    const logoData =
      "M800 515.749L501.926 343.832V0H297.482V343.832L0 515.749L101.926 693L399.408 521.084L697.482 693L800 515.749Z";

    const tempSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    tempSvg.style.position = 'absolute';
    tempSvg.style.visibility = 'hidden';
    tempSvg.style.pointerEvents = 'none';
    const tempPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    tempPath.setAttribute("d", logoData);
    tempSvg.appendChild(tempPath);
    document.body.appendChild(tempSvg);

    const bbox = tempPath.getBBox();
    tempSvg.remove();

    const scale = logoSize / Math.max(bbox.width, bbox.height);

    return { scale, bbox };
  }

  function createMaskOverlay() {
    const maskOverlay = document.querySelector(".mask-transition");

    maskOverlay.innerHTML = `
      <svg width="100%" height="100%">
        <defs>
          <mask id="logoRevealMask">
            <rect width="100%" height="100%" fill="white" />
            <path id="logoMask" fill="black"></path>
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="var(--base-300)"
          mask="url(#logoRevealMask)"
        />
      </svg>
    `;
  }

  // Initialize - wait for images then reveal
  async function init() {
    createMaskOverlay();

    // Show loading state immediately
    gsap.set(".mask-transition", { display: "block" });
    gsap.set(".mask-bg-overlay", { display: "block", opacity: 1 });
    
    // Show body now that mask is covering it
    document.body.classList.add("loaded");

    // Preload critical images first, with timeout fallback
    const imageLoadPromise = Promise.all([
      preloadImages(criticalImages),
      preloadVisibleImages(),
    ]);

    // Max wait 2 seconds for images, then proceed anyway
    await Promise.race([
      imageLoadPromise,
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);

    // Now reveal the page smoothly
    revealTransition();
  }

  // Initialize
  init();

  function revealTransition() {
    return new Promise((resolve) => {
      const logoMask = document.getElementById("logoMask");
      const logoData =
        "M800 515.749L501.926 343.832V0H297.482V343.832L0 515.749L101.926 693L399.408 521.084L697.482 693L800 515.749Z";

      logoMask.setAttribute("d", logoData);

      const { scale: logoScale, bbox } = calculateLogoScale();
      const pathCenterX = bbox.x + bbox.width / 2;
      const pathCenterY = bbox.y + bbox.height / 2;

      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      const initialScale = logoScale;
      const translateX = viewportCenterX - pathCenterX * initialScale;
      const translateY = viewportCenterY - pathCenterY * initialScale;

      logoMask.setAttribute(
        "transform",
        `translate(${translateX}, ${translateY}) scale(${initialScale})`
      );

      const scaleMultiplier = window.innerWidth < 1000 ? 15 : 40;

      let startTime = null;
      const duration = 3000;

      function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);

        const progress = smoothEase(rawProgress);

        const scale = initialScale + progress * scaleMultiplier;
        const newTranslateX = viewportCenterX - pathCenterX * scale;
        const newTranslateY = viewportCenterY - pathCenterY * scale;

        logoMask.setAttribute(
          "transform",
          `translate(${newTranslateX}, ${newTranslateY}) scale(${scale})`
        );

        const fadeProgress = Math.min(0.3, progress * 0.5);
        gsap.set(".mask-bg-overlay", {
          opacity: 0.3 - fadeProgress,
        });

        if (rawProgress < 1) {
          requestAnimationFrame(animate);
        } else {
          gsap.set(".mask-transition", { display: "none" });
          gsap.set(".mask-bg-overlay", { display: "none" });
          resolve();
        }
      }

      requestAnimationFrame(animate);
      gsap.set(".transition-overlay", { scaleY: 0 });
    });
  }

  function closeMenuIfOpen() {
    const menuToggleBtn = document.querySelector(".menu-toggle-btn");
    if (menuToggleBtn && menuToggleBtn.classList.contains("menu-open")) {
      menuToggleBtn.click();
    }
  }

  function isSamePage(href) {
    if (!href || href === "#" || href === "") return true;

    const currentPath = window.location.pathname;

    if (href === currentPath) return true;

    if (
      (currentPath === "/" || currentPath === "/index.html") &&
      (href === "/" ||
        href === "/index.html" ||
        href === "index.html" ||
        href === "./index.html")
    ) {
      return true;
    }

    const currentFileName = currentPath.split("/").pop() || "index.html";
    const hrefFileName = href.split("/").pop();

    if (currentFileName === hrefFileName) return true;

    return false;
  }

  // In Next.js, we don't intercept Link clicks - they're handled by TransitionLink component
  // Only intercept non-Next.js links (for backward compatibility with HTML version)
  const isNextJs = typeof window !== 'undefined' && window.__NEXT_DATA__;
  
  if (!isNextJs) {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) return;

    const href = link.getAttribute("href");

    if (
      href &&
      (href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:"))
    ) {
      return;
    }

    if (isSamePage(href)) {
      event.preventDefault();
      closeMenuIfOpen();
      return;
    }

    event.preventDefault();

    animateTransition().then(() => {
      window.location.href = href;
    });
  });
  }
}

// Auto-init for compatibility
if (typeof window !== 'undefined') {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTransition);
  } else {
    initTransition();
  }
}
