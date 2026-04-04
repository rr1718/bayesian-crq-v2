"use client";

import { useState } from "react";
import { ChevronRight, Clock, Shield } from "lucide-react";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  progress: number; // 0-100
  severity: "critical" | "high" | "medium" | "low";
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 1,
    date: "13 Mar",
    title: "Suspicious Email Identified by Darktrace/Email",
    startTime: "Wed 13 Mar, 09:13:00",
    endTime: "Wed 13 Mar, 09:14:00",
    progress: 100,
    severity: "medium",
  },
  {
    id: 2,
    date: "",
    title: "Unusual External Download",
    startTime: "Sat 16 Mar, 02:45:00",
    endTime: "Sat 16 Mar, 02:50:00",
    progress: 85,
    severity: "high",
  },
  {
    id: 3,
    date: "",
    title: "Scanning of Multiple Devices",
    startTime: "Sat 16 Mar, 02:53:00",
    endTime: "Sat 16 Mar, 03:15:00",
    progress: 70,
    severity: "high",
  },
  {
    id: 4,
    date: "",
    title: "Unusual Repeated Connections",
    startTime: "Sat 16 Mar, 02:50:00",
    endTime: "Sat 16 Mar, 03:19:00",
    progress: 55,
    severity: "high",
  },
  {
    id: 5,
    date: "",
    title: "Possible Encryption of Files over SMB",
    startTime: "Sat 16 Mar, 03:15:00",
    endTime: "Sat 16 Mar, 03:19:00",
    progress: 40,
    severity: "critical",
  },
];

const PROGRESS_COLORS: Record<TimelineEvent["severity"], string> = {
  critical: "from-red-600 to-red-400",
  high: "from-orange-600 to-orange-400",
  medium: "from-blue-600 to-blue-400",
  low: "from-gray-600 to-gray-400",
};

export default function DetectSummary() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-surface-border">
        <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/20">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-white tracking-wide">
          DETECT \ Summary
        </h2>
        <div className="ml-auto">
          <button className="p-1.5 rounded hover:bg-surface-light transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="#8892a4" strokeWidth="1.2"/>
              <rect x="8" y="1" width="5" height="5" rx="1" stroke="#8892a4" strokeWidth="1.2"/>
              <rect x="1" y="8" width="5" height="5" rx="1" stroke="#8892a4" strokeWidth="1.2"/>
              <rect x="8" y="8" width="5" height="5" rx="1" stroke="#8892a4" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="px-5 py-2">
        <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-accent-blue to-accent rounded-full w-full" />
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        {TIMELINE_EVENTS.map((event, i) => {
          const isExpanded = expandedEvent === event.id;
          const showDate = i === 0 || event.date !== TIMELINE_EVENTS[i - 1]?.date;

          return (
            <div key={event.id} className="mb-1">
              {/* Date marker */}
              {showDate && event.date && (
                <div className="flex items-center gap-3 py-2">
                  <span className="text-xs text-text-secondary font-mono shrink-0 w-12">
                    {event.date}
                  </span>
                  <div className="h-px flex-1 bg-surface-border/50" />
                </div>
              )}

              {/* Event row */}
              <button
                onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                className="w-full text-left group"
              >
                <div className="flex items-start gap-3 py-2 px-2 rounded-lg hover:bg-surface-light/30 transition-colors">
                  {/* Timeline dot & connector */}
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        event.severity === "critical"
                          ? "bg-red-500"
                          : event.severity === "high"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    />
                    {i < TIMELINE_EVENTS.length - 1 && (
                      <div className="w-px h-8 bg-surface-border/40 mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-medium text-white/90">
                        {event.title}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-text-secondary shrink-0 transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{event.startTime}</span>
                      <span className="text-white/30">→</span>
                      <span>{event.endTime}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 bg-surface-border/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${PROGRESS_COLORS[event.severity]} rounded-full transition-all duration-500`}
                        style={{ width: `${event.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="ml-7 mt-1 mb-3 p-3 bg-surface/60 rounded-lg border border-surface-border/50">
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-text-secondary">Severity</span>
                        <p className="text-white capitalize font-medium">{event.severity}</p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Duration</span>
                        <p className="text-white font-medium">
                          {event.severity === "critical" ? "4 min" : event.severity === "high" ? "5-22 min" : "1 min"}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Devices</span>
                        <p className="text-white font-medium">
                          {event.severity === "critical" ? "12" : event.severity === "high" ? "3-8" : "1"}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Model Breaches</span>
                        <p className="text-white font-medium">
                          {event.severity === "critical" ? "7" : event.severity === "high" ? "2-4" : "1"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
