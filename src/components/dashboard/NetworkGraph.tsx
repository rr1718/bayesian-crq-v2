"use client";

import { useState, useEffect, useRef } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "server" | "workstation" | "iot" | "router" | "cloud";
  risk: "critical" | "high" | "medium" | "low" | "none";
}

interface Edge {
  from: string;
  to: string;
  active?: boolean;
}

const NODES: Node[] = [
  { id: "gw1", x: 0.5, y: 0.12, label: "Gateway", type: "router", risk: "none" },
  { id: "fw1", x: 0.3, y: 0.25, label: "Firewall", type: "router", risk: "low" },
  { id: "srv1", x: 0.7, y: 0.22, label: "DC-01", type: "server", risk: "medium" },
  { id: "srv2", x: 0.15, y: 0.45, label: "Mail-Srv", type: "server", risk: "high" },
  { id: "srv3", x: 0.55, y: 0.4, label: "File-Srv", type: "server", risk: "critical" },
  { id: "ws1", x: 0.82, y: 0.42, label: "WS-101", type: "workstation", risk: "medium" },
  { id: "ws2", x: 0.35, y: 0.58, label: "WS-204", type: "workstation", risk: "high" },
  { id: "ws3", x: 0.72, y: 0.6, label: "WS-307", type: "workstation", risk: "none" },
  { id: "iot1", x: 0.2, y: 0.72, label: "ICS-PLC", type: "iot", risk: "medium" },
  { id: "iot2", x: 0.5, y: 0.75, label: "SCADA", type: "iot", risk: "low" },
  { id: "cloud1", x: 0.85, y: 0.78, label: "Azure-VM", type: "cloud", risk: "none" },
  { id: "ws4", x: 0.08, y: 0.88, label: "Jan-WS", type: "workstation", risk: "low" },
  { id: "srv4", x: 0.45, y: 0.88, label: "Backup", type: "server", risk: "none" },
  { id: "cloud2", x: 0.78, y: 0.88, label: "S3-Bucket", type: "cloud", risk: "none" },
];

const EDGES: Edge[] = [
  { from: "gw1", to: "fw1" },
  { from: "gw1", to: "srv1" },
  { from: "fw1", to: "srv2", active: true },
  { from: "fw1", to: "ws2" },
  { from: "srv1", to: "srv3", active: true },
  { from: "srv1", to: "ws1" },
  { from: "srv2", to: "ws2", active: true },
  { from: "srv3", to: "ws1", active: true },
  { from: "srv3", to: "ws3" },
  { from: "ws2", to: "iot1" },
  { from: "ws2", to: "iot2" },
  { from: "ws3", to: "cloud1" },
  { from: "iot1", to: "ws4" },
  { from: "iot2", to: "srv4" },
  { from: "cloud1", to: "cloud2" },
  { from: "srv3", to: "srv4" },
];

const RISK_COLORS: Record<Node["risk"], string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#3b82f6",
  none: "#6b7280",
};

const TYPE_ICONS: Record<Node["type"], string> = {
  server: "S",
  workstation: "W",
  iot: "I",
  router: "R",
  cloud: "C",
};

export default function NetworkGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((p) => (p + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getNodePos = (node: Node, w: number, h: number) => ({
    x: node.x * w,
    y: node.y * h,
  });

  const w = 400;
  const h = 400;

  return (
    <div ref={containerRef} className="h-full w-full relative">
      {/* Header */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="text-[11px] text-text-secondary font-mono">
          Network Topology
        </span>
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] text-text-secondary font-mono">
        <span>16 March 2024, 03:15:00</span>
        <span className="text-white/50">/</span>
        <span>16 March 2024, 03:19:00</span>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))" }}
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(42,43,61,0.3)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill="url(#grid)" />

        {/* Edges */}
        {EDGES.map((edge) => {
          const fromNode = NODES.find((n) => n.id === edge.from)!;
          const toNode = NODES.find((n) => n.id === edge.to)!;
          const from = getNodePos(fromNode, w, h);
          const to = getNodePos(toNode, w, h);
          const isHighlighted = hoveredNode === edge.from || hoveredNode === edge.to;

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={
                edge.active
                  ? `rgba(239,68,68,${0.3 + Math.sin(pulsePhase * 0.2) * 0.2})`
                  : isHighlighted
                  ? "rgba(108,59,245,0.5)"
                  : "rgba(42,43,61,0.5)"
              }
              strokeWidth={edge.active ? 1.5 : isHighlighted ? 1.2 : 0.8}
              strokeDasharray={edge.active ? "4 2" : "none"}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const pos = getNodePos(node, w, h);
          const color = RISK_COLORS[node.risk];
          const isHovered = hoveredNode === node.id;
          const radius = isHovered ? 14 : node.risk === "critical" ? 12 : 10;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              {/* Pulse ring for critical/high */}
              {(node.risk === "critical" || node.risk === "high") && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius + 4 + Math.sin(pulsePhase * 0.15) * 3}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  opacity={0.3 + Math.sin(pulsePhase * 0.15) * 0.2}
                />
              )}

              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={`${color}20`}
                stroke={color}
                strokeWidth={isHovered ? 2 : 1.2}
              />

              {/* Type icon */}
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color}
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {TYPE_ICONS[node.type]}
              </text>

              {/* Label */}
              {isHovered && (
                <g>
                  <rect
                    x={pos.x - 30}
                    y={pos.y - radius - 18}
                    width="60"
                    height="14"
                    rx="3"
                    fill="#12131f"
                    stroke={color}
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - radius - 9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#e0e6ed"
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        {(["critical", "high", "medium", "low"] as const).map((risk) => (
          <div key={risk} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: RISK_COLORS[risk] }}
            />
            <span className="text-[9px] text-text-secondary capitalize font-mono">
              {risk}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline scrubber */}
      <div className="absolute bottom-8 left-3 right-3">
        <div className="h-1 bg-surface-border rounded-full relative">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-blue to-primary rounded-full"
            style={{ width: "65%" }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary"
            style={{ left: "65%" }}
          />
        </div>
      </div>
    </div>
  );
}
