import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

let menu;
let menuHeader;
let menuOverlay;
let menuItems;
let menuFooter;
let menuLogo;
let hamburgerMenu;

let isOpen = false;
let lastScrollY = 0;
let isMenuVisible = true;
let isAnimating = false;
let splitTexts = [];
let footerSplitTexts = [];

function setupDomRefs() {
  menu = document.querySelector(".menu");
  menuHeader = document.querySelector(".menu-header");
  menuOverlay = document.querySelector(".menu-overlay");
  menuItems = document.querySelectorAll(".menu-nav li");
  menuFooter = document.querySelector(".menu-footer");
  menuLogo = document.querySelector(".menu-logo img");
  hamburgerMenu = document.querySelector(".menu-hamburger-icon");

  if (!menu || !menuOverlay || !menuFooter) {
    return false;
  }

  lastScrollY = window.scrollY || 0;
  splitTexts = [];
  footerSplitTexts = [];
  isOpen = false;
  isAnimating = false;
  isMenuVisible = true;

  return true;
}

function scrambleText(elements, duration = 0.4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  elements.forEach((char) => {
    const originalText = char.textContent;
    let iterations = 0;
    const maxIterations = Math.floor(Math.random() * 6) + 3;

    gsap.set(char, { opacity: 1 });

    const scrambleInterval = setInterval(() => {
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval);
        char.textContent = originalText;
      }
    }, 25);

    setTimeout(() => {
      clearInterval(scrambleInterval);
      char.textContent = originalText;
    }, duration * 1000);
  });
}

function initMenu() {
  gsap.set(menuOverlay, {
    scaleY: 0,
    transformOrigin: "top center",
  });

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      const split = new SplitText(link, {
        type: "words",
        mask: "words",
      });
      splitTexts.push(split);

      gsap.set(split.words, {
        yPercent: 120,
      });
    }
  });

  const footerElements = document.querySelectorAll(
    ".menu-social a, .menu-social span, .menu-time"
  );
  footerElements.forEach((element) => {
    const split = new SplitText(element, {
      type: "chars",
    });
    footerSplitTexts.push(split);

    gsap.set(split.chars, {
      opacity: 0,
    });

    if (element.classList.contains("menu-time")) {
      gsap.set(element, { opacity: 0 });
    }
  });

  gsap.set(menuItems, {
    opacity: 1,
  });

  gsap.set(menuFooter, {
    opacity: 1,
    y: 20,
  });
}

function openMenu() {
  isOpen = true;
  isAnimating = true;
  if (hamburgerMenu) {
    hamburgerMenu.classList.add("open");
  }
  if (menuLogo) {
    menuLogo.classList.add("rotated");
  }

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
    },
  });

  tl.to(menuOverlay, {
    duration: 0.5,
    scaleY: 1,
    ease: "power3.out",
  });

  const allWords = splitTexts.reduce((acc, split) => {
    return acc.concat(split.words);
  }, []);

  tl.to(
    allWords,
    {
      duration: 0.75,
      yPercent: 0,
      stagger: 0.05,
      ease: "power4.out",
    },
    "-=0.3"
  );

  tl.to(
    menuFooter,
    {
      duration: 0.3,
      y: 0,
      ease: "power2.out",
      onComplete: () => {
        const timeElement = document.querySelector(".menu-time");
        if (timeElement) {
          gsap.set(timeElement, { opacity: 1 });
        }

        const allFooterChars = footerSplitTexts.reduce((acc, split) => {
          return acc.concat(split.chars);
        }, []);

        allFooterChars.forEach((char, index) => {
          setTimeout(() => {
            scrambleText([char], 0.4);
          }, index * 30);
        });
      },
    },
    "-=1"
  );
}

function closeMenu() {
  if (!menuOverlay) return; // Safety check
  isOpen = false;
  isAnimating = true;
  if (hamburgerMenu) {
    hamburgerMenu.classList.remove("open");
  }
  if (menuLogo) {
    menuLogo.classList.remove("rotated");
  }

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
    },
  });

  const allWords = splitTexts.reduce((acc, split) => {
    return acc.concat(split.words);
  }, []);

  tl.to([menuFooter], {
    duration: 0.3,
    y: 20,
    ease: "power2.in",
    onStart: () => {
      const timeElement = document.querySelector(".menu-time");
      if (timeElement) {
        gsap.set(timeElement, { opacity: 0 });
      }

      const allFooterChars = footerSplitTexts.reduce((acc, split) => {
        return acc.concat(split.chars);
      }, []);
      gsap.set(allFooterChars, { opacity: 0 });
    },
  });

  tl.to(
    allWords,
    {
      duration: 0.25,
      yPercent: 120,
      stagger: -0.025,
      ease: "power2.in",
    },
    "-=0.25"
  );

  tl.to(
    menuOverlay,
    {
      duration: 0.5,
      scaleY: 0,
      ease: "power3.inOut",
    },
    "-=0.2"
  );
}

function handleScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    if (isOpen) {
      closeMenu();
    }
    if (isMenuVisible && menu) {
      menu.classList.add("hidden");
      isMenuVisible = false;
    }
  } else if (currentScrollY < lastScrollY) {
    if (!isMenuVisible && menu) {
      menu.classList.remove("hidden");
      isMenuVisible = true;
    }
  }

  lastScrollY = currentScrollY;
}

function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
  });
  const timeElement = document.querySelector(".menu-time");
  if (timeElement) {
    if (!isOpen) {
      timeElement.textContent = `${timeString} LOCAL`;
    } else {
      const timeSplit = footerSplitTexts.find(
        (split) => split.element === timeElement
      );

      if (timeSplit && timeSplit.chars) {
        const newText = `${timeString} LOCAL`;
        const oldChars = timeSplit.chars;

        newText.split("").forEach((char, index) => {
          if (oldChars[index]) {
            oldChars[index].textContent = char;
          }
        });
      }
    }
  }
}

function init() {
  if (!setupDomRefs()) {
    // Retry after a short delay if DOM elements aren't ready
    setTimeout(() => {
      if (setupDomRefs()) {
        init();
      }
    }, 100);
    return;
  }

  // Remove existing event listeners to prevent duplicates
  if (menuHeader) {
    menuHeader.removeEventListener("click", toggleMenu);
    menuHeader.addEventListener("click", toggleMenu);
  }

  // Ensure menu is closed when initializing (e.g., on page navigation)
  // This prevents menu from staying open after navigation
  if (isOpen) {
    isOpen = false;
    isAnimating = false;
    if (hamburgerMenu) {
      hamburgerMenu.classList.remove("open");
    }
    if (menuLogo) {
      menuLogo.classList.remove("rotated");
    }
    if (menuOverlay) {
      gsap.set(menuOverlay, {
        scaleY: 0,
        transformOrigin: "top center",
      });
    }
  }

  initMenu();

  // Store menu link click handler for proper cleanup
  const menuLinkClickHandler = () => {
    if (isOpen) {
      closeMenu();
    }
  };

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      link.removeEventListener("click", menuLinkClickHandler);
      link.addEventListener("click", menuLinkClickHandler);
    }
  });

  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll);

  updateTime();
  // Clear existing interval if any
  if (window.menuTimeInterval) {
    clearInterval(window.menuTimeInterval);
  }
  window.menuTimeInterval = setInterval(updateTime, 1000);
}

function toggleMenu() {
  if (isAnimating) return;

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

export function initMenuScript() {
  if (typeof window === "undefined") return;

  // Always use a small delay to ensure React has rendered the Nav component
  setTimeout(() => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  }, 0);
}

// Export function to close menu when navigating
export function closeMenuOnNavigate() {
  if (typeof window === "undefined") return;
  
  console.log('[Menu] closeMenuOnNavigate called, isOpen:', isOpen);
  
  // ALWAYS reset menu state, regardless of isOpen flag
  // This ensures menu is closed even if state is out of sync
  
  // Reset animation flag to allow immediate close
  isAnimating = false;
  
  // Reset menu state immediately
  isOpen = false;
  
  // Remove visual classes immediately
  const hamburgerElement = document.querySelector(".menu-hamburger-icon");
  const logoElement = document.querySelector(".menu-logo img");
  const overlayElement = document.querySelector(".menu-overlay");
  const footerElement = document.querySelector(".menu-footer");
  
  if (hamburgerElement) {
    hamburgerElement.classList.remove("open");
  }
  if (logoElement) {
    logoElement.classList.remove("rotated");
  }
  
  // Kill any ongoing GSAP animations on menu elements
  if (overlayElement) {
    gsap.killTweensOf(overlayElement);
    // Reset menu overlay to closed state immediately
    gsap.set(overlayElement, {
      scaleY: 0,
      transformOrigin: "top center",
    });
  }
  
  if (footerElement) {
    gsap.killTweensOf(footerElement);
    gsap.set(footerElement, {
      y: 20,
    });
  }
  
  // Reset menu items
  if (splitTexts.length > 0) {
    const allWords = splitTexts.reduce((acc, split) => {
      return acc.concat(split.words);
    }, []);
    gsap.killTweensOf(allWords);
    gsap.set(allWords, {
      yPercent: 120,
    });
  }
  
  // Reset footer
  const timeElement = document.querySelector(".menu-time");
  if (timeElement) {
    gsap.set(timeElement, { opacity: 0 });
  }
  
  if (footerSplitTexts.length > 0) {
    const allFooterChars = footerSplitTexts.reduce((acc, split) => {
      return acc.concat(split.chars);
    }, []);
    gsap.killTweensOf(allFooterChars);
    gsap.set(allFooterChars, { opacity: 0 });
  }
  
  // Reset animation flag
  isAnimating = false;
  
  console.log('[Menu] Menu closed and reset');
}
