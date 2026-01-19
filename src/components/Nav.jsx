"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { initMenuScript } from "@/lib/scripts/menu";

const Nav = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted after hydration
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only initialize menu script after component is mounted (post-hydration)
    if (!mounted) return;

    // Wait for React hydration to complete - use a longer delay to be safe
    // The menu script will also check for hydration completion internally
    if (typeof window !== "undefined") {
      // Use multiple delays to ensure React hydration is completely finished
      setTimeout(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            requestAnimationFrame(() => {
              // Final delay before initializing
              setTimeout(() => {
                initMenuScript();
              }, 500);
            });
          }, 200);
        });
      }, 300);
    }
  }, [mounted]);

  return (
    <nav className="menu">
      <div className="menu-header">
        <a href="#" className="menu-logo">
          <img src="/global/logo.png" alt="" />
        </a>
        <button className="menu-toggle" aria-label="Toggle menu">
          <div className="menu-hamburger-icon">
            <span className="menu-item"></span>
            <span className="menu-item"></span>
          </div>
        </button>
      </div>
      <div className="menu-overlay" suppressHydrationWarning>
        <nav className="menu-nav">
          <ul>
            <li suppressHydrationWarning>
              <Link href="/">Home Base</Link>
            </li>
            <li suppressHydrationWarning>
              <Link href="/about">The Operator</Link>
            </li>
            <li suppressHydrationWarning>
              <Link href="/work">Mission Logs</Link>
            </li>
            <li suppressHydrationWarning>
              <Link href="/story">Off The Grid</Link>
            </li>
            <li suppressHydrationWarning>
              <Link href="/contact">Establish Uplink</Link>
            </li>
          </ul>
        </nav>
        <div className="menu-footer" suppressHydrationWarning>
          <div className="menu-social">
            <a href="#" suppressHydrationWarning>
              <span suppressHydrationWarning>&#9654;</span> Instagram
            </a>
            <a href="#" suppressHydrationWarning>
              <span suppressHydrationWarning>&#9654;</span> LinkedIn
            </a>
          </div>
          <div className="menu-time" suppressHydrationWarning>23:24:02 NY</div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
