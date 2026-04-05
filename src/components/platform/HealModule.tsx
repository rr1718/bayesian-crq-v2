"use client";

import { useState, useCallback } from "react";
import { Heart, FileText, Play, CheckCircle, Clock, AlertTriangle, Shield, Target, Download } from "lucide-react";
import { generatePlaybook, generateSimulations, IncidentPlaybook, PlaybookStep, AttackSimulation } from "@/lib/platformData";

const TABS = ["Playbooks", "Simulations", "Reports"] as const;
const INCIDENT_TYPES = ["Ransomware Attack", "Business Email Compromise", "Data Breach - Cloud Storage", "Insider Threat", "DDoS Attack", "Supply Chain Compromise"];
const INCIDENT_SHORT = ["Ransomware Attack", "BEC", "Data Breach - Cloud", "Insider Threat", "DDoS", "Supply Chain"];
const INCIDENT_ICONS = [Shield, FileText, Target, AlertTriangle, Play, AlertTriangle];

const reports = [
  { id: "r1", title: "Ransomware Incident - March 2026", date: "2026-03-15", severity: "critical" as const, duration: "6h 42m",
    summary: "A ransomware attack encrypted 34 endpoints across the finance department via a phishing attachment. The SOC detected the activity within 8 minutes and containment was achieved in 23 minutes. Full recovery was completed from clean backups.",
    timeline: ["08:12 - Phishing email received by Finance VP", "08:14 - Malicious attachment executed", "08:22 - SOC alert triggered on anomalous file encryption", "08:35 - Affected endpoints isolated from network", "09:10 - Ransomware strain identified as LockBit 4.0", "10:30 - Backup restoration initiated", "14:54 - All systems restored and validated"],
    impact: "34 endpoints encrypted, 2 file shares affected, 4 hours of productivity lost for 120 employees. No data exfiltration confirmed. Estimated financial impact: $285,000.",
    actions: ["Deployed endpoint hardening across all finance endpoints", "Updated email filtering rules", "Conducted emergency phishing awareness training", "Implemented application allowlisting"],
    rootCause: "Employee opened macro-enabled document from spoofed vendor email. Email gateway failed to detect the payload due to a zero-day packer.",
    remediation: "Patched email gateway, disabled macros organization-wide, deployed EDR behavioral detection rules for ransomware patterns." },
  { id: "r2", title: "Email Compromise - February 2026", date: "2026-02-20", severity: "high" as const, duration: "3h 15m",
    summary: "A business email compromise targeted the CFO account through credential stuffing. The attacker set up mail forwarding rules to intercept wire transfer approvals. Detected when finance team noticed a duplicate payment request.",
    timeline: ["14:30 - Credential stuffing attack succeeded on CFO account", "14:35 - Mailbox forwarding rule created", "15:10 - Fraudulent wire transfer request sent", "16:45 - Finance team flagged suspicious duplicate request", "17:00 - SOC notified and investigation began", "17:45 - Account secured, forwarding rules removed"],
    impact: "One fraudulent wire transfer of $142,000 initiated but caught before execution. No data loss. 3 internal emails intercepted by attacker.",
    actions: ["Enforced MFA on all executive accounts", "Implemented conditional access policies", "Added wire transfer dual-approval controls"],
    rootCause: "CFO reused credentials from a previously breached personal account. No MFA was configured on the executive email account.",
    remediation: "Mandatory MFA enrollment for all users, password policy updated to require unique credentials, dark web monitoring for executive credential exposure." },
  { id: "r3", title: "Cloud Misconfiguration - January 2026", date: "2026-01-10", severity: "medium" as const, duration: "1h 50m",
    summary: "An S3 bucket containing non-sensitive marketing assets was discovered publicly accessible during a routine CSPM scan. No customer data was exposed but the misconfiguration existed for 12 days.",
    timeline: ["10:00 - CSPM scan flagged public S3 bucket", "10:15 - Cloud security team began investigation", "10:30 - Confirmed bucket contained marketing PDFs only", "11:00 - Public access revoked", "11:50 - Full cloud storage audit completed"],
    impact: "Marketing collateral exposed publicly for 12 days. No customer data, PII, or sensitive information affected. Access logs showed 23 external downloads.",
    actions: ["Implemented S3 Block Public Access at organization level", "Deployed automated remediation for public bucket detection", "Updated IaC templates to enforce private access by default"],
    rootCause: "Developer bypassed Terraform module and created bucket manually via console without applying organization security policies.",
    remediation: "Restricted console access for storage creation, mandatory IaC pipeline for all cloud resources, weekly CSPM compliance reports." },
];

function severityColor(s: string) {
  return s === "critical" ? "bg-red-500/20 text-red-400" : s === "high" ? "bg-orange-500/20 text-orange-400" : s === "medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400";
}
function typeColor(t: string) {
  return t === "automated" ? "bg-emerald-500/20 text-emerald-400" : t === "manual" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400";
}
function statusColor(s: string) {
  return s === "completed" ? "text-emerald-400" : s === "in_progress" || s === "running" ? "text-blue-400" : s === "failed" ? "text-red-400" : "text-text-secondary";
}
function grade(score: number) {
  return score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
}
function gradeColor(score: number) {
  return score >= 80 ? "text-emerald-400" : score >= 60 ? "text-yellow-400" : "text-red-400";
}

export default function HealModule({ defaultTab }: { defaultTab?: string }) {
  const initialTab = TABS.find((t) => t.toLowerCase() === defaultTab?.toLowerCase()) || "Playbooks";
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>(initialTab);
  const [playbook, setPlaybook] = useState<IncidentPlaybook | null>(null);
  const [steps, setSteps] = useState<PlaybookStep[]>([]);
  const [executing, setExecuting] = useState(false);
  const [expandedSim, setExpandedSim] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const loadPlaybook = (idx: number) => {
    const pb = generatePlaybook(INCIDENT_TYPES[idx]);
    setPlaybook(pb);
    setSteps(pb.steps.map((s) => ({ ...s, status: "pending" })));
    setExecuting(false);
  };

  const executePlaybook = useCallback(() => {
    if (executing) return;
    setExecuting(true);
    setSteps((prev) => prev.map((s) => ({ ...s, status: "pending" })));
    const run = (i: number) => {
      if (i >= steps.length) { setExecuting(false); return; }
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "in_progress" } : s));
      setTimeout(() => {
        setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "completed" } : s));
        run(i + 1);
      }, 1000);
    };
    run(0);
  }, [executing, steps.length]);

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progress = steps.length ? Math.round((completedCount / steps.length) * 100) : 0;
  const simulations = generateSimulations();
  const report = reports.find((r) => r.id === selectedReport);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold">HEAL Module</h2>
      </div>
      <div className="flex gap-2 border-b border-surface-border pb-2">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${activeTab === tab ? "bg-primary text-white" : "text-text-secondary hover:text-white"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Playbooks" && !playbook && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INCIDENT_SHORT.map((name, i) => {
            const Icon = INCIDENT_ICONS[i];
            return (
              <button key={name} onClick={() => loadPlaybook(i)} className="p-6 bg-surface-light border border-surface-border rounded-lg hover:border-primary/50 transition-all text-left group">
                <Icon className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">{name}</h3>
                <p className="text-sm text-text-secondary">Click to load response playbook</p>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "Playbooks" && playbook && (
        <div className="space-y-4">
          <button onClick={() => { setPlaybook(null); setExecuting(false); }} className="text-sm text-text-secondary hover:text-white">&larr; Back to incident types</button>
          <div className="bg-surface-light border border-surface-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{playbook.title}</h3>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColor(playbook.priority)}`}>{playbook.priority.toUpperCase()}</span>
                  <span className="flex items-center gap-1 text-xs text-text-secondary"><Clock className="w-3 h-3" />{playbook.estimatedRecovery}</span>
                </div>
              </div>
              <div className="flex gap-3 text-xs text-text-secondary">
                <span>{steps.filter((s) => s.type === "automated").length} automated</span>
                <span>{steps.filter((s) => s.type === "manual").length} manual</span>
                <span>{steps.filter((s) => s.type === "approval").length} approval</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-text-secondary mb-1"><span>Progress</span><span>{progress}%</span></div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden"><div className="h-full bg-accent transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-3 p-3 bg-surface rounded-lg text-sm">
                  <span className="text-text-secondary w-6 text-center">{step.order}</span>
                  <span className="flex-1 text-white">{step.action}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColor(step.type)}`}>{step.type}</span>
                  <span className={`text-xs font-medium w-20 text-center ${statusColor(step.status)}`}>
                    {step.status === "completed" ? <CheckCircle className="w-4 h-4 inline" /> : step.status === "in_progress" ? <span className="animate-pulse">Running...</span> : step.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-text-secondary w-16 text-right">{step.estimatedTime}</span>
                  <span className="text-xs text-text-secondary w-28 text-right truncate">{step.assignee}</span>
                </div>
              ))}
            </div>
            <button onClick={executePlaybook} disabled={executing || progress === 100} className="px-6 py-2 bg-primary hover:bg-primary/80 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />{executing ? "Executing..." : progress === 100 ? "Completed" : "Execute Playbook"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "Simulations" && (
        <div className="space-y-4">
          {simulations.map((sim) => {
            const stagesCompleted = sim.stages.filter((s) => s.status === "completed").length;
            const expanded = expandedSim === sim.id;
            return (
              <div key={sim.id} className="bg-surface-light border border-surface-border rounded-lg overflow-hidden">
                <button onClick={() => setExpandedSim(expanded ? null : sim.id)} className="w-full p-5 text-left flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{sim.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${sim.type === "red_team" ? "bg-red-500/20 text-red-400" : sim.type === "purple_team" ? "bg-purple-500/20 text-purple-400" : sim.type === "tabletop" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}>{sim.type.replace("_", " ")}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${sim.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : sim.status === "running" ? "bg-blue-500/20 text-blue-400 animate-pulse" : sim.status === "scheduled" ? "bg-gray-500/20 text-gray-400" : "bg-red-500/20 text-red-400"}`}>{sim.status}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-text-secondary">
                      <span>Stages: {stagesCompleted}/{sim.stages.length}</span>
                      <span>Vector: {sim.attackVector}</span>
                      {sim.score > 0 && <span>Score: <span className={`font-bold ${gradeColor(sim.score)}`}>{sim.score} ({grade(sim.score)})</span></span>}
                    </div>
                  </div>
                  <span className="text-text-secondary text-sm">{expanded ? "▲" : "▼"}</span>
                </button>
                {expanded && (
                  <div className="px-5 pb-5 border-t border-surface-border pt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Stages</h4>
                      <div className="space-y-1">
                        {sim.stages.map((stage) => (
                          <div key={stage.id} className="flex items-center gap-3 text-sm p-2 bg-surface rounded">
                            <span className={statusColor(stage.status)}>{stage.status === "completed" ? <CheckCircle className="w-4 h-4" /> : stage.status === "running" ? <span className="animate-pulse">●</span> : <Clock className="w-4 h-4" />}</span>
                            <span className="text-white flex-1">{stage.name}</span>
                            {stage.result && <span className="text-xs text-text-secondary max-w-xs truncate">{stage.result}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                    {sim.findings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Findings</h4>
                        <div className="space-y-2">
                          {sim.findings.map((f) => (
                            <div key={f.id} className="p-3 bg-surface rounded text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColor(f.severity)}`}>{f.severity}</span>
                                <span className="text-white">{f.description}</span>
                              </div>
                              <p className="text-xs text-text-secondary ml-1">Recommendation: {f.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "Reports" && !selectedReport && (
        <div className="space-y-4">
          {reports.map((r) => (
            <button key={r.id} onClick={() => setSelectedReport(r.id)} className="w-full p-5 bg-surface-light border border-surface-border rounded-lg text-left hover:border-primary/50 transition-all flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white mb-1">{r.title}</h3>
                <div className="flex gap-3 text-xs text-text-secondary">
                  <span>{r.date}</span>
                  <span className={`px-2 py-0.5 rounded font-medium ${severityColor(r.severity)}`}>{r.severity}</span>
                  <span>Duration: {r.duration}</span>
                </div>
              </div>
              <FileText className="w-5 h-5 text-text-secondary" />
            </button>
          ))}
        </div>
      )}

      {activeTab === "Reports" && report && (
        <div className="space-y-4">
          <button onClick={() => setSelectedReport(null)} className="text-sm text-text-secondary hover:text-white">&larr; Back to reports</button>
          <div className="bg-surface-light border border-surface-border rounded-lg p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{report.title}</h3>
                <div className="flex gap-3 mt-2 text-xs text-text-secondary">
                  <span>{report.date}</span>
                  <span className={`px-2 py-0.5 rounded font-medium ${severityColor(report.severity)}`}>{report.severity}</span>
                  <span>Duration: {report.duration}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />Export PDF
              </button>
            </div>
            {[["Executive Summary", report.summary], ["Impact Assessment", report.impact], ["Root Cause", report.rootCause], ["Remediation", report.remediation]].map(([title, content]) => (
              <div key={title}><h4 className="text-sm font-semibold text-accent mb-2">{title}</h4><p className="text-sm text-text-secondary leading-relaxed">{content}</p></div>
            ))}
            <div>
              <h4 className="text-sm font-semibold text-accent mb-2">Timeline</h4>
              <div className="space-y-1">{report.timeline.map((t, i) => <div key={i} className="text-sm text-text-secondary flex gap-3"><Clock className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" />{t}</div>)}</div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-accent mb-2">Actions Taken</h4>
              <ul className="space-y-1">{report.actions.map((a, i) => <li key={i} className="text-sm text-text-secondary flex gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />{a}</li>)}</ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
