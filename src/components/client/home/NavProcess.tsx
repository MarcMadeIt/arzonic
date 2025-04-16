"use client";

import React, { useEffect, useRef, useState } from "react";

const NavProcess: React.FC = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const originalOffsetRef = useRef<number>(0);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showNav, setShowNav] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      // Record the original offset the first time we scroll.
      if (navRef.current && originalOffsetRef.current === 0) {
        originalOffsetRef.current =
          navRef.current.getBoundingClientRect().top + window.scrollY;
      }

      const currentScrollY = window.scrollY;
      const processSection = document.getElementById("Process");
      let processSectionBottom = 0;

      if (processSection) {
        processSectionBottom =
          processSection.offsetTop + processSection.offsetHeight;
      }

      // Show/hide/sticky logic
      if (currentScrollY < originalOffsetRef.current) {
        setIsSticky(false);
        setShowNav(true);
      } else if (
        currentScrollY >= originalOffsetRef.current &&
        currentScrollY <= processSectionBottom
      ) {
        setIsSticky(true);
        setShowNav(true);
      } else if (currentScrollY > processSectionBottom) {
        setShowNav(false);
      }

      // Progress bar calculation
      if (processSection) {
        const { top, height } = processSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollableHeight = height - windowHeight;
        const scrolled = -top;
        const clampedScrolled = Math.max(0, Math.min(scrolled, scrollableHeight));
        const sectionProgress =
          scrollableHeight > 0 ? (clampedScrolled / scrollableHeight) * 100 : 0;
        setProgress(sectionProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showNav) return null;

  return (
    <div ref={navRef} className={`nav-process ${isSticky ? "sticky" : ""}`}>
      <div className="nav-process-content">
        <h2>NavProcess</h2>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default NavProcess;
