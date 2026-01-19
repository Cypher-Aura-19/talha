'use client';

import { useEffect } from 'react';
import { getProjectById } from '@/lib/data/projects';
import '@/css/project.css';

export default function Project2Page() {
  const project = getProjectById("2");

  useEffect(() => {
    console.log('[Project 2] Component mounted');
    
    let cleanup = null;
    let eventListenerAdded = false;
    let scriptsLoaded = false;
    
    const loadScripts = async () => {
      if (scriptsLoaded) {
        console.log('[Project 2] Scripts already loaded, skipping');
        return () => {};
      }
      
      try {
        console.log('[Project 2] Loading scripts...');
        scriptsLoaded = true;
        
        if (!window.lenis) {
          const lenisModule = await import('@/lib/scripts/lenis-scroll.js');
          lenisModule.initLenis();
          console.log('[Project 2] Lenis loaded');
        }
        
        const projectModule = await import('@/lib/scripts/project.js');
        projectModule.initProject();
        console.log('[Project 2] Project initialized');
        
        return () => {
          console.log('[Project 2] Cleanup');
          scriptsLoaded = false;
        };
      } catch (error) {
        console.error('[Project 2] Error loading scripts:', error);
        scriptsLoaded = false;
        return () => {};
      }
    };

    console.log('[Project 2] Waiting for transition to complete');
    
    const handleTransitionComplete = async () => {
      console.log('[Project 2] Transition complete, loading scripts');
      cleanup = await loadScripts();
    };

    window.addEventListener('pageTransitionComplete', handleTransitionComplete, { once: true });
    eventListenerAdded = true;

    const fallbackTimer = setTimeout(async () => {
      console.log('[Project 2] Fallback timeout');
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      cleanup = await loadScripts();
    }, 3000);

    return () => {
      console.log('[Project 2] Component unmounting');
      clearTimeout(fallbackTimer);
      if (eventListenerAdded) {
        window.removeEventListener('pageTransitionComplete', handleTransitionComplete);
      }
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <div className="home-spotlight-top-bar">
        <div className="container">
          <div className="symbols-container">
            <div className="symbol">
              <img src="/symbols/s1-dark.webp" alt="Symbol" />
            </div>
          </div>
          <div className="symbols-container">
            <div className="symbol">
              <img src="/symbols/s1-dark.webp" alt="Symbol" />
            </div>
          </div>
        </div>
      </div>

      <section className="project-header">
        <div className="container">
          <div className="project-title">
            <h3 data-animate-type="reveal" data-animate-delay="0.25">
              {project.title}
            </h3>
          </div>
          <div className="project-header-divider"></div>
          <div className="project-meta">
            <div className="project-meta-col">
              <p data-animate-type="line-reveal" data-animate-delay="0.25">
                {project.website}
              </p>
              <p data-animate-type="line-reveal" data-animate-delay="0.3">
                {project.type}
              </p>
            </div>
            <div className="project-meta-col">
              <div className="project-meta-sub-col">
                <p data-animate-type="line-reveal" data-animate-delay="0.25">
                  {project.year}
                </p>
                <p data-animate-type="line-reveal" data-animate-delay="0.3">
                  {project.role}
                </p>
              </div>
              <div className="project-meta-sub-col">
                <p data-animate-type="line-reveal" data-animate-delay="0.25">
                  {project.companyLabel}
                </p>
                <p data-animate-type="line-reveal" data-animate-delay="0.3">
                  {project.company}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-banner-img">
        <div className="container">
          <img src={project.bannerImg} alt="" />
        </div>
      </section>

      <section className="anime-text-container project-anime-text">
        <div className="home-spotlight-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol"><img src="/symbols/s1-dark.webp" alt="Symbol" /></div>
            </div>
            <div className="symbols-container">
              <div className="symbol"><img src="/symbols/s1-dark.webp" alt="Symbol" /></div>
            </div>
          </div>
        </div>
        <div className="home-spotlight-bottom-bar">
          <div className="container">
            <p className="mono"><span>&#9654;</span> Mission Brief</p>
            <p className="mono">/ Archive Log</p>
          </div>
        </div>
        <div className="container">
          <div className="copy-container">
            <div className="section-label">
              <span className="section-label-text">Situation Report</span>
            </div>
            <div className="anime-text">
              {project.overview.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="section-divider"></div>
            <div className="section-label">
              <span className="section-label-text">Equipment</span>
            </div>
            <div className="anime-text stack-text">
              {project.stack.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="project-snapshots">
        <div className="home-spotlight-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol"><img src="/symbols/s1-light.webp" alt="Symbol" /></div>
              <div className="symbol"><img src="/symbols/s2-light.webp" alt="Symbol" /></div>
            </div>
            <div className="symbols-container">
              <div className="symbol"><img src="/symbols/s2-light.webp" alt="Symbol" /></div>
              <div className="symbol"><img src="/symbols/s1-light.webp" alt="Symbol" /></div>
            </div>
          </div>
        </div>
        <div className="home-spotlight-bottom-bar">
          <div className="container">
            <p className="mono" data-animate-type="scramble" data-animate-delay="0.2" data-animate-on-scroll="true">
              <span>&#9654;</span> Visual Recon
            </p>
            <p id="active-slide-label" className="mono" data-animate-type="scramble" data-animate-delay="0.25"
              data-animate-on-scroll="true">
              / Field Data
            </p>
          </div>
        </div>
        <div className="project-snapshots-wrapper">
          {project.snapshots.map((snapshot, index) => (
            <div key={index} className="project-snapshot">
              <img src={snapshot.src} alt={snapshot.alt} />
            </div>
          ))}
        </div>
        <div className="snapshots-progress-bar">
          <div className="progress-bar"></div>
        </div>
      </section>

      <section className="project-client-review project-anime-text">
        <div className="home-spotlight-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol"><img src="/symbols/s1-dark.webp" alt="Symbol" /></div>
            </div>
            <div className="symbols-container">
              <div className="symbol"><img src="/symbols/s1-dark.webp" alt="Symbol" /></div>
            </div>
          </div>
        </div>
        <div className="home-spotlight-bottom-bar">
          <div className="container">
            <p className="mono"><span>&#9654;</span> Transmission Log</p>
            <p className="mono">/ Feedback</p>
          </div>
        </div>
        <div className="container">
          <div className="copy-container">
            <div className="review-header">
              <div className="review-stars">★★★★★</div>
              <div className="review-label">
                <p className="mono">Client Testimonial</p>
              </div>
            </div>
            <div className="anime-text">
              {project.review.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="review-footer">
              <div className="review-author">
                <div className="review-author-avatar">{project.review.author.avatar}</div>
                <div className="review-author-info">
                  <h4>{project.review.author.name}</h4>
                  <p className="mono">{project.review.author.title}</p>
                </div>
              </div>
              <div className="review-project-tag">
                <p className="mono">{project.review.tag}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="next-project">
        <div className="home-spotlight-top-bar">
          <div className="container">
            <div className="symbols-container">
              <div className="symbol"><img src="/symbols/s1-light.webp" alt="Symbol" /></div>
              <div className="symbol"><img src="/symbols/s2-light.webp" alt="Symbol" /></div>
              <div className="symbol"><img src="/symbols/s3-light.webp" alt="Symbol" /></div>
            </div>
            <div className="symbols-container">
              <div className="symbol"><img src="/symbols/s3-light.webp" alt="Symbol" /></div>
              <div className="symbol"><img src="/symbols/s2-light.webp" alt="Symbol" /></div>
              <div className="symbol"><img src="/symbols/s1-light.webp" alt="Symbol" /></div>
            </div>
          </div>
        </div>
        <a href={`/project-${project.nextProject.id}`} className="next-project-link">
          <div className="container next-project-data">
            <div className="next-project-label-row">
              <span className="next-project-label">Incoming Transmission</span>
            </div>
            <div className="next-project-title">
              <h3>{project.nextProject.title}</h3>
            </div>
            <div className="next-project-preview">
              <div className="next-project-preview-img">
                <img src={project.nextProject.previewImg} alt={`${project.nextProject.title} Preview`} />
              </div>
              <div className="next-project-tags">
                {project.nextProject.tags.map((tag, index) => (
                  <span key={index} className="next-project-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="next-project-cta">
              <div className="next-project-cta-icon">→</div>
              <span className="next-project-cta-text">View Project</span>
            </div>
          </div>
        </a>
        <div className="home-spotlight-bottom-bar">
          <div className="container">
            <p className="mono"><span>&#9654;</span> Next Mission</p>
            <p className="mono">/ Capability Display</p>
          </div>
        </div>
      </section>
    </>
  );
}
