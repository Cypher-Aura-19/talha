import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { initAnimations, cleanupAnimations } from "./anime.js";

// Export cleanup function
export function cleanupContact() {
  if (typeof window === 'undefined') return;
  
  console.log('[Contact Cleanup] Starting cleanup...');
  
  try {
    // Cleanup animations (SplitText instances)
    cleanupAnimations();
    
    // Kill all GSAP animations
    gsap.killTweensOf("*");
    
    console.log('[Contact Cleanup] Cleanup complete');
  } catch (error) {
    console.error('[Contact Cleanup] Error during cleanup:', error);
  }
}

// Export init function for Next.js
export function initContact() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(Flip);
  
  // Cleanup any existing instances first
  cleanupContact();
  
  initAnimations();

  const contactGif = document.querySelector(".contact-gif");

  if (contactGif) {
    const video = contactGif.querySelector("video");

    const performAnimation = () => {
      console.log('[Contact] Setting up video animation');
      
      // Get video duration
      const videoDuration = video && video.duration ? video.duration : 3;
      console.log('[Contact] Video duration:', videoDuration, 'seconds');
      
      // Wait for video to play once, then animate
      setTimeout(() => {
        console.log('[Contact] Video finished first play, starting animation');
        
        // 1. Capture the current "Big" (Fullscreen) state
        const state = Flip.getState(contactGif);

        // 2. Remove inline styles to revert to natural CSS position
        contactGif.removeAttribute('style');

        // 3. Animate from "Big" to "Small" using Flip
        Flip.from(state, {
          duration: 2,
          ease: "power4.inOut",
          absolute: true,
          onComplete: () => {
            console.log('[Contact] Video animation complete');
            gsap.set(contactGif, { clearProps: "all" });
            
            // Show the form and other content after video animation
            const formWrapper = document.querySelector('.contact-form-wrapper');
            const callout = document.querySelector('.contact-callout p');
            const title = document.querySelector('.contact-header-title h2');
            
            // Smooth staggered fade-in with better easing
            const tl = gsap.timeline({ delay: 0.3 });
            
            if (callout) {
              tl.to(callout, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out'
              }, 0);
            }
            
            if (title) {
              tl.to(title, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out'
              }, 0.15);
            }
            
            if (formWrapper) {
              tl.to(formWrapper, {
                opacity: 1,
                y: 0,
                duration: 1.4,
                ease: 'power3.out'
              }, 0.3);
            }
          }
        });
      }, videoDuration * 1000); // Convert to milliseconds
    };

    // Wait for video metadata to load to get duration
    if (video) {
      if (video.readyState >= 1) {
        // Metadata already loaded
        performAnimation();
      } else {
        // Wait for metadata to load
        video.addEventListener("loadedmetadata", performAnimation, { once: true });
      }
    } else {
      // Fallback if no video
      setTimeout(() => {
        const state = Flip.getState(contactGif);
        contactGif.removeAttribute('style');
        Flip.from(state, {
          duration: 2,
          ease: "power4.inOut",
          absolute: true,
        });
      }, 3000);
    }
  }
}
