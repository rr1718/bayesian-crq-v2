"use client";

import { useState } from "react";
import { AlertTriangle, Check, X, Minus } from "lucide-react";

type Tab = "crowdstrike" | "vectra";

const crowdstrikeRows = [
  {
    dimension: "Primary strength",
    darktrace: "Broad network, OT, IoT, SaaS visibility",
    competitor: "Endpoint security, speed, threat intelligence",
  },
  {
    dimension: "Threat detection",
    darktrace: "Behavioural anomaly (unknown threats)",
    competitor: "Signature + TI feeds (known + behavioural)",
  },
  {
    dimension: "Autonomous response",
    darktrace: "Antigena/RESPOND — fast, adaptive",
    competitor: "SOAR/XDR automation options",
  },
  {
    dimension: "Cloud/SaaS/IoT",
    darktrace: "Unified platform, wide scope",
    competitor: "Add-ons and integrations needed",
  },
  {
    dimension: "OT/ICS environments",
    darktrace: "Native OT module",
    competitor: "Limited",
  },
  {
    dimension: "Best for",
    darktrace: "Hybrid, complex, multi-vector environments",
    competitor: "Large orgs prioritising endpoint control",
  },
];

const vectraRows = [
  {
    dimension: "Platform launch",
    darktrace: "April 2024",
    competitor: "August 2023",
  },
  {
    dimension: "Alert noise reduction",
    darktrace: "AI triage via Cyber AI Analyst",
    competitor: "80%+ via Attack Signal Intelligence",
  },
  {
    dimension: "MITRE ATT&CK coverage",
    darktrace: "—",
    competitor: "90%+ techniques",
  },
  {
    dimension: "Autonomous response",
    darktrace: "Industry-leading Antigena/RESPOND",
    competitor: "Less emphasis",
  },
  {
    dimension: "Baselining period",
    darktrace: "~2 weeks",
    competitor: "Detects from Day 1",
  },
  {
    dimension: "AI prioritisation",
    darktrace: "Entity behavioural scoring",
    competitor: "Focuses on entities (hosts/accounts)",
  },
];

const limitations = [
  {
    title: "Initial noise period",
    description:
      "Darktrace requires approximately two weeks of baselining to learn normal network behaviour. During this period, expect elevated alert volumes and false positives.",
  },
  {
    title: "False positives",
    description:
      "System calls, IP reassignments, and routine administrative actions can trigger false alerts, requiring ongoing tuning and analyst oversight.",
  },
  {
    title: "AI opacity",
    description:
      "Darktrace's detection models operate as a black box — decisions are often difficult to explain or audit, which can be a challenge for compliance-driven environments.",
  },
  {
    title: "Complex setup",
    description:
      "Deployment and ongoing management require skilled security engineering resources. This is not a plug-and-play solution.",
  },
  {
    title: "Cost",
    description:
      "Licensing and deployment costs can be prohibitive for small and mid-sized businesses, particularly at scale.",
  },
  {
    title: "SMB suitability",
    description:
      "The platform is designed for medium-to-large enterprises. Smaller organisations may not have the infrastructure or staff to realise its full value.",
  },
];

function ComparisonTable({
  rows,
  darktraceHeader,
  competitorHeader,
}: {
  rows: { dimension: string; darktrace: string; competitor: string }[];
  darktraceHeader: string;
  competitorHeader: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 border-b border-surface-border text-text-secondary font-medium w-1/4">
              Dimension
            </th>
            <th className="text-left px-4 py-3 border-b border-surface-border font-medium w-[37.5%] bg-primary/10 text-primary">
              {darktraceHeader}
            </th>
            <th className="text-left px-4 py-3 border-b border-surface-border text-text-secondary font-medium w-[37.5%]">
              {competitorHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.dimension}
              className={i % 2 === 0 ? "bg-surface/40" : "bg-surface-light/30"}
            >
              <td className="px-4 py-3 border-b border-surface-border/50 font-medium text-white">
                {row.dimension}
              </td>
              <td className="px-4 py-3 border-b border-surface-border/50 bg-primary/5 text-gray-200">
                {row.darktrace}
              </td>
              <td className="px-4 py-3 border-b border-surface-border/50 text-text-secondary">
                {row.competitor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ComparisonSection() {
  const [activeTab, setActiveTab] = useState<Tab>("crowdstrike");

  return (
    <section id="comparison" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="gradient-text">Competitive Positioning</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-text-secondary text-lg">
            An honest look at how Darktrace ActiveAI stacks up against leading
            alternatives in the market.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab("crowdstrike")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "crowdstrike"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-surface border border-surface-border text-text-secondary hover:text-white hover:border-primary/50"
            }`}
          >
            vs CrowdStrike
          </button>
          <button
            onClick={() => setActiveTab("vectra")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "vectra"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-surface border border-surface-border text-text-secondary hover:text-white hover:border-primary/50"
            }`}
          >
            vs Vectra AI
          </button>
        </div>

        {/* Comparison table card */}
        <div className="card-glow cyber-border rounded-2xl bg-surface/60 backdrop-blur-sm p-6 sm:p-8">
          {activeTab === "crowdstrike" ? (
            <ComparisonTable
              rows={crowdstrikeRows}
              darktraceHeader="Darktrace ActiveAI"
              competitorHeader="CrowdStrike Falcon"
            />
          ) : (
            <ComparisonTable
              rows={vectraRows}
              darktraceHeader="Darktrace"
              competitorHeader="Vectra AI"
            />
          )}
        </div>

        {/* Known Limitations */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Known Limitations
            </h3>
          </div>

          <p className="text-text-secondary mb-8 max-w-3xl">
            No platform is perfect. Transparent risk assessment demands
            acknowledging where Darktrace falls short or introduces operational
            friction.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {limitations.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-surface/60 border border-surface-border p-5 hover:border-yellow-500/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <h4 className="font-semibold text-white text-sm">
                    {item.title}
                  </h4>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
