"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "AI Engine", sectionId: "ai-engine" },
  { label: "Cyber AI Loop", sectionId: "cyber-ai-loop" },
  { label: "AI Analyst", sectionId: "ai-analyst" },
  { label: "Modules", sectionId: "modules" },
  { label: "Metrics", sectionId: "metrics" },
  { label: "Comparison", sectionId: "comparison" },
] as const;

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for active section highlighting and background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map(({ sectionId }) => ({
        id: sectionId,
        el: document.getElementById(sectionId),
      }));

      const scrollY = window.scrollY + 100; // offset for sticky nav height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el && section.el.offsetTop <= scrollY) {
          setActiveSection(section.id);
          return;
        }
      }

      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileMenuOpen(false);
    },
    []
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/80 shadow-lg shadow-primary/5"
          : "bg-surface/60"
      } backdrop-blur-xl border-b border-surface-border/50`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-primary/15 p-2">
              <Shield className="h-5 w-5 text-primary" strokeWidth={2.25} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide text-white">
                Darktrace
              </span>
              <span className="text-[11px] font-medium tracking-wider text-accent/80 uppercase">
                ActiveAI Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(({ label, sectionId }) => {
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={sectionId}
                  onClick={() => scrollToSection(sectionId)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white/90"
                  }`}
                >
                  {label}
                  {/* Active / hover underline */}
                  <span
                    className={`absolute bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ${
                      isActive ? "w-4/5" : "w-0 group-hover:w-4/5"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-surface-light hover:text-white md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 top-16 z-40 bg-surface/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map(({ label, sectionId }) => {
            const isActive = activeSection === sectionId;
            return (
              <button
                key={sectionId}
                onClick={() => scrollToSection(sectionId)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-white border-l-2 border-primary"
                    : "text-white/60 hover:bg-surface-light hover:text-white/90"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
