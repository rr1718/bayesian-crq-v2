"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AlertCircle,
  Shield,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Wifi,
  Mail,
  Cloud,
  Monitor,
  User,
  Factory,
} from "lucide-react";
import { generateThreatEvent, ThreatEvent } from "@/lib/sampleData";

const SEVERITY_COLORS: Record<ThreatEvent["severity"], string> = {
  critical: "bg-danger text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-warning text-black",
  low: "bg-accent-blue text-white",
};

const STATUS_CONFIG: Record<
  ThreatEvent["status"],
  { label: string; color: string; pulse: boolean }
> = {
  active: { label: "Active", color: "bg-danger", pulse: true },
  contained: { label: "Contained", color: "bg-success", pulse: false },
  investigating: { label: "Investigating", color: "bg-warning", pulse: false },
  resolved: { label: "Resolved", color: "bg-success", pulse: false },
};

const DOMAIN_ICONS: Record<ThreatEvent["domain"], React.ReactNode> = {
  network: <Wifi className="h-3 w-3" />,
  email: <Mail className="h-3 w-3" />,
  cloud: <Cloud className="h-3 w-3" />,
  endpoint: <Monitor className="h-3 w-3" />,
  identity: <User className="h-3 w-3" />,
  ot: <Factory className="h-3 w-3" />,
};

const THREAT_TYPE_LABELS: Record<ThreatEvent["type"], string> = {
  malware: "Malware",
  phishing: "Phishing",
  lateral_movement: "Lateral Movement",
  data_exfil: "Data Exfiltration",
  c2_callback: "C2 Callback",
  insider: "Insider Threat",
  brute_force: "Brute Force",
  privilege_escalation: "Privilege Escalation",
};

const SEVERITY_FILTERS = ["all", "critical", "high", "medium", "low"] as const;
type SeverityFilter = (typeof SEVERITY_FILTERS)[number];

const MAX_EVENTS = 30;

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffS = Math.floor(diffMs / 1000);
  if (diffS < 60) return `${diffS}s ago`;
  const diffM = Math.floor(diffS / 60);
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  return `${diffH}h ago`;
}

export default function ThreatFeed({ fullWidth }: { fullWidth?: boolean } = {}) {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [filter, setFilter] = useState<SeverityFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [, setTick] = useState(0);
  const initialized = useRef(false);

  // Initialize events on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const initial: ThreatEvent[] = [];
    for (let i = 0; i < 8; i++) {
      const ev = generateThreatEvent();
      ev.timestamp = new Date(Date.now() - (8 - i) * 4000);
      initial.push(ev);
    }
    setEvents(initial);
  }, []);

  // Add new events on random interval
  useEffect(() => {
    function scheduleNext() {
      const delay = 3000 + Math.random() * 2000;
      return setTimeout(() => {
        const ev = generateThreatEvent();
        setEvents((prev) => {
          const next = [ev, ...prev];
          return next.slice(0, MAX_EVENTS);
        });
        setNewIds((prev) => {
          const next = new Set(prev);
          next.add(ev.id);
          return next;
        });
        // Remove the "new" flag after the animation
        setTimeout(() => {
          setNewIds((prev) => {
            const next = new Set(prev);
            next.delete(ev.id);
            return next;
          });
        }, 600);
        timerId = scheduleNext();
      }, delay);
    }
    let timerId = scheduleNext();
    return () => clearTimeout(timerId);
  }, []);

  // Tick for relative time updates
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const filtered =
    filter === "all" ? events : events.filter((e) => e.severity === filter);

  return (
    <div className="flex flex-col h-full bg-surface rounded-lg cyber-border card-glow overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-surface-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-danger" />
            <h2 className="text-lg font-semibold text-white">
              Live Threat Feed
            </h2>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
            </span>
          </div>
          <span className="text-xs text-text-secondary">
            {events.length} events
          </span>
        </div>

        {/* Severity filters */}
        <div className="flex gap-1.5 flex-wrap">
          {SEVERITY_FILTERS.map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                filter === sev
                  ? "bg-primary text-white"
                  : "bg-surface-light text-text-secondary hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable feed */}
      <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-1.5">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-text-secondary text-sm">
            No events matching filter
          </div>
        )}

        {filtered.map((event) => {
          const isNew = newIds.has(event.id);
          const isExpanded = expandedId === event.id;
          const severity = SEVERITY_COLORS[event.severity];
          const status = STATUS_CONFIG[event.status];

          return (
            <div
              key={event.id}
              className={`rounded-md border border-surface-border bg-surface-light transition-all duration-300 ease-out cursor-pointer hover:border-primary/40 ${
                isNew ? "animate-slide-in" : ""
              }`}
              onClick={() => toggleExpand(event.id)}
            >
              {/* Compact row */}
              <div className="p-2.5 flex items-start gap-2">
                {/* Severity badge */}
                <span
                  className={`flex-shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded ${severity}`}
                >
                  {event.severity}
                </span>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white truncate">
                      {THREAT_TYPE_LABELS[event.type]}
                    </span>
                    {/* Domain badge */}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-surface border border-surface-border text-text-secondary capitalize">
                      {DOMAIN_ICONS[event.domain]}
                      {event.domain}
                    </span>
                  </div>

                  {/* Source -> Dest */}
                  <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
                    <span className="font-mono">{event.source}</span>
                    <ArrowRight className="h-3 w-3 flex-shrink-0 text-accent" />
                    <span className="font-mono">{event.destination}</span>
                  </div>

                  {/* AI confidence bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-text-secondary whitespace-nowrap">
                      AI {event.aiConfidence}%
                    </span>
                    <div className="flex-1 h-1 rounded-full bg-surface max-w-[80px]">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${event.aiConfidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {/* Status */}
                    <span className="inline-flex items-center gap-1 text-[10px] text-text-secondary">
                      <span className="relative flex h-1.5 w-1.5">
                        {status.pulse && (
                          <span
                            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.color} opacity-75`}
                          />
                        )}
                        <span
                          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${status.color}`}
                        />
                      </span>
                      {status.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-text-secondary" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
                    )}
                  </div>
                  <span className="text-[10px] text-text-secondary">
                    {formatRelativeTime(event.timestamp)}
                  </span>
                  {event.respondAction && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded bg-success/20 text-success font-medium">
                      <Shield className="h-2.5 w-2.5" />
                      Action taken
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                  isExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-2.5 pb-2.5 pt-1 border-t border-surface-border space-y-2">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="text-xs">
                      <span className="text-text-secondary">
                        AI Confidence:{" "}
                      </span>
                      <span className="text-accent font-medium">
                        {event.aiConfidence}%
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-text-secondary">Event ID: </span>
                      <span className="text-white font-mono">{event.id}</span>
                    </div>
                  </div>

                  {/* Confidence detail bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-text-secondary">
                      <span>Behavioral Match</span>
                      <span>
                        {Math.min(
                          100,
                          Math.round(event.aiConfidence * 0.9 + Math.random() * 10)
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{
                          width: `${Math.min(100, Math.round(event.aiConfidence * 0.9 + 5))}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-secondary">
                      <span>Signature Match</span>
                      <span>
                        {Math.min(
                          100,
                          Math.round(event.aiConfidence * 0.8 + Math.random() * 15)
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(100, Math.round(event.aiConfidence * 0.8 + 8))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {event.respondAction && (
                    <div className="flex items-start gap-1.5 p-2 rounded bg-success/10 border border-success/20">
                      <Shield className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-medium text-success uppercase">
                          RESPOND Action
                        </span>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {event.respondAction}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
