"use client";

import {
  Brain,
  Network,
  MessageSquare,
  Bot,
  GitBranch,
  Shield,
  Eye,
  Cpu,
} from "lucide-react";

const traditionalPoints = [
  { label: "Supervised Learning", detail: "Requires labeled training data and constant tuning" },
  { label: "Rules-Based Detection", detail: "Static signatures that attackers easily evade" },
  { label: "Reactive Posture", detail: "Responds only after known threats are identified" },
];

const darktracePoints = [
  { label: "Unsupervised Learning", detail: "Learns autonomously without pre-defined labels" },
  { label: "Behavioral Analysis", detail: "Models normal behavior and detects subtle deviations" },
  { label: "Proactive Defense", detail: "Identifies novel threats before damage occurs" },
];

const aiTechniques = [
  {
    icon: Brain,
    title: "Unsupervised Bayesian Learning",
    description:
      "Continuously recalculates probability distributions across thousands of metrics to establish evolving baselines of normal behavior — no training data required.",
    color: "text-primary",
    borderColor: "hover:border-primary",
  },
  {
    icon: Cpu,
    title: "Supervised ML",
    description:
      "Complements unsupervised models with classifiers trained on millions of confirmed threat samples, boosting precision on known attack patterns.",
    color: "text-accent-blue",
    borderColor: "hover:border-accent-blue",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Processing",
    description:
      "Analyzes email tone, syntax, and intent to detect social engineering, spear-phishing, and business email compromise at the semantic level.",
    color: "text-accent",
    borderColor: "hover:border-accent",
  },
  {
    icon: Bot,
    title: "Large Language Models",
    description:
      "Powers Cyber AI Analyst — an autonomous investigator that triages alerts, correlates incidents, and generates human-readable reports in seconds.",
    color: "text-primary-light",
    borderColor: "hover:border-primary-light",
  },
  {
    icon: GitBranch,
    title: "Graph Theory",
    description:
      "Maps relationships between users, devices, and data flows to reveal lateral movement, insider threats, and hidden attack paths across the network.",
    color: "text-accent-blue",
    borderColor: "hover:border-accent-blue",
  },
];

function BehavioralWaveform() {
  // Stylized SVG waveform representing a "Pattern of Life"
  const normalPath =
    "M0,50 Q25,30 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 T450,50 T500,50";
  const anomalyPath =
    "M0,50 Q25,35 50,50 T100,50 T150,50 T200,50 Q225,10 250,50 Q260,80 275,20 Q290,60 300,50 T350,50 T400,50 T450,50 T500,50";

  return (
    <div className="w-full space-y-6">
      {/* Normal pattern */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-text-secondary font-mono">
            Normal Behavioral Pattern
          </span>
        </div>
        <svg
          viewBox="0 0 500 100"
          className="w-full h-16"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="normalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#00d4aa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Baseline band */}
          <rect x="0" y="35" width="500" height="30" fill="normalGrad" rx="4" />
          {/* Waveform */}
          <path
            d={normalPath}
            fill="none"
            stroke="#00d4aa"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Data points */}
          {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((x) => (
            <circle
              key={x}
              cx={x}
              cy={50}
              r="3"
              fill="#00d4aa"
              opacity="0.8"
            />
          ))}
        </svg>
      </div>

      {/* Anomaly pattern */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-3 h-3 rounded-full bg-danger" />
          <span className="text-sm text-text-secondary font-mono">
            Anomalous Deviation Detected
          </span>
        </div>
        <svg
          viewBox="0 0 500 100"
          className="w-full h-16"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="anomalyGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.2" />
              <stop offset="40%" stopColor="#00d4aa" stopOpacity="0.4" />
              <stop offset="45%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="65%" stopColor="#00d4aa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Baseline band */}
          <rect
            x="0"
            y="35"
            width="500"
            height="30"
            fill="anomalyGrad"
            rx="4"
          />
          {/* Anomaly zone highlight */}
          <rect
            x="210"
            y="0"
            width="90"
            height="100"
            fill="#ef4444"
            opacity="0.08"
            rx="4"
          />
          {/* Waveform */}
          <path
            d={anomalyPath}
            fill="none"
            stroke="#00d4aa"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Anomaly spike overlay */}
          <path
            d="M220,50 Q225,10 250,50 Q260,80 275,20 Q290,60 295,50"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Alert marker */}
          <circle cx="255" cy="15" r="8" fill="#ef4444" opacity="0.9" />
          <text
            x="255"
            y="19"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            !
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function AIEngineSection() {
  return (
    <section id="ai-engine" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface/60 text-sm text-text-secondary mb-6">
            <Cpu className="w-4 h-4 text-primary" />
            The Technical Core
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            The Self-Learning{" "}
            <span className="gradient-text">AI Engine</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            An unsupervised machine learning system that forms an evolving
            understanding of every user, device, and connection across your
            digital ecosystem.
          </p>
        </div>

        {/* Traditional vs Darktrace Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {/* Traditional Security */}
          <div className="cyber-border card-glow rounded-xl bg-surface p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-danger/10">
                <Shield className="w-6 h-6 text-danger" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Traditional Security</h3>
                <p className="text-sm text-text-secondary">
                  Legacy approach
                </p>
              </div>
            </div>
            <ul className="space-y-4">
              {traditionalPoints.map((point) => (
                <li
                  key={point.label}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-light/50"
                >
                  <span className="mt-1 w-2 h-2 shrink-0 rounded-full bg-danger/60" />
                  <div>
                    <span className="font-medium text-foreground">
                      {point.label}
                    </span>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {point.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Darktrace AI */}
          <div className="cyber-border card-glow rounded-xl bg-surface p-8 border-accent/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-accent/10">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Darktrace AI</h3>
                <p className="text-sm text-accent">Self-learning approach</p>
              </div>
            </div>
            <ul className="space-y-4">
              {darktracePoints.map((point) => (
                <li
                  key={point.label}
                  className="flex items-start gap-3 p-3 rounded-lg bg-accent/5"
                >
                  <span className="mt-1 w-2 h-2 shrink-0 rounded-full bg-accent" />
                  <div>
                    <span className="font-medium text-foreground">
                      {point.label}
                    </span>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {point.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pattern of Life */}
        <div className="cyber-border card-glow rounded-xl bg-surface p-8 sm:p-10 mb-20">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <Network className="w-4 h-4" />
                Core Concept
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">
                Pattern of Life
              </h3>
              <p className="text-text-secondary leading-relaxed">
                The AI builds a dynamic, multidimensional model of every entity
                in your environment. It tracks thousands of behavioral metrics
                — login times, data volumes, peer groups, protocol usage,
                connection frequency — to form a living baseline that
                continuously evolves.
              </p>
              <p className="text-text-secondary leading-relaxed">
                When any metric deviates from its expected probability
                distribution, the system calculates a threat score in real time.
                No rules. No signatures. Just mathematics.
              </p>
            </div>
            <div className="lg:w-3/5 flex flex-col justify-center">
              <BehavioralWaveform />
            </div>
          </div>
        </div>

        {/* AI Techniques Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Five Pillars of{" "}
              <span className="gradient-text">AI Detection</span>
            </h3>
            <p className="text-text-secondary max-w-xl mx-auto">
              A multi-layered AI architecture where each technique reinforces
              the others to eliminate blind spots.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiTechniques.map((technique) => {
              const Icon = technique.icon;
              return (
                <div
                  key={technique.title}
                  className={`cyber-border card-glow rounded-xl bg-surface p-6 ${technique.borderColor} group`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-surface-light">
                      <Icon
                        className={`w-5 h-5 ${technique.color}`}
                      />
                    </div>
                    <h4 className="font-semibold text-foreground">
                      {technique.title}
                    </h4>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {technique.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nicole Eagan Quote */}
        <blockquote className="relative cyber-border rounded-xl bg-surface p-8 sm:p-10 max-w-3xl mx-auto text-center">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Brain className="w-5 h-5 text-primary inline" />
          </div>
          <p className="text-lg sm:text-xl italic text-foreground leading-relaxed mt-2 mb-6">
            &ldquo;Darktrace is modeled on the human immune system. It learns
            what is normal for every user, device, and network — and detects
            emerging threats that other tools miss.&rdquo;
          </p>
          <footer className="text-text-secondary">
            <cite className="not-italic">
              <span className="font-semibold text-foreground">
                Nicole Eagan
              </span>
              <span className="mx-2 text-surface-border">|</span>
              Former CEO, Darktrace
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
