"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, Filter, Settings } from "lucide-react";

interface Incident {
  score: number;
  scoreColor: "red" | "orange" | "yellow";
  status: string;
  device: string;
  category: string;
  severity: "Critical" | "Suspicious" | "Warning";
}

const INCIDENTS: Incident[] = [
  {
    score: 74,
    scoreColor: "red",
    status: "Simulated Incident",
    device: "S1-VEM-01",
    category: "Simulation (Critical)",
    severity: "Critical",
  },
  {
    score: 67,
    scoreColor: "red",
    status: "Y7CH7KHOQM",
    device: "ICS Pump",
    category: "Critical",
    severity: "Critical",
  },
  {
    score: 50,
    scoreColor: "orange",
    status: "",
    device: "Jan Workstation",
    category: "Suspicious",
    severity: "Suspicious",
  },
  {
    score: 42,
    scoreColor: "yellow",
    status: "",
    device: "DC-Controller-02",
    category: "Warning",
    severity: "Warning",
  },
];

const SCORE_COLORS = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
};

const SEVERITY_BADGES = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  Suspicious: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export default function IncidentCards() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-t border-surface-border bg-[#0a0b14]">
      {/* Expand/collapse header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-surface/30 transition-colors"
      >
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-secondary transition-transform ${
            isExpanded ? "" : "-rotate-90"
          }`}
        />
      </button>

      {isExpanded && (
        <>
          {/* Filter bar */}
          <div className="flex items-center gap-3 px-4 py-2 border-t border-surface-border/50">
            <button className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-white transition-colors">
              <Filter className="w-3 h-3" />
              Filters
            </button>
          </div>

          {/* Stats & Cards row */}
          <div className="flex items-stretch gap-0 px-0">
            {/* Summary stats */}
            <div className="flex flex-col items-center justify-center px-4 py-2 border-r border-surface-border min-w-[60px]">
              <Settings className="w-3.5 h-3.5 text-text-secondary mb-1" />
              <span className="text-lg font-bold text-white">4</span>
              <span className="text-[9px] text-text-secondary">Total</span>
              <AlertTriangle className="w-3 h-3 text-yellow-500 mt-1" />
            </div>

            {/* Incident cards */}
            <div className="flex-1 flex gap-0 overflow-x-auto">
              {INCIDENTS.map((incident, i) => (
                <div
                  key={i}
                  className={`flex-1 min-w-[200px] px-4 py-2.5 border-r border-surface-border/50 hover:bg-surface-light/20 transition-colors cursor-pointer ${
                    i === 0 ? "bg-surface-light/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white ${SCORE_COLORS[incident.scoreColor]}`}
                    >
                      {" "}
                    </span>
                    <span className="text-xs font-bold text-white">{incident.score}%</span>
                    {incident.status && (
                      <span className="text-[10px] text-accent-blue font-medium ml-1">
                        {incident.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] text-text-secondary">
                      {incident.device}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-text-secondary">
                      {incident.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
