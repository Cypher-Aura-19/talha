'use client';

import { useEffect, useState } from 'react';
import '@/css/contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    console.log('[Contact] Component mounted');
    
    let cleanup = null;
    let eventListenerAdded = false;
    let scriptsLoaded = false;
    
    const loadScripts = async () => {
      if (scriptsLoaded) {
        console.log('[Contact] Scripts already loaded, skipping');
        return () => {};
      }
      
      try {
        console.log('[Contact] Loading scripts...');
        scriptsLoaded = true;
        
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
          right: 'auto'
        }}>
          <video src="/contact/vide.mp4" autoPlay loop playsInline preload="auto" loading="eager"></video>
        </div>

        <div className="home-spotlight-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-light.png" alt="Symbol" />
              </div>
            </div>
            <div className="symbols-container">
              <div className="symbol">
                <img src="/symbols/s1-light.png" alt="Symbol" />
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
