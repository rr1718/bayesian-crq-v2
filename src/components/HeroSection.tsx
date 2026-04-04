"use client";

import { Shield, Zap, Globe } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hero-orb hero-orb--purple" />
        <div className="hero-orb hero-orb--teal" />
        <div className="hero-orb hero-orb--blue" />
        <div className="hero-orb hero-orb--purple-sm" />
        <div className="hero-orb hero-orb--teal-sm" />
      </div>

      {/* Radial vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, var(--background) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column -- copy */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit rounded-full border border-surface-border bg-surface/60 px-4 py-1.5 text-xs tracking-wide text-text-secondary backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              AI-Native Cybersecurity
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Darktrace{" "}
              <span className="gradient-text">ActiveAI</span>{" "}
              Security Platform
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
              Enterprise-grade, AI-native cybersecurity built on a decade of
              machine learning research. Protecting nearly 10,000 customers
              globally with 250+ patent applications.
            </p>

            {/* CTA area */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="hero-cta group relative inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.98]">
                <span className="relative z-10 flex items-center gap-2">
                  Explore the Platform
                  <Zap className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                </span>
                {/* Glow ring on hover */}
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-accent to-accent-blue opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-40" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-surface-border bg-surface/50 px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:bg-surface-light/60">
                <Globe className="h-4 w-4 text-accent" />
                Watch Demo
              </button>
            </div>

            {/* Stat cards */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <StatCard
                value="74%"
                label="of security professionals say AI threats have significant impact"
                icon={<Zap className="h-4 w-4 text-accent" />}
                accentColor="accent"
              />
              <StatCard
                value="85%"
                label="agree platform approach beats fragmented stacks"
                icon={<Shield className="h-4 w-4 text-primary-light" />}
                accentColor="primary"
              />
            </div>
          </div>

          {/* Right column -- visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <NetworkShieldGraphic />
          </div>
        </div>
      </div>

      {/* Inline styles for hero-specific animations (no framer-motion) */}
      <style jsx>{`
        /* ---- floating orbs ---- */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          will-change: transform;
        }
        .hero-orb--purple {
          width: 500px;
          height: 500px;
          background: var(--primary);
          top: -10%;
          left: -8%;
          animation: hero-drift 18s ease-in-out infinite alternate;
        }
        .hero-orb--teal {
          width: 400px;
          height: 400px;
          background: var(--accent);
          bottom: -5%;
          right: -5%;
          animation: hero-drift 22s ease-in-out infinite alternate-reverse;
        }
        .hero-orb--blue {
          width: 350px;
          height: 350px;
          background: var(--accent-blue);
          top: 30%;
          right: 20%;
          animation: hero-drift 20s ease-in-out infinite alternate;
          animation-delay: -6s;
        }
        .hero-orb--purple-sm {
          width: 180px;
          height: 180px;
          background: var(--primary-light);
          bottom: 25%;
          left: 20%;
          animation: hero-drift 15s ease-in-out infinite alternate-reverse;
          animation-delay: -3s;
        }
        .hero-orb--teal-sm {
          width: 140px;
          height: 140px;
          background: var(--accent);
          top: 15%;
          right: 35%;
          animation: hero-drift 17s ease-in-out infinite alternate;
          animation-delay: -8s;
        }

        @keyframes hero-drift {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 15px) scale(0.95);
          }
          100% {
            transform: translate(10px, -10px) scale(1.02);
          }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                         */
/* ------------------------------------------------------------------ */
function StatCard({
  value,
  label,
  icon,
  accentColor,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  accentColor: "accent" | "primary";
}) {
  const borderHover =
    accentColor === "accent"
      ? "hover:border-accent/40"
      : "hover:border-primary/40";

  return (
    <div
      className={`group relative rounded-xl border border-surface-border bg-surface/60 p-5 backdrop-blur-sm transition-all duration-300 ${borderHover} hover:bg-surface-light/40`}
    >
      {/* Top glow line */}
      <div
        className={`absolute inset-x-0 top-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
          accentColor === "accent"
            ? "bg-gradient-to-r from-transparent via-accent to-transparent"
            : "bg-gradient-to-r from-transparent via-primary to-transparent"
        }`}
      />
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            accentColor === "accent"
              ? "bg-accent/10"
              : "bg-primary/10"
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-sm leading-snug text-text-secondary">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Network / Shield Graphic                                          */
/* ------------------------------------------------------------------ */
function NetworkShieldGraphic() {
  return (
    <div className="relative h-[420px] w-[420px] sm:h-[480px] sm:w-[480px]">
      {/* Outer rotating ring */}
      <div className="absolute inset-0 rounded-full border border-surface-border/40 hero-rotate-slow" />

      {/* Middle ring -- counter-rotate */}
      <div className="absolute inset-8 rounded-full border border-primary/20 hero-rotate-reverse" />

      {/* Inner glow disc */}
      <div className="absolute inset-20 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      {/* Centre shield icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl border border-surface-border bg-surface/80 shadow-2xl shadow-primary/10 backdrop-blur-md">
          <Shield className="h-12 w-12 text-primary-light animate-pulse-glow" />
          {/* Shield inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-primary/5" />
        </div>
      </div>

      {/* Orbital nodes */}
      <OrbitalNode
        angle={0}
        radius={190}
        size="lg"
        delay="0s"
        icon={<Globe className="h-5 w-5 text-accent" />}
      />
      <OrbitalNode
        angle={72}
        radius={190}
        size="sm"
        delay="0.8s"
      />
      <OrbitalNode
        angle={144}
        radius={190}
        size="md"
        delay="1.6s"
        icon={<Zap className="h-4 w-4 text-accent-blue" />}
      />
      <OrbitalNode
        angle={216}
        radius={190}
        size="sm"
        delay="2.4s"
      />
      <OrbitalNode
        angle={288}
        radius={190}
        size="md"
        delay="3.2s"
        icon={<Shield className="h-4 w-4 text-primary-light" />}
      />

      {/* Connection lines (decorative) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 480 480"
        fill="none"
        aria-hidden="true"
      >
        {/* Lines from centre to each node */}
        {[0, 72, 144, 216, 288].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 240;
          const cy = 240;
          const r = 190;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          return (
            <line
              key={angle}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="url(#line-grad)"
              strokeWidth="1"
              opacity="0.25"
            />
          );
        })}
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Scanning arc */}
      <div className="absolute inset-4 rounded-full hero-rotate-slow overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 h-1/2 w-1/2 origin-top-left"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, var(--primary) 20deg, transparent 60deg)",
            opacity: 0.08,
            borderRadius: "0 0 100% 0",
          }}
        />
      </div>

      {/* Inline styles for graphic-specific animations */}
      <style jsx>{`
        .hero-rotate-slow {
          animation: hero-spin 30s linear infinite;
        }
        .hero-rotate-reverse {
          animation: hero-spin 24s linear infinite reverse;
        }
        @keyframes hero-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbital Node                                                      */
/* ------------------------------------------------------------------ */
function OrbitalNode({
  angle,
  radius,
  size,
  delay,
  icon,
}: {
  angle: number;
  radius: number;
  size: "sm" | "md" | "lg";
  delay: string;
  icon?: React.ReactNode;
}) {
  const rad = (angle * Math.PI) / 180;
  /* Centre of the 480px container is 240,240 (we use %) */
  const cx = 50 + (radius / 480) * 100 * Math.cos(rad);
  const cy = 50 + (radius / 480) * 100 * Math.sin(rad);

  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`absolute ${sizeMap[size]} -translate-x-1/2 -translate-y-1/2 rounded-full border border-surface-border bg-surface/80 backdrop-blur-sm flex items-center justify-center shadow-lg`}
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        animation: `hero-node-pulse 3s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      {icon ?? (
        <span className="block h-2 w-2 rounded-full bg-primary-light/60" />
      )}

      <style jsx>{`
        @keyframes hero-node-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(108, 59, 245, 0.3);
          }
          50% {
            box-shadow: 0 0 12px 4px rgba(108, 59, 245, 0.15);
          }
        }
      `}</style>
    </div>
  );
}
