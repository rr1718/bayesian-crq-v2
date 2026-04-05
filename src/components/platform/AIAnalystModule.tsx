"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Brain,
  Search,
  GitMerge,
  FileText,
  Zap,
  Shield,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Play,
  Eye,
  Target,
} from "lucide-react";
import {
  generateInvestigations,
  generateInvestigation,
} from "@/lib/platformData";
import type { Investigation } from "@/lib/platformData";

/* ------------------------------------------------------------------ */
/*  CSS keyframe injection                                             */
/* ------------------------------------------------------------------ */

const STYLE_ID = "ai-analyst-animations";

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes analyst-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes analyst-pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    @keyframes analyst-dot-1 { 0%,20% { opacity:0; } 30%,100% { opacity:1; } }
    @keyframes analyst-dot-2 { 0%,40% { opacity:0; } 50%,100% { opacity:1; } }
    @keyframes analyst-dot-3 { 0%,60% { opacity:0; } 70%,100% { opacity:1; } }
    .analyst-enter { animation: analyst-fade-in 0.4s ease-out both; }
    .analyst-pulse { animation: analyst-pulse 1.5s ease-in-out infinite; }
    .analyst-dot-1 { animation: analyst-dot-1 1.4s ease-in-out infinite; }
    .analyst-dot-2 { animation: analyst-dot-2 1.4s ease-in-out infinite; }
    .analyst-dot-3 { animation: analyst-dot-3 1.4s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const SEV_COLORS: Record<string, string> = {
  critical: "bg-danger text-white",
  high: "bg-warning text-black",
  medium: "bg-accent-blue text-white",
  low: "bg-success text-white",
};

const STATUS_COLORS: Record<string, string> = {
  queued: "bg-text-secondary/20 text-text-secondary",
  in_progress: "bg-accent-blue/20 text-accent-blue",
  completed: "bg-success/20 text-success",
  escalated: "bg-danger/20 text-danger",
};

function formatRelative(d: Date) {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ------------------------------------------------------------------ */
/*  Thinking Dots                                                      */
/* ------------------------------------------------------------------ */

function ThinkingDots() {
  return (
    <span className="inline-flex gap-0.5 ml-1">
      <span className="analyst-dot-1">.</span>
      <span className="analyst-dot-2">.</span>
      <span className="analyst-dot-3">.</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatsBar({ investigations }: { investigations: Investigation[] }) {
  const total = investigations.length;
  const inProgress = investigations.filter((i) => i.status === "in_progress").length;
  const completed = investigations.filter((i) => i.status === "completed").length;
  const escalated = investigations.filter((i) => i.status === "escalated").length;
  const avgTriage =
    investigations.length > 0
      ? Math.round(
          investigations.reduce((s, i) => s + i.triageTimeSeconds, 0) / investigations.length
        )
      : 0;
  const fteSaved =
    investigations.length > 0
      ? (
          investigations.reduce((s, i) => s + i.manualEquivalentMinutes, 0) / 60
        ).toFixed(1)
      : "0.0";

  const stats = [
    { label: "Total Investigations", value: total, icon: FileText, color: "text-accent" },
    { label: "In Progress", value: inProgress, icon: Clock, color: "text-accent-blue" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-success" },
    { label: "Escalated", value: escalated, icon: AlertTriangle, color: "text-danger" },
    { label: "Avg Triage Time", value: `${avgTriage}s`, icon: Zap, color: "text-warning" },
    {
      label: "FTE Equivalent Saved",
      value: `${fteSaved}h`,
      icon: Users,
      color: "text-primary-light",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-surface-light border border-surface-border rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <s.icon size={14} className={s.color} />
            <span className="text-xs text-text-secondary truncate">{s.label}</span>
          </div>
          <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function InvestigationCard({
  inv,
  onClick,
  isActive,
}: {
  inv: Investigation;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
        isActive
          ? "bg-primary/10 border-primary"
          : "bg-surface-light border-surface-border hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-text-secondary font-mono shrink-0">{inv.id}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase shrink-0 ${SEV_COLORS[inv.severity]}`}
          >
            {inv.severity}
          </span>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[inv.status]}`}
        >
          {inv.status.replace("_", " ")}
        </span>
      </div>
      <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2">{inv.title}</h4>
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{formatRelative(inv.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Target size={10} />
          <span>{inv.affectedAssets.length} assets</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {inv.mitreTactics.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary-light"
          >
            {t}
          </span>
        ))}
        {inv.mitreTactics.length > 3 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface text-text-secondary">
            +{inv.mitreTactics.length - 3}
          </span>
        )}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */

function SimulationProgress({ step }: { step: number }) {
  const total = 5;
  const pct = Math.min((step / total) * 100, 100);
  const labels = [
    "Hypothesis Formation",
    "Data Collection",
    "Correlation",
    "Report Generation",
    "Recommended Actions",
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-secondary">
          Investigation Progress — Step {Math.min(step, total)} of {total}
        </span>
        <span className="text-xs font-mono text-accent">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {labels.map((l, i) => (
          <span
            key={l}
            className={`text-[9px] hidden sm:block ${
              i < step
                ? "text-accent"
                : i === step
                ? "text-primary-light"
                : "text-text-secondary/40"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Investigation Viewer                                               */
/* ------------------------------------------------------------------ */

function InvestigationViewer({
  investigation,
  isSimulating,
  simStep,
  executedActions,
  onExecuteAction,
}: {
  investigation: Investigation;
  isSimulating: boolean;
  simStep: number;
  executedActions: Set<number>;
  onExecuteAction: (idx: number) => void;
}) {
  const inv = investigation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-text-secondary font-mono">{inv.id}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${SEV_COLORS[inv.severity]}`}
            >
              {inv.severity}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[inv.status]}`}
            >
              {inv.status.replace("_", " ")}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{inv.title}</h3>
        </div>
        <div className="flex gap-1 shrink-0">
          {inv.aiModels.map((m) => (
            <span
              key={m}
              className="text-[10px] px-2 py-1 rounded bg-primary/20 text-primary-light font-mono border border-primary/30"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {isSimulating && <SimulationProgress step={simStep} />}

      {/* Step 1: Hypothesis */}
      {simStep >= 1 && (
        <div className="analyst-enter bg-surface-light border border-surface-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-primary-light" />
            <h4 className="text-sm font-semibold text-foreground">Hypothesis Formation</h4>
            {isSimulating && simStep === 1 && (
              <span className="text-xs text-primary-light ml-auto">
                Analyzing<ThinkingDots />
              </span>
            )}
            {simStep > 1 && <CheckCircle size={14} className="text-success ml-auto" />}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{inv.hypothesis}</p>
        </div>
      )}

      {/* Step 2: Data Collection */}
      {simStep >= 2 && (
        <div className="analyst-enter bg-surface-light border border-surface-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search size={16} className="text-accent-blue" />
            <h4 className="text-sm font-semibold text-foreground">Data Collection</h4>
            {isSimulating && simStep === 2 && (
              <span className="text-xs text-accent-blue ml-auto">
                Querying sources<ThinkingDots />
              </span>
            )}
            {simStep > 2 && <CheckCircle size={14} className="text-success ml-auto" />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inv.dataSources.map((src) => (
              <div
                key={src}
                className="flex items-center gap-2 text-xs p-2 rounded bg-success/10 text-success transition-all duration-300"
              >
                <CheckCircle size={12} className="text-success" />
                <span>{src}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Correlation */}
      {simStep >= 3 && (
        <div className="analyst-enter bg-surface-light border border-surface-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitMerge size={16} className="text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Correlation Analysis</h4>
            {isSimulating && simStep === 3 && (
              <span className="text-xs text-accent ml-auto">
                Drawing connections<ThinkingDots />
              </span>
            )}
            {simStep > 3 && <CheckCircle size={14} className="text-success ml-auto" />}
          </div>
          <div className="space-y-2">
            {inv.correlations.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs p-2 bg-surface rounded border border-surface-border"
              >
                <span className="font-mono text-accent-blue">{c.from}</span>
                <span className="text-text-secondary">
                  --[<span className="text-warning">{c.relationship}</span>]--&gt;
                </span>
                <span className="font-mono text-accent-blue">{c.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Report */}
      {simStep >= 4 && (
        <div className="analyst-enter bg-surface-light border border-surface-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-warning" />
            <h4 className="text-sm font-semibold text-foreground">Investigation Report</h4>
            {isSimulating && simStep === 4 && (
              <span className="text-xs text-warning ml-auto">
                Generating<ThinkingDots />
              </span>
            )}
            {simStep > 4 && <CheckCircle size={14} className="text-success ml-auto" />}
          </div>

          {/* Executive Summary */}
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Executive Summary
            </h5>
            <p className="text-sm text-foreground/90 leading-relaxed">{inv.executiveSummary}</p>
          </div>

          {/* Timeline */}
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Timeline of Events
            </h5>
            <div className="space-y-1.5">
              {inv.timeline.map((entry, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="font-mono text-accent shrink-0 w-24">{entry.time}</span>
                  <span className="text-foreground/80">{entry.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Affected Assets & Users */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Affected Assets ({inv.affectedAssets.length})
              </h5>
              <div className="flex flex-wrap gap-1">
                {inv.affectedAssets.map((a) => (
                  <span
                    key={a}
                    className="text-[10px] px-2 py-1 rounded bg-danger/10 text-danger font-mono border border-danger/20"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Affected Users ({inv.affectedUsers.length})
              </h5>
              <div className="flex flex-wrap gap-1">
                {inv.affectedUsers.map((u) => (
                  <span
                    key={u}
                    className="text-[10px] px-2 py-1 rounded bg-warning/10 text-warning font-mono border border-warning/20"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Mapping */}
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              MITRE ATT&CK Mapping
            </h5>
            <div className="space-y-1">
              {inv.mitreMapping.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-accent-blue w-20 shrink-0">{m.id}</span>
                  <span className="text-primary-light">{m.tactic}</span>
                  <span className="text-text-secondary/40">|</span>
                  <span className="text-foreground/70">{m.technique}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence & Models */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-accent" />
              <span className="text-xs text-text-secondary">Confidence Score:</span>
              <span className="text-sm font-bold text-accent">{inv.confidenceScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-primary-light" />
              <span className="text-xs text-text-secondary">AI Models:</span>
              {inv.aiModels.map((m) => (
                <span
                  key={m}
                  className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary-light font-mono border border-primary/30"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Recommended Actions */}
      {simStep >= 5 && (
        <div className="analyst-enter bg-surface-light border border-surface-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-danger" />
            <h4 className="text-sm font-semibold text-foreground">Recommended RESPOND Actions</h4>
          </div>
          <div className="space-y-2">
            {inv.recommendedActions.map((a, i) => {
              const executed = executedActions.has(i);
              const priorityColor =
                a.priority === "high"
                  ? "text-danger"
                  : a.priority === "medium"
                  ? "text-warning"
                  : "text-text-secondary";
              const priorityBg =
                a.priority === "high"
                  ? "bg-danger/10"
                  : a.priority === "medium"
                  ? "bg-warning/10"
                  : "bg-text-secondary/10";
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded border transition-all duration-300 ${
                    executed
                      ? "bg-success/10 border-success/30"
                      : "bg-surface border-surface-border"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold shrink-0 ${priorityColor} ${priorityBg}`}
                    >
                      {a.priority}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm text-foreground">{a.action}</span>
                      <span className="text-xs text-text-secondary ml-2">
                        Target: {a.target}
                      </span>
                    </div>
                  </div>
                  {executed ? (
                    <div className="flex items-center gap-1.5 text-success text-xs shrink-0">
                      <CheckCircle size={14} />
                      <span>Executed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onExecuteAction(i)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary hover:bg-primary-light text-white text-xs font-medium transition-colors shrink-0"
                    >
                      <Play size={12} />
                      Execute
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Metrics */}
      {simStep >= 5 && (
        <div className="analyst-enter grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-surface-light border border-accent/20 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-text-secondary mb-1">Triage Time</div>
            <div className="text-2xl font-bold text-accent">{inv.triageTimeSeconds}s</div>
            <div className="text-[10px] text-text-secondary">
              Manual equivalent: {inv.manualEquivalentMinutes} minutes
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-text-secondary mb-1">Analyst Effort Saved</div>
            <div className="text-2xl font-bold text-accent">
              {Math.round(
                ((inv.manualEquivalentMinutes * 60 - inv.triageTimeSeconds) /
                  (inv.manualEquivalentMinutes * 60)) *
                  100
              )}
              %
            </div>
            <div className="text-[10px] text-text-secondary">vs manual investigation</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-text-secondary mb-1">Confidence Score</div>
            <div className="text-2xl font-bold text-primary-light">{inv.confidenceScore}%</div>
            <div className="text-[10px] text-text-secondary">AI-generated assessment</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function AIAnalystModule({ defaultTab }: { defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState<"queue" | "viewer">(
    defaultTab === "viewer" ? "viewer" : "queue"
  );
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedInv, setSelectedInv] = useState<Investigation | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [executedActions, setExecutedActions] = useState<Set<number>>(new Set());
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    ensureStyles();
    setInvestigations(generateInvestigations(8));
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const selectInvestigation = useCallback(
    (inv: Investigation) => {
      clearTimers();
      setSelectedInv(inv);
      setIsSimulating(false);
      setSimStep(5);
      setExecutedActions(new Set());
      setActiveTab("viewer");
    },
    [clearTimers]
  );

  const runNewInvestigation = useCallback(() => {
    clearTimers();
    const newInv = generateInvestigation();
    newInv.status = "in_progress";
    setInvestigations((prev) => [newInv, ...prev]);
    setSelectedInv(newInv);
    setIsSimulating(true);
    setSimStep(0);
    setExecutedActions(new Set());
    setActiveTab("viewer");

    const delays = [1500, 3000, 5000, 7000, 9000];
    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        setSimStep(i + 1);
        if (i === delays.length - 1) {
          setIsSimulating(false);
          setInvestigations((prev) =>
            prev.map((inv) =>
              inv.id === newInv.id ? { ...inv, status: "completed" as const } : inv
            )
          );
        }
      }, delay);
      timersRef.current.push(t);
    });
  }, [clearTimers]);

  const handleExecuteAction = useCallback((idx: number) => {
    setExecutedActions((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Tab Bar */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab("queue")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
            activeTab === "queue"
              ? "bg-surface-light text-accent border border-surface-border border-b-transparent -mb-[13px] pb-[13px]"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          <Shield size={14} />
          Investigation Queue
        </button>
        <button
          onClick={() => setActiveTab("viewer")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
            activeTab === "viewer"
              ? "bg-surface-light text-accent border border-surface-border border-b-transparent -mb-[13px] pb-[13px]"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          <Eye size={14} />
          Investigation Viewer
        </button>
        <div className="flex-1" />
        <button
          onClick={runNewInvestigation}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isSimulating
              ? "bg-surface-light text-text-secondary cursor-not-allowed"
              : "bg-primary hover:bg-primary-light text-white"
          }`}
        >
          <Brain size={14} />
          {isSimulating ? "Investigating..." : "Run New Investigation"}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "queue" && (
        <div>
          <StatsBar investigations={investigations} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {investigations.map((inv) => (
              <InvestigationCard
                key={inv.id}
                inv={inv}
                onClick={() => selectInvestigation(inv)}
                isActive={selectedInv?.id === inv.id}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "viewer" && selectedInv && (
        <InvestigationViewer
          investigation={selectedInv}
          isSimulating={isSimulating}
          simStep={simStep}
          executedActions={executedActions}
          onExecuteAction={handleExecuteAction}
        />
      )}

      {activeTab === "viewer" && !selectedInv && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Brain size={48} className="text-text-secondary/30 mb-4" />
          <h3 className="text-lg font-semibold text-text-secondary mb-2">
            No Investigation Selected
          </h3>
          <p className="text-sm text-text-secondary/60 mb-6 max-w-md">
            Select an investigation from the queue or run a new AI-powered investigation to see the
            full analysis and recommended actions.
          </p>
          <button
            onClick={runNewInvestigation}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-medium transition-colors"
          >
            <Play size={16} />
            Run New Investigation
          </button>
        </div>
      )}
    </div>
  );
}
