"use client";

import { useState } from "react";
import { ShieldCheck, Eye, Zap, Heart, ChevronRight, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Stage data                                                         */
/* ------------------------------------------------------------------ */

interface Stage {
  id: string;
  label: string;
  color: string;        // Tailwind‑compatible hex
  ringClass: string;    // border / text utilities
  bgClass: string;      // subtle bg for cards
  glowClass: string;    // glow ring on the loop node
  icon: React.ElementType;
  tagline: string;
  capabilities: string[];
  detail: React.ReactNode;
}

const STAGES: Stage[] = [
  {
    id: "prevent",
    label: "PREVENT",
    color: "#3b82f6",
    ringClass: "border-accent-blue text-accent-blue",
    bgClass: "bg-accent-blue/10",
    glowClass: "shadow-[0_0_24px_rgba(59,130,246,0.35)]",
    icon: ShieldCheck,
    tagline: "Proactive attack surface hardening",
    capabilities: [
      "Attack Surface Management — 30‑50% more assets discovered",
      "Firewall Rule Analysis & optimization",
      "Attack Path Finder across hybrid environments",
      "MITRE ATT&CK mapping for full coverage visibility",
      "Simulated attacks to validate defenses",
      "Continuous Threat Exposure Management (CTEM) workflows",
    ],
    detail: (
      <p className="text-text-secondary text-sm leading-relaxed">
        Darktrace continuously maps your digital estate — cloud, SaaS, OT, email
        and beyond — uncovering 30‑50% more assets than traditional tools. AI‑driven
        attack‑path modeling and simulated attacks validate your security posture
        before adversaries can exploit gaps, while automated CTEM workflows keep
        your defenses aligned with the latest threat intelligence.
      </p>
    ),
  },
  {
    id: "detect",
    label: "DETECT",
    color: "#8b5cf6",
    ringClass: "border-primary text-primary",
    bgClass: "bg-primary/10",
    glowClass: "shadow-[0_0_24px_rgba(139,92,246,0.35)]",
    icon: Eye,
    tagline: "Self‑learning threat detection across every domain",
    capabilities: [
      "Network Detection & Response (NDR)",
      "Email security with behavioral AI",
      "Cloud & SaaS anomaly detection",
      "Endpoint threat identification",
      "Identity‑based attack detection",
      "OT / ICS environment monitoring",
    ],
    detail: (
      <div className="space-y-3">
        <p className="text-text-secondary text-sm leading-relaxed">
          Darktrace&apos;s Self‑Learning AI builds a bespoke model of normal
          behavior for every user and device, then detects subtle deviations in
          real time — no signatures or rules required.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-text-secondary">
                <th className="py-2 pr-4 font-medium">Domain</th>
                <th className="py-2 pr-4 font-medium">Example Detection</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              {[
                ["Network", "Unusual internal lateral movement"],
                ["Email", "Novel social‑engineering payload"],
                ["Cloud", "Anomalous API call sequence"],
                ["Endpoint", "Rare process execution chain"],
                ["Identity", "Credential misuse across services"],
                ["OT", "Unexpected PLC command deviation"],
              ].map(([domain, example]) => (
                <tr key={domain} className="border-b border-surface-border/50">
                  <td className="py-1.5 pr-4 font-medium text-white/80">{domain}</td>
                  <td className="py-1.5 pr-4">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "respond",
    label: "RESPOND",
    color: "#ef4444",
    ringClass: "border-danger text-danger",
    bgClass: "bg-danger/10",
    glowClass: "shadow-[0_0_24px_rgba(239,68,68,0.35)]",
    icon: Zap,
    tagline: "Autonomous containment in seconds",
    capabilities: [
      "Autonomous threat containment within seconds",
      "Proportionate response — surgical, not disruptive",
      "Pattern‑of‑life enforcement for precision",
      "24/7 always‑on operation with zero fatigue",
      "Configurable autonomy levels per environment",
    ],
    detail: (
      <p className="text-text-secondary text-sm leading-relaxed">
        Antigena takes proportionate, autonomous action — enforcing a
        device&apos;s &quot;pattern of life&quot; rather than blunt blocking.
        Responses are surgical: just enough to neutralize the threat while the
        business continues operating. Autonomy levels are fully configurable,
        from human‑confirmation mode to fully autonomous 24/7.
      </p>
    ),
  },
  {
    id: "heal",
    label: "HEAL",
    color: "#10b981",
    ringClass: "border-success text-success",
    bgClass: "bg-success/10",
    glowClass: "shadow-[0_0_24px_rgba(16,185,129,0.35)]",
    icon: Heart,
    tagline: "Simulate, plan, recover, report — automatically",
    capabilities: [
      "Attack Simulation to stress‑test readiness",
      "AI‑Generated Playbooks tailored to your environment",
      "Automated Recovery orchestration",
      "Full Incident Reporting with timeline reconstruction",
    ],
    detail: (
      <p className="text-text-secondary text-sm leading-relaxed">
        HEAL closes the loop by simulating real‑world attacks against your live
        environment, auto‑generating response playbooks, orchestrating recovery
        actions, and producing comprehensive incident reports — turning every
        event into institutional knowledge that strengthens future defense.
      </p>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Loop diagram node                                                  */
/* ------------------------------------------------------------------ */

function LoopNode({
  stage,
  position,
  isActive,
  onClick,
}: {
  stage: Stage;
  position: { top: string; left: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = stage.icon;

  return (
    <button
      onClick={onClick}
      aria-label={`Select ${stage.label} stage`}
      className={[
        "absolute z-10 flex flex-col items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group cursor-pointer",
      ].join(" ")}
      style={{ top: position.top, left: position.left }}
    >
      {/* Icon circle */}
      <span
        className={[
          "flex items-center justify-center rounded-full border-2 transition-all duration-300",
          stage.ringClass,
          isActive
            ? `${stage.glowClass} scale-110 ${stage.bgClass}`
            : "bg-surface hover:scale-105",
          "w-16 h-16 md:w-20 md:h-20",
        ].join(" ")}
      >
        <Icon className="w-7 h-7 md:w-8 md:h-8" />
      </span>

      {/* Label */}
      <span
        className={[
          "text-xs md:text-sm font-bold tracking-widest transition-colors duration-300",
          isActive ? "text-white" : "text-text-secondary group-hover:text-white",
        ].join(" ")}
      >
        {stage.label}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG connector arrows                                               */
/* ------------------------------------------------------------------ */

function LoopConnectors({ activeIdx }: { activeIdx: number }) {
  /*  Four arcs connecting the nodes arranged in a circle.
      We draw them as quadratic curves between node center positions.       */
  const pts = [
    { x: 50, y: 8 },   // PREVENT  (top)
    { x: 92, y: 50 },  // DETECT   (right)
    { x: 50, y: 92 },  // RESPOND  (bottom)
    { x: 8, y: 50 },   // HEAL     (left)
  ];

  const colors = STAGES.map((s) => s.color);

  const arcs = pts.map((from, i) => {
    const to = pts[(i + 1) % 4];
    // Control point pushed outward for a nice curve
    const cx = (from.x + to.x) / 2 + (50 - (from.x + to.x) / 2) * 0.35;
    const cy = (from.y + to.y) / 2 + (50 - (from.y + to.y) / 2) * 0.35;

    const isActive = i === activeIdx || (i + 1) % 4 === activeIdx;

    return (
      <g key={i}>
        <path
          d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
          fill="none"
          stroke={colors[i]}
          strokeWidth={isActive ? 1.8 : 0.8}
          strokeDasharray={isActive ? "none" : "4 3"}
          opacity={isActive ? 0.8 : 0.3}
          className="transition-all duration-500"
        />
        {/* Arrowhead at midpoint */}
        <circle
          cx={(from.x + to.x) / 2 + (cx - (from.x + to.x) / 2) * 0.5}
          cy={(from.y + to.y) / 2 + (cy - (from.y + to.y) / 2) * 0.5}
          r={isActive ? 2.2 : 1.5}
          fill={colors[i]}
          opacity={isActive ? 0.9 : 0.4}
          className="transition-all duration-500"
        />
      </g>
    );
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {/* Center label */}
      <text
        x="50"
        y="48"
        textAnchor="middle"
        className="fill-text-secondary text-[3.2px] font-semibold tracking-wider uppercase"
      >
        Cyber AI
      </text>
      <text
        x="50"
        y="54"
        textAnchor="middle"
        className="fill-text-secondary text-[3.2px] font-semibold tracking-wider uppercase"
      >
        Loop
      </text>
      {arcs}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail card                                                        */
/* ------------------------------------------------------------------ */

function StageCard({ stage, isActive, onClick }: { stage: Stage; isActive: boolean; onClick: () => void }) {
  const Icon = stage.icon;

  return (
    <div
      className={[
        "rounded-xl border transition-all duration-300 overflow-hidden",
        isActive
          ? `border-transparent ${stage.glowClass} cyber-border`
          : "border-surface-border hover:border-surface-border/80",
        "bg-surface",
      ].join(" ")}
    >
      {/* Header — always visible */}
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer"
        aria-expanded={isActive}
      >
        <span
          className={[
            "flex items-center justify-center shrink-0 rounded-lg w-10 h-10 border transition-colors duration-300",
            stage.ringClass,
            isActive ? stage.bgClass : "bg-transparent",
          ].join(" ")}
        >
          <Icon className="w-5 h-5" />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold tracking-widest"
              style={{ color: stage.color }}
            >
              {stage.label}
            </span>
            <span className="hidden sm:inline text-text-secondary text-xs">
              — {stage.tagline}
            </span>
          </div>
        </div>

        <ChevronRight
          className={[
            "w-5 h-5 shrink-0 text-text-secondary transition-transform duration-300",
            isActive ? "rotate-90" : "",
          ].join(" ")}
        />
      </button>

      {/* Expandable body */}
      <div
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 space-y-4">
            {/* Top colored bar */}
            <div
              className="h-px w-full opacity-30"
              style={{ backgroundColor: stage.color }}
            />

            {/* Capabilities list */}
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {stage.capabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2 text-sm text-text-secondary">
                  <ArrowRight
                    className="w-3.5 h-3.5 mt-0.5 shrink-0"
                    style={{ color: stage.color }}
                  />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>

            {/* Extended detail */}
            <div className="pt-1">{stage.detail}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

const NODE_POSITIONS: { top: string; left: string }[] = [
  { top: "6%", left: "50%" },    // PREVENT  – top
  { top: "50%", left: "94%" },   // DETECT   – right
  { top: "94%", left: "50%" },   // RESPOND  – bottom
  { top: "50%", left: "6%" },    // HEAL     – left
];

export default function CyberAILoopSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section
      id="cyber-ai-loop"
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Subtle radial glow background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(108,59,245,0.15), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ---- Heading ---- */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
            The Cyber AI Loop
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base md:text-lg">
            Four interconnected stages of autonomous defense
          </p>
        </div>

        {/* ---- Loop diagram ---- */}
        <div className="relative mx-auto mb-14 md:mb-20 w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px]">
          {/* Dashed orbit ring */}
          <div
            className="absolute inset-[15%] rounded-full border border-dashed border-surface-border opacity-40"
            aria-hidden="true"
          />

          {/* SVG connectors */}
          <LoopConnectors activeIdx={activeIdx} />

          {/* Stage nodes */}
          {STAGES.map((stage, i) => (
            <LoopNode
              key={stage.id}
              stage={stage}
              position={NODE_POSITIONS[i]}
              isActive={i === activeIdx}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>

        {/* ---- Stage detail cards ---- */}
        <div className="space-y-3">
          {STAGES.map((stage, i) => (
            <StageCard
              key={stage.id}
              stage={stage}
              isActive={i === activeIdx}
              onClick={() => setActiveIdx(i === activeIdx ? i : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
