"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  GitMerge,
  FileText,
  Zap,
  Brain,
  Users,
  Clock,
  MailCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Investigation pipeline steps                                       */
/* ------------------------------------------------------------------ */

const PIPELINE_STEPS = [
  {
    num: 1,
    title: "Forms Hypothesis",
    icon: Search,
    description: "Generates initial theories from anomalous signals",
  },
  {
    num: 2,
    title: "Pivots Across Enterprise",
    icon: GitMerge,
    description: "Traverses network, endpoint, email & cloud telemetry",
  },
  {
    num: 3,
    title: "Correlates Anomalies",
    icon: Brain,
    description: "Links related deviations into unified incident graphs",
  },
  {
    num: 4,
    title: "Generates Incident Report",
    icon: FileText,
    description: "Produces human-readable narrative with full evidence chain",
  },
  {
    num: 5,
    title: "Prescribes Response",
    icon: Zap,
    description: "Recommends targeted containment & remediation actions",
  },
];

/* ------------------------------------------------------------------ */
/*  Model cards                                                        */
/* ------------------------------------------------------------------ */

const MODEL_CARDS = [
  {
    acronym: "DIGEST",
    fullName:
      "Darktrace Incident Graph Evaluation for Security Threats",
    description:
      "Graph-based incident correlation that maps relationships between anomalous events, building multi-stage attack narratives from raw telemetry.",
    icon: GitMerge,
    accent: "primary" as const,
  },
  {
    acronym: "DEMIST-2",
    fullName:
      "Embedding Model for Investigation of Security Threats v2",
    description:
      "Semantic understanding engine that interprets the meaning behind alerts, enabling natural-language reasoning across disparate data sources.",
    icon: Brain,
    accent: "accent" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Operational impact metrics                                         */
/* ------------------------------------------------------------------ */

const METRICS = [
  {
    value: "92%",
    label: "Triage Time Reduction",
    icon: Clock,
    detail: "Analyst triage overhead nearly eliminated",
  },
  {
    value: "30",
    label: "FTE Equivalent",
    suffix: "up to",
    icon: Users,
    detail: "Full-time-equivalent analyst capacity gained",
  },
  {
    value: "95%",
    label: "Investigations Automated",
    icon: Search,
    detail: "Majority of investigations completed autonomously",
  },
  {
    value: "60%",
    label: "False Positive Reduction",
    icon: MailCheck,
    detail: "Email false positives dramatically reduced",
  },
];

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useCountUp(
  target: number,
  isVisible: boolean,
  duration = 1600,
) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current) return;
    hasRun.current = true;

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return count;
}

/* ------------------------------------------------------------------ */
/*  Intersection-observer visibility hook                              */
/* ------------------------------------------------------------------ */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export default function CyberAIAnalystSection() {
  const pipelineVis = useInView(0.1);
  const metricsVis = useInView(0.15);

  return (
    <section
      id="ai-analyst"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ---- Heading ---- */}
        <div className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Autonomous Investigation
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            Cyber AI Analyst
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            The Agentic Investigation Engine
          </p>
        </div>

        {/* ---- Investigation pipeline ---- */}
        <div ref={pipelineVis.ref} className="mb-20">
          <h3 className="text-center text-xl font-semibold text-white mb-10">
            Investigation Flow
          </h3>

          {/* Desktop horizontal pipeline */}
          <div className="hidden lg:flex items-start justify-center gap-0">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex items-start">
                  {/* Card */}
                  <div
                    className={`
                      relative flex flex-col items-center text-center w-48 transition-all duration-700
                      ${pipelineVis.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                    `}
                    style={{
                      transitionDelay: `${i * 150}ms`,
                    }}
                  >
                    {/* Number badge */}
                    <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center ring-2 ring-primary/30">
                      {step.num}
                    </div>

                    <div className="card-glow cyber-border rounded-xl bg-surface p-5 w-full">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div
                      className={`
                        flex items-center self-center mt-8 px-1 transition-all duration-500
                        ${pipelineVis.visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                      `}
                      style={{ transitionDelay: `${i * 150 + 100}ms` }}
                    >
                      <div className="h-px w-6 bg-gradient-to-r from-primary/60 to-accent/60" />
                      <div className="h-0 w-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-accent/60" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile / tablet vertical pipeline */}
          <div className="lg:hidden flex flex-col items-center gap-4">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`
                      relative w-full max-w-sm transition-all duration-700
                      ${pipelineVis.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                    `}
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    <div className="absolute -top-2 left-3 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center ring-2 ring-primary/30 z-10">
                      {step.num}
                    </div>
                    <div className="card-glow cyber-border rounded-xl bg-surface p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {step.title}
                        </h4>
                        <p className="text-xs text-text-secondary">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="h-6 w-px bg-gradient-to-b from-primary/50 to-accent/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Model cards ---- */}
        <div className="mb-20">
          <h3 className="text-center text-xl font-semibold text-white mb-8">
            Underlying Models
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {MODEL_CARDS.map((model) => {
              const Icon = model.icon;
              const ring =
                model.accent === "primary"
                  ? "border-primary/40 hover:border-primary/70"
                  : "border-accent/40 hover:border-accent/70";
              const iconBg =
                model.accent === "primary"
                  ? "bg-primary/15 text-primary"
                  : "bg-accent/15 text-accent";

              return (
                <div
                  key={model.acronym}
                  className={`card-glow rounded-xl bg-surface border ${ring} transition-colors duration-300 p-6`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {model.acronym}
                      </h4>
                      <p className="text-xs text-text-secondary leading-tight">
                        {model.fullName}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {model.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Key differentiator callout ---- */}
        <div className="mb-20 flex justify-center">
          <div className="relative max-w-2xl w-full rounded-2xl cyber-border bg-gradient-to-r from-primary/10 via-surface to-accent/10 p-px">
            <div className="rounded-2xl bg-surface/95 backdrop-blur px-8 py-6 text-center">
              <Zap className="mx-auto mb-3 h-8 w-8 text-accent animate-pulse" />
              <p className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Investigates{" "}
                <span className="gradient-text">EVERY</span> alert to
                completion
              </p>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Unlike human analysts who must prioritize and triage, the Cyber
                AI Analyst autonomously investigates every single alert --
                eliminating blind spots across your entire digital estate.
              </p>
            </div>
          </div>
        </div>

        {/* ---- Operational impact metrics ---- */}
        <div ref={metricsVis.ref}>
          <h3 className="text-center text-xl font-semibold text-white mb-10">
            Operational Impact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {METRICS.map((m) => (
              <MetricCard
                key={m.label}
                metric={m}
                visible={metricsVis.visible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric card sub-component                                          */
/* ------------------------------------------------------------------ */

function MetricCard({
  metric,
  visible,
}: {
  metric: (typeof METRICS)[number];
  visible: boolean;
}) {
  const Icon = metric.icon;
  const numericValue = parseInt(metric.value, 10);
  const animatedValue = useCountUp(numericValue, visible);
  const isPercent = metric.value.includes("%");

  return (
    <div
      className={`
        card-glow cyber-border rounded-xl bg-surface p-6 text-center transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      <Icon className="mx-auto mb-3 h-6 w-6 text-accent-blue" />

      {"suffix" in metric && metric.suffix && (
        <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
          {metric.suffix}
        </p>
      )}

      <p className="text-5xl font-extrabold gradient-text tabular-nums">
        {animatedValue}
        {isPercent && "%"}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">{metric.label}</p>
      <p className="mt-1 text-xs text-text-secondary">{metric.detail}</p>
    </div>
  );
}
