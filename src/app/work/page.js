'use client';

import { useEffect } from 'react';

export default function Work() {
  useEffect(() => {
    console.log('[Work Page] Component mounted');
    
    let cleanup = null;
    let eventListenerAdded = false;
    let scriptsLoaded = false;
    
    // Load scripts after component mounts
    const loadScripts = async () => {
      // Prevent double loading
      if (scriptsLoaded) {
        console.log('[Work Page] Scripts already loaded, skipping');
        return () => {};
      }
      
      try {
        console.log('[Work Page] Loading scripts...');
        scriptsLoaded = true;
        
        // Load and initialize Lenis (only if not already loaded)
        if (!window.lenis) {
          const lenisModule = await import('@/lib/scripts/lenis-scroll.js');
          lenisModule.initLenis();
          console.log('[Work Page] Lenis loaded and initialized');
        } else {
          console.log('[Work Page] Lenis already loaded');
        }
        
        // Load and initialize work module (full initialization with animations)
        const workModule = await import('@/lib/scripts/work.js');
        console.log('[Work Page] Work module loaded');
        
        // Always initialize work (it handles its own cleanup)
        workModule.initWork();
        window.workInitialized = true;
        console.log('[Work Page] Work initialized');
        
        // Return cleanup function
        return () => {
          console.log('[Work Page] Cleanup function called');
          if (workModule.cleanupWork) {
            workModule.cleanupWork();
          }
          window.workInitialized = false;
          scriptsLoaded = false;
        };
      } catch (error) {
        console.error('[Work Page] Error loading scripts:', error);
        scriptsLoaded = false;
        return () => {};
      }
    };

    // ALWAYS wait for transition to complete
    console.log('[Work Page] Waiting for transition to complete');
    
    // Handler for transition complete event
    const handleTransitionComplete = async () => {
      console.log('[Work Page] Transition complete event received, loading scripts');
      cleanup = await loadScripts();
    };

    // Listen for the transition complete event
    window.addEventListener('pageTransitionComplete', handleTransitionComplete, { once: true });
    eventListenerAdded = true;

    // Fallback: if event doesn't fire within 3 seconds, load anyway
    const fallbackTimer = setTimeout(async () => {
      console.log('[Work Page] Fallback: loading scripts after timeout');
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      cleanup = await loadScripts();
    }, 3000);

    return () => {
      console.log('[Work Page] Component unmounting');
      clearTimeout(fallbackTimer);
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      if (cleanup && typeof cleanup === 'function') {
        console.log('[Work Page] Calling cleanup');
        cleanup();
      }
    };
  }, []);

  return (
    <>
      <div className="slider">
        {/* Pre-render first slide so image is visible during transition */}
        <div className="slide slide-initial" data-pre-rendered="true">
          <div className="slide-img">
            <img src="/work/1.png" alt="" style={{ opacity: 1 }} />
          </div>
          <div className="slide-header">
            <div className="slide-title">
              <h2>DeliveTree</h2>
            </div>
            <div className="slide-description">
              <p>Cross-border ecosystem management grid. High-latency coordination between Islamabad and Ankara sectors.</p>
            </div>
            <div className="slide-link">
              <a href="/project-1">Access Log</a>
            </div>
          </div>
          <div className="slide-info">
            <div className="slide-tags">
              <p className="mono">Specs</p>
              <p className="mono">React</p>
              <p className="mono">Node.js</p>
              <p className="mono">Remote Ops</p>
              <p className="mono">Full Stack</p>
            </div>
            <div className="slide-index-wrapper">
              <p className="mono">01</p>
              <p className="mono">/</p>
              <p className="mono">04</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
