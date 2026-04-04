"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Shield,
  Clock,
  Users,
  MailWarning,
  Link2,
  ShieldAlert,
  Radar,
  Star,
  Trophy,
  FileText,
  AlertTriangle,
  Bug,
  Layers,
  Moon,
  Building2,
  Brain,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  color: "accent" | "primary" | "accent-blue";
}

interface PainPoint {
  title: string;
  description: string;
  icon: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const METRICS: Metric[] = [
  {
    value: 10000,
    prefix: "~",
    label: "Customers Protected Globally",
    icon: <Shield className="w-6 h-6" />,
    color: "accent",
  },
  {
    value: 92,
    suffix: "%",
    prefix: "Up to ",
    label: "Triage Time Reduction",
    icon: <Clock className="w-6 h-6" />,
    color: "primary",
  },
  {
    value: 30,
    suffix: " FTE",
    prefix: "Up to ",
    label: "Equivalent per Deployment",
    icon: <Users className="w-6 h-6" />,
    color: "accent-blue",
  },
  {
    value: 60,
    suffix: "%",
    prefix: "Up to ",
    label: "Phishing False Positive Reduction",
    icon: <MailWarning className="w-6 h-6" />,
    color: "accent",
  },
  {
    value: 70,
    suffix: "%",
    prefix: "Up to ",
    label: "More Phishing Links Detected",
    icon: <Link2 className="w-6 h-6" />,
    color: "primary",
  },
  {
    value: 56,
    prefix: "~",
    suffix: "%",
    label: "Email Threats Caught Past Other Layers",
    icon: <ShieldAlert className="w-6 h-6" />,
    color: "accent-blue",
  },
  {
    value: 50,
    prefix: "30–",
    suffix: "%",
    label: "More Hidden Assets Surfaced (PREVENT)",
    icon: <Radar className="w-6 h-6" />,
    color: "accent",
  },
  {
    value: 4.8,
    suffix: "/5",
    label: "Gartner Peer Insights (249 Reviews)",
    icon: <Star className="w-6 h-6" />,
    color: "primary",
  },
  {
    value: 1,
    prefix: "#",
    label: "PeerSpot NDR Ranking (8.1 Rating)",
    icon: <Trophy className="w-6 h-6" />,
    color: "accent-blue",
  },
  {
    value: 250,
    suffix: "+",
    label: "Patent Applications Filed",
    icon: <FileText className="w-6 h-6" />,
    color: "accent",
  },
];

const PAIN_POINTS: PainPoint[] = [
  {
    title: "Alert Fatigue and Analyst Burnout",
    description:
      "Security teams drown in thousands of daily alerts, leading to missed threats and staff turnover. AI-driven triage cuts noise by up to 92%.",
    icon: <AlertTriangle className="w-8 h-8" />,
  },
  {
    title: "Unknown and Novel Threat Exposure",
    description:
      "Signature-based tools miss zero-days and novel attack patterns. Self-learning AI detects threats without prior knowledge of indicators.",
    icon: <Bug className="w-8 h-8" />,
  },
  {
    title: "Fragmented Security Stacks",
    description:
      "Disconnected point solutions create visibility gaps. A unified Cyber AI Loop correlates signals across network, email, cloud, and endpoints.",
    icon: <Layers className="w-8 h-8" />,
  },
  {
    title: "Coverage During Off-Hours",
    description:
      "Attacks peak on weekends and holidays when SOCs run skeleton crews. Autonomous response operates 24/7 without human intervention.",
    icon: <Moon className="w-8 h-8" />,
  },
  {
    title: "Small Teams, Enterprise Scale",
    description:
      "Lean security teams can't scale headcount to match expanding attack surfaces. AI Analyst delivers the equivalent of up to 30 FTEs.",
    icon: <Building2 className="w-8 h-8" />,
  },
  {
    title: "AI Governance and Shadow AI",
    description:
      "The rapid adoption of generative AI creates unsanctioned data flows and new attack vectors that legacy tooling was never designed to see.",
    icon: <Brain className="w-8 h-8" />,
  },
];

const COLOR_MAP = {
  accent: "text-accent",
  primary: "text-primary",
  "accent-blue": "text-accent-blue",
} as const;

const ICON_BG_MAP = {
  accent: "bg-accent/10 text-accent",
  primary: "bg-primary/10 text-primary",
  "accent-blue": "bg-accent-blue/10 text-accent-blue",
} as const;

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useCountUp(
  target: number,
  isVisible: boolean,
  duration = 2000
): number {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const isDecimal = target % 1 !== 0;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return count;
}

/* ------------------------------------------------------------------ */
/*  MetricCard                                                         */
/* ------------------------------------------------------------------ */

function MetricCard({
  metric,
  isVisible,
  index,
}: {
  metric: Metric;
  isVisible: boolean;
  index: number;
}) {
  const count = useCountUp(metric.value, isVisible);

  const formattedCount =
    metric.value >= 1000 ? count.toLocaleString() : count;

  return (
    <div
      className="group relative bg-surface rounded-xl p-6 cyber-border
                 hover:bg-surface-light transition-all duration-300
                 flex flex-col items-center text-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      {/* icon */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${ICON_BG_MAP[metric.color]}`}
      >
        {metric.icon}
      </div>

      {/* number */}
      <p className={`text-3xl lg:text-4xl font-bold ${COLOR_MAP[metric.color]} mb-2 tabular-nums`}>
        {metric.prefix}
        {formattedCount}
        {metric.suffix}
      </p>

      {/* label */}
      <p className="text-sm text-text-secondary leading-snug">{metric.label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PainPointCard                                                      */
/* ------------------------------------------------------------------ */

function PainPointCard({
  point,
  isVisible,
  index,
}: {
  point: PainPoint;
  isVisible: boolean;
  index: number;
}) {
  return (
    <div
      className="group bg-surface rounded-xl p-6 cyber-border
                 hover:bg-surface-light transition-all duration-300 card-glow"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms`,
      }}
    >
      <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        {point.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {point.description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function MetricsSection() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const painRef = useRef<HTMLDivElement>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [painVisible, setPainVisible] = useState(false);

  const observeRef = useCallback(
    (
      ref: React.RefObject<HTMLDivElement | null>,
      setter: (v: boolean) => void
    ) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    },
    []
  );

  useEffect(() => {
    const cleanupMetrics = observeRef(metricsRef, setMetricsVisible);
    const cleanupPain = observeRef(painRef, setPainVisible);
    return () => {
      cleanupMetrics?.();
      cleanupPain?.();
    };
  }, [observeRef]);

  return (
    <section id="metrics" className="relative py-24 overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---- heading ---- */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Key Metrics &{" "}
            <span className="gradient-text">Proof Points</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Real-world results from production deployments across 10,000+
            customers worldwide.
          </p>
        </div>

        {/* ---- metrics grid ---- */}
        <div
          ref={metricsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5"
        >
          {METRICS.map((metric, i) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              isVisible={metricsVisible}
              index={i}
            />
          ))}
        </div>

        {/* ---- pain points ---- */}
        <div className="mt-28">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Customer <span className="gradient-text">Pain Points</span>
            </h3>
            <p className="text-text-secondary max-w-xl mx-auto">
              The critical challenges that drive organizations to deploy
              autonomous cyber defense.
            </p>
          </div>

          <div
            ref={painRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {PAIN_POINTS.map((point, i) => (
              <PainPointCard
                key={point.title}
                point={point}
                isVisible={painVisible}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
