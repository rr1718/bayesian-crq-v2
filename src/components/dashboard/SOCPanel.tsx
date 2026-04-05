"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bot,
  User,
  CheckCircle,
  Shield,
  Zap,
} from "lucide-react";
import { generateSOCAlert, generateThreatEvent } from "@/lib/sampleData";
import type { SOCAlert } from "@/lib/sampleData";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RespondAction {
  id: string;
  timestamp: Date;
  action: string;
  target: string;
  confidence: number;
  type: "isolate" | "block" | "enforce" | "quarantine";
}

interface Analyst {
  name: string;
  role: string;
  initials: string;
  status: "online" | "away" | "investigating";
  task: string;
  alertsHandled: number;
}

/* ------------------------------------------------------------------ */
/*  CSS keyframe injection (runs once)                                 */
/* ------------------------------------------------------------------ */

const STYLE_ID = "soc-panel-animations";

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes soc-slide-in {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes soc-fade-out {
      from { opacity: 1; max-height: 60px; }
      to   { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
    }
    @keyframes soc-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes soc-pulse-dot {
      0%, 100% { opacity: .45; }
      50% { opacity: 1; }
    }
    .soc-enter  { animation: soc-slide-in .35s ease-out both; }
    .soc-exit   { animation: soc-fade-out .6s ease-in both; }
    .soc-spin   { animation: soc-spin .8s linear infinite; }
    .soc-pulse  { animation: soc-pulse-dot 2s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

const ACTION_TYPES: RespondAction["type"][] = [
  "isolate",
  "block",
  "enforce",
  "quarantine",
];

const ACTION_DESCRIPTIONS: Record<RespondAction["type"], string[]> = {
  isolate: [
    "Isolated endpoint from network segment",
    "Quarantine-isolated host pending investigation",
    "Emergency isolation of compromised server",
  ],
  block: [
    "Blocked outbound C2 connection at firewall",
    "Blocked malicious IP at perimeter",
    "Blocked lateral movement on VLAN boundary",
  ],
  enforce: [
    "Enforced MFA on compromised account",
    "Enforced security policy update on endpoint",
    "Enforced network segmentation rule",
  ],
  quarantine: [
    "Quarantined suspicious email attachment",
    "Quarantined infected file on shared drive",
    "Quarantined malicious process in sandbox",
  ],
};

const DEVICES = [
  "DC-PROD-01",
  "WEB-SVR-03",
  "WKS-FIN-042",
  "WKS-ENG-017",
  "FW-EDGE-01",
  "MAIL-GW-01",
  "VPN-CONC-01",
  "OT-PLC-07",
];

const ACTION_COLORS: Record<RespondAction["type"], string> = {
  isolate: "bg-danger",
  block: "bg-warning",
  enforce: "bg-accent-blue",
  quarantine: "bg-primary",
};

const ACTION_BORDER_COLORS: Record<RespondAction["type"], string> = {
  isolate: "border-danger/40",
  block: "border-warning/40",
  enforce: "border-accent-blue/40",
  quarantine: "border-primary-light/40",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-danger text-white",
  high: "bg-warning text-black",
  medium: "bg-accent-blue text-white",
  low: "bg-success text-white",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-accent-blue/15 text-accent-blue border border-accent-blue/30",
  investigating:
    "bg-warning/15 text-warning border border-warning/30",
  escalated: "bg-danger/15 text-danger border border-danger/30",
  resolved: "bg-success/15 text-success border border-success/30",
};

const ANALYST_TASKS = [
  "Reviewing phishing campaign IOCs",
  "Triaging endpoint alert cluster",
  "Investigating lateral movement",
  "Escalating insider threat case",
  "Correlating cloud audit logs",
  "Monitoring OT network anomaly",
  "Writing incident report",
  "On break",
  "Reviewing Darktrace findings",
  "Tuning detection rules",
];

function generateAction(id: number): RespondAction {
  const type = ACTION_TYPES[Math.floor(Math.random() * ACTION_TYPES.length)];
  const descs = ACTION_DESCRIPTIONS[type];
  return {
    id: `RSP-${String(id).padStart(5, "0")}`,
    timestamp: new Date(),
    action: descs[Math.floor(Math.random() * descs.length)],
    target: DEVICES[Math.floor(Math.random() * DEVICES.length)],
    confidence: Math.round((75 + Math.random() * 25) * 10) / 10,
    type,
  };
}

/* ------------------------------------------------------------------ */
/*  Severity badge                                                     */
/* ------------------------------------------------------------------ */

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${SEVERITY_COLORS[severity] ?? "bg-surface-light text-text-secondary"}`}
    >
      {severity}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function SOCPanel({ fullWidth }: { fullWidth?: boolean } = {}) {
  /* ---------- state ---------- */
  const [alerts, setAlerts] = useState<SOCAlert[]>([]);
  const [fadingIds, setFadingIds] = useState<Set<string>>(new Set());
  const [actions, setActions] = useState<RespondAction[]>([]);
  const [analysts, setAnalysts] = useState<Analyst[]>([
    {
      name: "J. Chen",
      role: "Lead",
      initials: "JC",
      status: "online",
      task: "Overseeing alert triage pipeline",
      alertsHandled: 47,
    },
    {
      name: "S. Patel",
      role: "Analyst",
      initials: "SP",
      status: "investigating",
      task: "Investigating lateral movement",
      alertsHandled: 32,
    },
    {
      name: "M. Torres",
      role: "Analyst",
      initials: "MT",
      status: "online",
      task: "Reviewing phishing campaign IOCs",
      alertsHandled: 28,
    },
    {
      name: "A. Kim",
      role: "Junior",
      initials: "AK",
      status: "away",
      task: "On break",
      alertsHandled: 14,
    },
  ]);

  const actionCounter = useRef(0);

  /* ---------- derived ---------- */
  const totalAlerts = alerts.length;
  const resolvedByAI = alerts.filter(
    (a) => a.status === "resolved" && a.aiTriaged,
  ).length;
  const resolvedPct =
    totalAlerts > 0 ? ((resolvedByAI / totalAlerts) * 100).toFixed(1) : "0";

  /* ---------- seed initial alerts ---------- */
  useEffect(() => {
    ensureStyles();
    const initial: SOCAlert[] = [];
    for (let i = 0; i < 10; i++) initial.push(generateSOCAlert());
    setAlerts(initial);

    const initialActions: RespondAction[] = [];
    for (let i = 0; i < 4; i++) {
      actionCounter.current++;
      initialActions.push(generateAction(actionCounter.current));
    }
    setActions(initialActions);
  }, []);

  /* ---------- add new alerts every 4-6s ---------- */
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function schedule() {
      timeout = setTimeout(
        () => {
          const newAlert = generateSOCAlert();
          setAlerts((prev) => [newAlert, ...prev]);
          schedule();
        },
        randomBetween(4000, 6000),
      );
    }
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  /* ---------- resolve / fade-out old resolved alerts ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => {
        const resolved = prev.filter(
          (a) => a.status === "resolved" && !fadingIds.has(a.id),
        );
        if (resolved.length > 0) {
          // pick a random resolved alert to start fading
          const pick = resolved[Math.floor(Math.random() * resolved.length)];
          setFadingIds((f) => new Set(f).add(pick.id));
          // remove after animation
          setTimeout(() => {
            setAlerts((cur) => cur.filter((a) => a.id !== pick.id));
            setFadingIds((f) => {
              const next = new Set(f);
              next.delete(pick.id);
              return next;
            });
          }, 650);
        }
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [fadingIds]);

  /* ---------- add RESPOND actions every 5-8s ---------- */
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function schedule() {
      timeout = setTimeout(
        () => {
          actionCounter.current++;
          const a = generateAction(actionCounter.current);
          setActions((prev) => [a, ...prev].slice(0, 8));
          schedule();
        },
        randomBetween(5000, 8000),
      );
    }
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  /* ---------- update analyst statuses occasionally ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysts((prev) =>
        prev.map((a) => {
          if (Math.random() > 0.3) return a; // only sometimes
          const statuses: Analyst["status"][] = [
            "online",
            "away",
            "investigating",
          ];
          const newStatus =
            statuses[Math.floor(Math.random() * statuses.length)];
          const newTask =
            ANALYST_TASKS[Math.floor(Math.random() * ANALYST_TASKS.length)];
          return {
            ...a,
            status: newStatus,
            task: newTask,
            alertsHandled:
              newStatus !== "away"
                ? a.alertsHandled + Math.floor(Math.random() * 3)
                : a.alertsHandled,
          };
        }),
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- analyst status UI helpers ---------- */
  const statusDotColor: Record<Analyst["status"], string> = {
    online: "bg-success",
    away: "bg-text-secondary",
    investigating: "bg-warning",
  };

  const statusLabel: Record<Analyst["status"], string> = {
    online: "Online",
    away: "Away",
    investigating: "Investigating",
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* ==============  AI Analyst Investigation Queue  ============== */}
      <div className="lg:col-span-2">
        <div className="card-glow cyber-border rounded-xl bg-surface p-5">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold tracking-wide text-foreground">
                AI Analyst Investigation Queue
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-surface-light px-3 py-1.5 text-xs">
              <CheckCircle className="h-3.5 w-3.5 text-success" />
              <span className="text-text-secondary">
                <span className="font-bold text-success">{resolvedByAI}</span>{" "}
                of{" "}
                <span className="font-bold text-foreground">{totalAlerts}</span>{" "}
                alerts auto-resolved by AI Analyst (
                <span className="text-accent">{resolvedPct}%</span>)
              </span>
            </div>
          </div>

          {/* Table header */}
          <div className="mb-1 grid grid-cols-[60px_52px_1fr_80px_72px_60px_100px_80px] gap-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
            <span>ID</span>
            <span>Sev</span>
            <span>Title</span>
            <span>Domain</span>
            <span>Time</span>
            <span>AI</span>
            <span>Verdict</span>
            <span>Status</span>
          </div>

          {/* Rows */}
          <div className="max-h-[420px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`grid grid-cols-[60px_52px_1fr_80px_72px_60px_100px_80px] items-center gap-2 rounded-lg border border-transparent px-2 py-2 text-xs transition-colors hover:border-surface-border hover:bg-surface-light/50 ${
                  fadingIds.has(alert.id) ? "soc-exit" : "soc-enter"
                }`}
              >
                {/* ID */}
                <span className="font-mono text-text-secondary">
                  {alert.id}
                </span>

                {/* Severity */}
                <SeverityBadge severity={alert.severity} />

                {/* Title */}
                <span className="truncate text-foreground" title={alert.title}>
                  {alert.title}
                </span>

                {/* Domain */}
                <span className="truncate text-text-secondary capitalize">
                  {alert.domain}
                </span>

                {/* Timestamp */}
                <span className="font-mono text-text-secondary">
                  {formatTime(alert.timestamp)}
                </span>

                {/* AI triage */}
                <span className="flex justify-center">
                  {alert.aiTriaged ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-text-secondary border-t-accent soc-spin" />
                  )}
                </span>

                {/* Verdict */}
                <span
                  className="truncate text-[10px] text-text-secondary"
                  title={alert.aiVerdict}
                >
                  {alert.aiVerdict}
                </span>

                {/* Status */}
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-center text-[10px] font-semibold capitalize ${STATUS_COLORS[alert.status] ?? ""}`}
                >
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==============  Right column  ============== */}
      <div className="flex flex-col gap-5">
        {/* ----------  RESPOND Actions Log  ---------- */}
        <div className="card-glow cyber-border rounded-xl bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            <h3 className="text-sm font-semibold tracking-wide text-foreground">
              RESPOND Actions Log
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {actions.map((a, i) => (
              <div
                key={a.id}
                className={`soc-enter rounded-lg border bg-surface-light/60 p-3 ${ACTION_BORDER_COLORS[a.type]}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-text-secondary">
                    {formatTime(a.timestamp)}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${ACTION_COLORS[a.type]}`}
                  >
                    {a.type}
                  </span>
                </div>
                <p className="mb-1 text-xs text-foreground">{a.action}</p>
                <div className="flex items-center justify-between text-[10px] text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {a.target}
                  </span>
                  <span>
                    Confidence:{" "}
                    <span
                      className={
                        a.confidence >= 90
                          ? "text-success font-semibold"
                          : a.confidence >= 80
                            ? "text-accent font-semibold"
                            : "text-warning font-semibold"
                      }
                    >
                      {a.confidence}%
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ----------  Team Activity  ---------- */}
        <div className="card-glow cyber-border rounded-xl bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-accent-blue" />
            <h3 className="text-sm font-semibold tracking-wide text-foreground">
              Team Activity
            </h3>
          </div>

          <div className="space-y-3">
            {analysts.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface-light/50 p-3 transition-colors hover:border-primary/30"
              >
                {/* Avatar */}
                <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary-light">
                  {a.initials}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface soc-pulse ${statusDotColor[a.status]}`}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {a.name}
                    </span>
                    <span className="rounded bg-surface-light px-1.5 py-0.5 text-[10px] text-text-secondary">
                      {a.role}
                    </span>
                    <span className="text-[10px] capitalize text-text-secondary">
                      {statusLabel[a.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                    {a.task}
                  </p>
                </div>

                {/* Alerts count */}
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-accent">
                    {a.alertsHandled}
                  </span>
                  <span className="text-[9px] text-text-secondary">alerts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
