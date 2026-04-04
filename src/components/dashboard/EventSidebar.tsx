"use client";

import { useState } from "react";
import { ChevronRight, AlertTriangle, Shield, Settings } from "lucide-react";

type SidebarTab = "Summary" | "Event" | "Interaction" | "Asset";

interface SecurityEvent {
  id: number;
  timestamp: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  startTime: string;
  endTime: string;
  triggeredBy?: string;
}

const EVENTS: SecurityEvent[] = [
  {
    id: 1,
    timestamp: "Wed 13 Mar, 09:13:00",
    title: "Suspicious Email Identified by BayesianLab/Email",
    severity: "medium",
    startTime: "Wed 13 Mar, 09:13:00",
    endTime: "Wed 13 Mar, 09:14:00",
  },
  {
    id: 2,
    timestamp: "Sat 16 Mar, 02:45:00",
    title: "Unusual External Download",
    severity: "high",
    startTime: "Sat 16 Mar, 02:45:00",
    endTime: "Sat 16 Mar, 02:50:00",
  },
  {
    id: 3,
    timestamp: "Sat 16 Mar, 02:53:00",
    title: "Scanning of Multiple Devices",
    severity: "high",
    startTime: "Sat 16 Mar, 02:53:00",
    endTime: "Sat 16 Mar, 03:15:00",
  },
  {
    id: 4,
    timestamp: "Sat 16 Mar, 02:50:00",
    title: "Unusual Repeated Connections",
    severity: "high",
    startTime: "Sat 16 Mar, 02:50:00",
    endTime: "Sat 16 Mar, 03:19:00",
  },
  {
    id: 5,
    timestamp: "Sat 16 Mar, 03:15:00",
    title: "Possible Encryption of Files over SMB",
    severity: "critical",
    startTime: "Sat 16 Mar, 03:15:00",
    endTime: "Sat 16 Mar, 03:19:00",
    triggeredBy: "Triggered by third party investigation",
  },
];

const SEVERITY_COLORS: Record<SecurityEvent["severity"], string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const SEVERITY_DOT: Record<SecurityEvent["severity"], string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

export default function EventSidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("Summary");
  const [selectedEvent, setSelectedEvent] = useState<number>(5);
  const tabs: SidebarTab[] = ["Summary", "Event", "Interaction", "Asset"];

  return (
    <div className="h-full flex flex-col bg-[#0d0e1a] border-r border-surface-border">
      {/* Tabs */}
      <div className="flex border-b border-surface-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab
                ? "text-white bg-surface-light border-b-2 border-primary"
                : "text-text-secondary hover:text-white hover:bg-surface/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="px-3 py-2 border-b border-surface-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-secondary">All Event Types</span>
        </div>
        <Settings className="w-3.5 h-3.5 text-text-secondary" />
      </div>
      <div className="px-3 py-1.5 border-b border-surface-border/50 flex items-center gap-1">
        <span className="text-[11px] text-text-secondary">Sort By: Time (asc)</span>
      </div>

      {/* PREVENT toggle */}
      <div className="px-3 py-2 border-b border-surface-border/50 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-accent-blue uppercase tracking-wider">
          PREVENT High Risk Paths
        </span>
        <div className="w-8 h-4 bg-accent/30 rounded-full relative cursor-pointer">
          <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-accent transition-all" />
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto">
        {EVENTS.map((event) => {
          const isSelected = selectedEvent === event.id;
          return (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className={`w-full text-left px-3 py-3 border-b border-surface-border/30 transition-colors ${
                isSelected
                  ? event.severity === "critical"
                    ? "bg-red-500/10 border-l-2 border-l-red-500"
                    : "bg-surface-light border-l-2 border-l-primary"
                  : "hover:bg-surface/60"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${SEVERITY_DOT[event.severity]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-text-secondary mb-0.5">{event.timestamp}</p>
                  <p className="text-xs text-white/90 font-medium leading-tight">
                    {event.id}. {event.title}
                  </p>
                  {event.triggeredBy && (
                    <p className="text-[10px] text-text-secondary mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-yellow-500" />
                      {event.triggeredBy}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
