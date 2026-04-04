"use client";

import {
  Network,
  Mail,
  Monitor,
  Cloud,
  Factory,
  Fingerprint,
  Bot,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ModuleCard {
  name: string;
  slashIndex: number; // position of "/" in name for color split
  icon: LucideIcon;
  description: string;
  tags: string[];
  isNew?: boolean;
}

const MODULES: ModuleCard[] = [
  {
    name: "Darktrace / NETWORK",
    slashIndex: 10,
    icon: Network,
    description:
      "NDR powered by Self-Learning AI that establishes behavioral baselines, delivers autonomous response, and deploys the NEXT agent for full visibility.",
    tags: ["NDR", "Self-Learning AI", "Autonomous Response"],
  },
  {
    name: "Darktrace / EMAIL",
    slashIndex: 10,
    icon: Mail,
    description:
      "AI email security recognized as a Gartner MQ Challenger. Catches 56% of threats that pass other security layers, with Microsoft Teams integration.",
    tags: ["Gartner MQ Challenger", "56% Missed Threats", "Teams"],
  },
  {
    name: "Darktrace / ENDPOINT",
    slashIndex: 10,
    icon: Monitor,
    description:
      "Complements existing EDR by catching threats that evade traditional endpoint tools, including living-off-the-land techniques.",
    tags: ["EDR Complement", "Living-off-the-Land", "Behavioral"],
  },
  {
    name: "Darktrace / CLOUD",
    slashIndex: 10,
    icon: Cloud,
    description:
      "Cloud-native threat detection with automated forensic investigation across multi-cloud environments.",
    tags: ["Multi-Cloud", "Automated Forensics", "Cloud-Native"],
  },
  {
    name: "Darktrace / OT",
    slashIndex: 10,
    icon: Factory,
    description:
      "Purpose-built for OT, ICS, and SCADA environments with MITRE ATT&CK APT mapping and IT/OT convergence support.",
    tags: ["ICS / SCADA", "MITRE ATT&CK", "IT/OT Convergence"],
  },
  {
    name: "Darktrace / IDENTITY",
    slashIndex: 10,
    icon: Fingerprint,
    description:
      "Identity threat detection through behavioral monitoring, catching credential misuse and compromised accounts in real time.",
    tags: ["Behavioral Monitoring", "Credential Misuse", "Real-Time"],
  },
  {
    name: "Darktrace / SECURE AI",
    slashIndex: 10,
    icon: Bot,
    description:
      "AI governance and shadow AI detection with continuous agent security monitoring. Launched February 2026.",
    tags: ["AI Governance", "Shadow AI", "Agent Security"],
    isNew: true,
  },
  {
    name: "Darktrace / Adaptive Human Defense",
    slashIndex: 10,
    icon: GraduationCap,
    description:
      "Personalized security training with per-user phishing simulations that adapt to individual risk profiles. Launched March 2026.",
    tags: ["Personalized Training", "Phishing Simulation", "Per-User Risk"],
    isNew: true,
  },
  {
    name: "ActiveAI Security Portal",
    slashIndex: -1,
    icon: LayoutDashboard,
    description:
      "Unified MSSP and enterprise management portal with a single API surface for orchestration across the full Darktrace stack.",
    tags: ["MSSP / Enterprise", "Unified API", "Orchestration"],
  },
];

function ModuleName({ name, slashIndex }: { name: string; slashIndex: number }) {
  if (slashIndex === -1) {
    return <span className="font-semibold text-white">{name}</span>;
  }

  const before = name.slice(0, slashIndex);
  const slash = "/";
  const after = name.slice(slashIndex + 1);

  return (
    <span className="font-semibold text-white">
      {before}
      <span className="text-accent">{slash}</span>
      {after}
    </span>
  );
}

export default function ProductModulesSection() {
  return (
    <section id="modules" className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="mx-auto max-w-7xl text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
          Full Platform Stack
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
          Product Modules
        </h2>
      </div>

      {/* Module grid */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((mod) => {
          const Icon = mod.icon;

          return (
            <div
              key={mod.name}
              className="group relative rounded-2xl bg-surface border border-surface-border p-6 transition-all duration-300 hover:card-glow hover:border-primary/40 hover:-translate-y-1"
            >
              {/* NEW badge */}
              {mod.isNew && (
                <span className="absolute top-4 right-4 rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent ring-1 ring-accent/30">
                  NEW
                </span>
              )}

              {/* Icon */}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>

              {/* Name */}
              <h3 className="mb-2 text-lg leading-tight">
                <ModuleName name={mod.name} slashIndex={mod.slashIndex} />
              </h3>

              {/* Description */}
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                {mod.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {mod.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-light px-2.5 py-0.5 text-[11px] font-medium text-text-secondary ring-1 ring-surface-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
