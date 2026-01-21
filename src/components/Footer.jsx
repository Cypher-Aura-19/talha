'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[Footer] Form submitted with email:', email);
    
    if (!email) {
      console.log('[Footer] No email provided');
      return;
    }
    
    setIsSubmitting(true);
    setStatus('');

    try {
      console.log('[Footer] Sending request to /api/appointment');
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('[Footer] Response status:', response.status);
      const data = await response.json();
      console.log('[Footer] Response data:', data);

      if (response.ok) {
        console.log('[Footer] Success!');
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus(''), 5000);
      } else {
        console.log('[Footer] Error response');
        setStatus('error');
        setTimeout(() => setStatus(''), 5000);
      }
    } catch (error) {
      console.error('[Footer] Fetch error:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-col">
            <p className="mono"><span>&#9654;</span> Initialize Encrypted Connection</p>
            <form className="footer-email-container" onSubmit={handleSubmit}>
              <div className="footer-email-row">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => {
                    console.log('[Footer] Email changed:', e.target.value);
                    setEmail(e.target.value);
                  }}
                  required
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  onClick={(e) => {
                    console.log('[Footer] Button clicked directly');
                  }}
                  style={{ position: 'relative', zIndex: 100 }}
                >
                  <Image 
                    src="/global/footer-right-arrow.webp" 
                    alt="Submit" 
                    width={32} 
                    height={32}
                    className="arrow-icon"
                    style={{ pointerEvents: 'none' }}
                  />
                </button>
              </div>
              {status === 'success' && (
                <p className="footer-status success mono">
                  <span>&#9654;</span> Request received. Connection established.
                </p>
              )}
              {status === 'error' && (
                <p className="footer-status error mono">
                  <span>&#9654;</span> Transmission failed. Please retry.
                </p>
              )}
            </form>
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
                <p><Link href="/story">The Journey</Link></p>
              </div>
            </div>
            <div className="footer-sub-col">
              <p className="mono">Connect</p>
              <div className="footer-copy">
                <p><Link href="/contact">Establish Uplink</Link></p>
                <p><Link href="https://github.com" target="_blank">GitHub</Link></p>
                <p><Link href="https://linkedin.com" target="_blank">LinkedIn</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
