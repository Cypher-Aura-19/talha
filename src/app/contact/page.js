'use client';

import { useEffect, useState, useRef } from 'react';
import '@/css/contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle video unmuting and optimization
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Start muted for autoplay
      video.muted = true;
      
      // Optimize video playback
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      
      // Force video to load and buffer
      video.load();
      
      // Unmute after video starts playing
      const handlePlaying = () => {
        video.muted = false;
        video.volume = 1.0;
        console.log('[Contact] Video unmuted and playing with sound');
      };
      
      // Ensure smooth playback
      const handleCanPlay = () => {
        console.log('[Contact] Video can play smoothly');
        // Force play to ensure no stuttering
        video.play().catch(err => console.log('[Contact] Play error:', err));
      };
      
      video.addEventListener('playing', handlePlaying, { once: true });
      video.addEventListener('canplaythrough', handleCanPlay, { once: true });
      
      return () => {
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('canplaythrough', handleCanPlay);
      };
    }
  }, []);

  useEffect(() => {
    console.log('[Contact] Component mounted');
    
    let cleanup = null;
    let eventListenerAdded = false;
    let scriptsLoaded = false;
    
    // CRITICAL: Preload and prepare video before transition ends
    const preloadVideo = () => {
      return new Promise((resolve) => {
        const videoElement = videoRef.current;
        if (!videoElement) {
          console.warn('[Contact] Video element not found');
          resolve();
          return;
        }
        
        // If video is already loaded
        if (videoElement.readyState >= 3) {
          console.log('[Contact] Video already loaded');
          resolve();
          return;
        }
        
        // Wait for video to be ready to play
        console.log('[Contact] Waiting for video to load...');
        
        const handleCanPlay = () => {
          console.log('[Contact] Video can play');
          resolve();
        };
        
        videoElement.addEventListener('canplaythrough', handleCanPlay, { once: true });
        
        // Fallback timeout - don't wait forever
        setTimeout(() => {
          console.log('[Contact] Video preload timeout, proceeding anyway');
          videoElement.removeEventListener('canplaythrough', handleCanPlay);
          resolve();
        }, 2000);
        
        // Force load the video
        videoElement.load();
      });
    };
    
    const loadScripts = async () => {
      if (scriptsLoaded) {
        console.log('[Contact] Scripts already loaded, skipping');
        return () => {};
      }
      
      try {
        console.log('[Contact] Loading scripts...');
        scriptsLoaded = true;
        
        // Wait for video to be ready first
        await preloadVideo();
        console.log('[Contact] Video preloaded successfully');
        
        if (!window.lenis) {
          const lenisModule = await import('@/lib/scripts/lenis-scroll.js');
          lenisModule.initLenis();
          console.log('[Contact] Lenis loaded');
        }
        
        const contactModule = await import('@/lib/scripts/contact.js');
        contactModule.initContact();
        console.log('[Contact] Contact initialized');
        
        return () => {
          console.log('[Contact] Cleanup');
          if (contactModule.cleanupContact) {
            contactModule.cleanupContact();
          }
          scriptsLoaded = false;
        };
      } catch (error) {
        console.error('[Contact] Error loading scripts:', error);
        scriptsLoaded = false;
        return () => {};
      }
    };

    console.log('[Contact] Waiting for transition to complete');
    
    const handleTransitionComplete = async () => {
      console.log('[Contact] Transition complete, loading scripts');
      cleanup = await loadScripts();
    };

    window.addEventListener('pageTransitionComplete', handleTransitionComplete, { once: true });
    eventListenerAdded = true;

    const fallbackTimer = setTimeout(async () => {
      console.log('[Contact] Fallback timeout');
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      cleanup = await loadScripts();
    }, 3000);

    return () => {
      console.log('[Contact] Component unmounting');
      clearTimeout(fallbackTimer);
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  return (
    <>
      <section className="contact">
        {/* Video overlay renders FIRST - highest z-index */}
        <div className="contact-gif" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          zIndex: '9999',
          transform: 'none',
          borderRadius: '0',
          right: 'auto',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}>
          <video 
            ref={videoRef}
            src="/contact/vide.mp4" 
            autoPlay 
            loop 
            playsInline 
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          ></video>
        </div>

        <div className="home-spotlight-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-light.webp" alt="Symbol" />
              </div>
            </div>
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-light.webp" alt="Symbol" />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="contact-header">
            <div className="contact-callout">
              <p className="mono" data-animate-type="scramble" data-animate-delay="0.25">
                <span>&#9654;</span> Frequency: work.talharizwan@gmail.com
              </p>
            </div>
            <div className="contact-header-title">
              <h2 data-animate-type="line-reveal" data-animate-delay="0.25">
                Establish Uplink
              </h2>
            </div>

            {/* Contact Form - Below heading on LEFT side */}
            <div className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="mono">
                    <span>&#9654;</span> Identification
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="mono">
                    <span>&#9654;</span> Signal Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="mono">
                    <span>&#9654;</span> Transmission
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message..."
                    rows="5"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="form-submit mono"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Transmission'}
                </button>

                {status === 'success' && (
                  <p className="form-status success mono">
                    <span>&#9654;</span> Transmission received. Uplink established.
                  </p>
                )}
                {status === 'error' && (
                  <p className="form-status error mono">
                    <span>&#9654;</span> Transmission failed. Please retry.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="home-spotlight-bottom-bar">
          <div className="container">
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.25">
              <span>&#9654;</span> Instagram
            </p>
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.25">
              <span>&#9654;</span> Twitter / X
            </p>
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.25">
              <span>&#9654;</span> YouTube
            </p>
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.25">
              <span>&#9654;</span> LinkedIn
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
