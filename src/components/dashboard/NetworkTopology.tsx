"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { generateDeviceNodes, DeviceNode } from "@/lib/sampleData";
import { Server, Monitor, Shield, Radio, Cloud, Factory, Filter, Eye } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types & constants                                                   */
/* ------------------------------------------------------------------ */

type DeviceType = DeviceNode["type"];
type DeviceStatus = DeviceNode["status"];

const STATUS_COLORS: Record<DeviceStatus, string> = {
  normal: "#10b981",
  anomalous: "#f59e0b",
  compromised: "#ef4444",
  isolated: "#6b7280",
};

const TYPE_ICONS: Record<DeviceType, string> = {
  server: "server",
  workstation: "monitor",
  firewall: "shield",
  switch: "radio",
  iot: "radio",
  cloud: "cloud",
  ot_device: "factory",
};

const TYPE_LABELS: Record<DeviceType, string> = {
  server: "Server",
  workstation: "Workstation",
  firewall: "Firewall",
  switch: "Switch",
  iot: "IoT",
  cloud: "Cloud",
  ot_device: "OT Device",
};

const RING_CONFIG: Record<string, number> = {
  server: 0,
  firewall: 0,
  switch: 0,
  cloud: 1,
  workstation: 1,
  iot: 2,
  ot_device: 2,
};

const FAKE_LOGS = [
  "Authentication success from 10.0.2.15",
  "Outbound HTTPS connection to cdn.cloudflare.com",
  "Failed login attempt — credential mismatch",
  "Firmware update check completed",
  "Port scan detected from 192.168.1.44",
  "DNS query to suspicious domain flagged",
  "File integrity check passed",
  "Encrypted payload upload to external bucket",
  "IDS signature match: ET TROJAN Generic",
  "TLS certificate rotation completed",
  "Anomalous traffic volume spike +340%",
  "Service restart triggered by watchdog",
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function positionDevices(devices: DeviceNode[], cx: number, cy: number) {
  const rings: DeviceNode[][] = [[], [], []];
  devices.forEach((d) => rings[RING_CONFIG[d.type] ?? 2].push(d));
  const radii = [cx * 0.22, cx * 0.48, cx * 0.74];
  const positions: Record<string, { x: number; y: number }> = {};

  rings.forEach((ring, ri) => {
    ring.forEach((device, di) => {
      const angle = (2 * Math.PI * di) / ring.length - Math.PI / 2;
      positions[device.name] = {
        x: cx + radii[ri] * Math.cos(angle),
        y: cy + radii[ri] * Math.sin(angle),
      };
    });
  });
  return positions;
}

function randomLogEntries() {
  const entries: { time: string; message: string }[] = [];
  const now = Date.now();
  for (let i = 0; i < 4; i++) {
    const ago = Math.floor(Math.random() * 3600);
    const m = Math.floor(ago / 60);
    entries.push({
      time: `${m}m ago`,
      message: FAKE_LOGS[Math.floor(Math.random() * FAKE_LOGS.length)],
    });
  }
  return entries;
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function DeviceIcon({ type, size = 14 }: { type: DeviceType; size?: number }) {
  const props = { size, strokeWidth: 1.5 };
  switch (TYPE_ICONS[type]) {
    case "server": return <Server {...props} />;
    case "monitor": return <Monitor {...props} />;
    case "shield": return <Shield {...props} />;
    case "radio": return <Radio {...props} />;
    case "cloud": return <Cloud {...props} />;
    case "factory": return <Factory {...props} />;
    default: return <Monitor {...props} />;
  }
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function NetworkTopology() {
  /* ---- state ---- */
  const [devices, setDevices] = useState<DeviceNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [threatView, setThreatView] = useState(false);
  const [typeFilters, setTypeFilters] = useState<Record<DeviceType, boolean>>({
    server: true,
    workstation: true,
    firewall: true,
    switch: true,
    iot: true,
    cloud: true,
    ot_device: true,
  });
  const [flashId, setFlashId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  /* ---- initial data ---- */
  useEffect(() => {
    setDevices(generateDeviceNodes());
  }, []);

  /* ---- live updates ---- */
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        const d = { ...next[idx] };
        const transitions: Record<DeviceStatus, DeviceStatus> = {
          normal: "anomalous",
          anomalous: "compromised",
          compromised: "isolated",
          isolated: "normal",
        };
        // 40% chance to go back to normal instead of escalating
        d.status = Math.random() < 0.4 ? "normal" : transitions[d.status];
        d.riskScore = d.status === "normal"
          ? Math.round(Math.random() * 30)
          : d.status === "anomalous"
          ? 40 + Math.round(Math.random() * 30)
          : d.status === "compromised"
          ? 70 + Math.round(Math.random() * 30)
          : Math.round(Math.random() * 15);
        next[idx] = d;
        setFlashId(d.id);
        setTimeout(() => setFlashId(null), 1200);
        return next;
      });
    }, 8000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  /* ---- derived ---- */
  const viewBox = { w: 700, h: 700 };
  const cx = viewBox.w / 2;
  const cy = viewBox.h / 2;

  const positions = useMemo(
    () => positionDevices(devices, cx, cy),
    [devices, cx, cy],
  );

  const visibleDevices = useMemo(
    () => devices.filter((d) => typeFilters[d.type]),
    [devices, typeFilters],
  );

  const selectedDevice = devices.find((d) => d.id === selectedId) ?? null;
  const hoveredDevice = devices.find((d) => d.id === hoveredId) ?? null;
  const activeDevice = hoveredDevice ?? selectedDevice;

  const connectedNames = useMemo(() => {
    if (!activeDevice) return new Set<string>();
    return new Set(activeDevice.connections);
  }, [activeDevice]);

  const toggleType = useCallback((t: DeviceType) => {
    setTypeFilters((prev) => ({ ...prev, [t]: !prev[t] }));
  }, []);

  const logEntries = useMemo(() => randomLogEntries(), [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- edges ---- */
  const edges = useMemo(() => {
    const seen = new Set<string>();
    const result: { from: string; to: string; active: boolean }[] = [];
    visibleDevices.forEach((d) => {
      d.connections.forEach((cName) => {
        const key = [d.name, cName].sort().join("|");
        if (seen.has(key)) return;
        seen.add(key);
        if (positions[d.name] && positions[cName]) {
          const target = devices.find((x) => x.name === cName);
          if (target && typeFilters[target.type]) {
            result.push({
              from: d.name,
              to: cName,
              active: d.status !== "isolated" && target.status !== "isolated",
            });
          }
        }
      });
    });
    return result;
  }, [visibleDevices, positions, devices, typeFilters]);

  /* ---- risk gauge ---- */
  function RiskGauge({ score }: { score: number }) {
    const color = score > 70 ? "#ef4444" : score > 40 ? "#f59e0b" : "#10b981";
    const pct = score / 100;
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-3 flex-1 rounded-full bg-surface-light overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{ width: `${score}%`, background: color }}
          />
        </div>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    );
  }

  if (devices.length === 0) return null;

  /* ================================================================ */
  /* RENDER                                                            */
  /* ================================================================ */
  return (
    <div className="bg-surface rounded-2xl cyber-border p-5 card-glow">
      {/* ---- CSS animations ---- */}
      <style>{`
        @keyframes dash-flow {
          to { stroke-dashoffset: -20; }
        }
        @keyframes pulse-ring {
          0% { r: 18; opacity: 0.7; }
          100% { r: 30; opacity: 0; }
        }
        @keyframes flash-node {
          0%, 100% { opacity: 1; }
          25% { opacity: 0.2; }
          50% { opacity: 1; }
          75% { opacity: 0.2; }
        }
        @keyframes glow-breathe {
          0%, 100% { filter: drop-shadow(0 0 4px currentColor); }
          50% { filter: drop-shadow(0 0 12px currentColor); }
        }
        .edge-active {
          stroke-dasharray: 6 4;
          animation: dash-flow 1.2s linear infinite;
        }
        .node-flash {
          animation: flash-node 1.2s ease-out;
        }
        .node-glow {
          animation: glow-breathe 2s ease-in-out infinite;
        }
      `}</style>

      {/* ---- header ---- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-white tracking-wide">
          Network Topology
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* type filters */}
          {(Object.keys(typeFilters) as DeviceType[]).map((t) => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                typeFilters[t]
                  ? "bg-surface-light border-surface-border text-white"
                  : "bg-transparent border-transparent text-text-secondary opacity-50"
              }`}
            >
              <DeviceIcon type={t} size={12} />
              {TYPE_LABELS[t]}
            </button>
          ))}
          <div className="w-px h-5 bg-surface-border mx-1" />
          {/* threat view */}
          <button
            onClick={() => setThreatView((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              threatView
                ? "bg-danger/20 border-danger/50 text-red-400"
                : "bg-surface-light border-surface-border text-text-secondary"
            }`}
          >
            <Eye size={13} />
            Threat View
          </button>
        </div>
      </div>

      {/* ---- main layout ---- */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* ---- SVG map ---- */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-xl overflow-hidden border border-surface-border bg-[#0b0c16]">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
              className="w-full h-auto"
              style={{ maxHeight: "620px" }}
            >
              {/* concentric ring guides */}
              {[0.22, 0.48, 0.74].map((r, i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={cx * r}
                  fill="none"
                  stroke="#1e2035"
                  strokeWidth={0.7}
                  strokeDasharray="4 6"
                />
              ))}

              {/* edges */}
              {edges.map((e, i) => {
                const from = positions[e.from];
                const to = positions[e.to];
                if (!from || !to) return null;
                const isHighlighted =
                  activeDevice &&
                  (activeDevice.name === e.from || activeDevice.name === e.to);
                const dimmed =
                  threatView &&
                  !devices.some(
                    (d) =>
                      (d.name === e.from || d.name === e.to) &&
                      (d.status === "anomalous" || d.status === "compromised"),
                  );
                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={
                      isHighlighted ? "#6c3bf5" : dimmed ? "#111224" : "#1e2035"
                    }
                    strokeWidth={isHighlighted ? 2 : 1}
                    opacity={isHighlighted ? 1 : dimmed ? 0.15 : 0.5}
                    className={e.active && !dimmed ? "edge-active" : undefined}
                  />
                );
              })}

              {/* nodes */}
              {visibleDevices.map((device) => {
                const pos = positions[device.name];
                if (!pos) return null;
                const color = STATUS_COLORS[device.status];
                const isActive = activeDevice?.id === device.id;
                const isConnected = connectedNames.has(device.name);
                const isFlashing = flashId === device.id;
                const dimmed =
                  threatView &&
                  device.status !== "anomalous" &&
                  device.status !== "compromised";

                return (
                  <g
                    key={device.id}
                    transform={`translate(${pos.x},${pos.y})`}
                    className={`cursor-pointer ${isFlashing ? "node-flash" : ""}`}
                    style={{ opacity: dimmed ? 0.12 : 1, transition: "opacity 0.6s" }}
                    onMouseEnter={() => setHoveredId(device.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() =>
                      setSelectedId((prev) =>
                        prev === device.id ? null : device.id,
                      )
                    }
                  >
                    {/* pulse ring for anomalous/compromised */}
                    {(device.status === "anomalous" ||
                      device.status === "compromised") &&
                      !dimmed && (
                        <circle
                          r={18}
                          fill="none"
                          stroke={color}
                          strokeWidth={1.5}
                          opacity={0}
                        >
                          <animate
                            attributeName="r"
                            from="18"
                            to="32"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.6"
                            to="0"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                    {/* selection ring */}
                    {(isActive || isConnected) && (
                      <circle
                        r={20}
                        fill="none"
                        stroke={isActive ? "#6c3bf5" : "#6c3bf544"}
                        strokeWidth={isActive ? 2 : 1}
                      />
                    )}

                    {/* node body */}
                    <circle
                      r={16}
                      fill="#12131f"
                      stroke={color}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      className={
                        device.status !== "normal" && !dimmed
                          ? "node-glow"
                          : undefined
                      }
                      style={{ color }}
                    />

                    {/* icon placeholder — SVG text glyph */}
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize={10}
                      fontFamily="monospace"
                      fill={color}
                      pointerEvents="none"
                    >
                      {TYPE_LABELS[device.type].slice(0, 2).toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* tooltip (SVG foreignObject) */}
              {hoveredDevice && positions[hoveredDevice.name] && (
                <foreignObject
                  x={Math.min(positions[hoveredDevice.name].x + 22, viewBox.w - 210)}
                  y={Math.max(positions[hoveredDevice.name].y - 50, 5)}
                  width={200}
                  height={120}
                  pointerEvents="none"
                >
                  <div className="bg-surface border border-surface-border rounded-lg p-2.5 text-[11px] shadow-2xl">
                    <p className="font-bold text-white mb-1">{hoveredDevice.name}</p>
                    <p className="text-text-secondary">IP: {hoveredDevice.ip}</p>
                    <p className="text-text-secondary">
                      Type: {TYPE_LABELS[hoveredDevice.type]}
                    </p>
                    <p className="text-text-secondary">
                      Dept: {hoveredDevice.department}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: STATUS_COLORS[hoveredDevice.status] }}
                      />
                      <span className="capitalize text-white">{hoveredDevice.status}</span>
                      <span className="ml-auto font-mono font-bold" style={{ color: STATUS_COLORS[hoveredDevice.status] }}>
                        {hoveredDevice.riskScore}
                      </span>
                    </div>
                  </div>
                </foreignObject>
              )}
            </svg>

            {/* legend overlay */}
            <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-surface/80 backdrop-blur rounded-lg px-3 py-1.5 text-[10px] border border-surface-border">
              {(["normal", "anomalous", "compromised", "isolated"] as DeviceStatus[]).map(
                (s) => (
                  <span key={s} className="flex items-center gap-1 capitalize text-text-secondary">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ background: STATUS_COLORS[s] }}
                    />
                    {s}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* ---- detail panel ---- */}
        <div
          className={`lg:w-72 xl:w-80 shrink-0 transition-all duration-300 ${
            selectedDevice ? "opacity-100" : "opacity-40 pointer-events-none"
          }`}
        >
          {selectedDevice ? (
            <div className="bg-surface-light rounded-xl border border-surface-border p-4 space-y-4 h-full">
              {/* device header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center border"
                  style={{
                    borderColor: STATUS_COLORS[selectedDevice.status],
                    background: `${STATUS_COLORS[selectedDevice.status]}15`,
                  }}
                >
                  <DeviceIcon type={selectedDevice.type} size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    {selectedDevice.name}
                  </p>
                  <p className="text-text-secondary text-xs font-mono">
                    {selectedDevice.ip}
                  </p>
                </div>
              </div>

              {/* info grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface rounded-lg px-3 py-2">
                  <p className="text-text-secondary mb-0.5">Type</p>
                  <p className="text-white font-medium">
                    {TYPE_LABELS[selectedDevice.type]}
                  </p>
                </div>
                <div className="bg-surface rounded-lg px-3 py-2">
                  <p className="text-text-secondary mb-0.5">Department</p>
                  <p className="text-white font-medium">
                    {selectedDevice.department}
                  </p>
                </div>
                <div className="bg-surface rounded-lg px-3 py-2 col-span-2 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: STATUS_COLORS[selectedDevice.status] }}
                  />
                  <span className="capitalize text-white font-medium">
                    {selectedDevice.status}
                  </span>
                </div>
              </div>

              {/* risk gauge */}
              <div>
                <p className="text-text-secondary text-xs mb-1.5">Risk Score</p>
                <RiskGauge score={selectedDevice.riskScore} />
              </div>

              {/* connections */}
              <div>
                <p className="text-text-secondary text-xs mb-1.5">
                  Connected Devices ({selectedDevice.connections.length})
                </p>
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
                  {selectedDevice.connections.map((cName) => {
                    const cd = devices.find((x) => x.name === cName);
                    return (
                      <button
                        key={cName}
                        className="w-full flex items-center gap-2 bg-surface rounded-lg px-2.5 py-1.5 text-xs hover:bg-surface-light transition-colors text-left"
                        onClick={() => {
                          if (cd) setSelectedId(cd.id);
                        }}
                      >
                        {cd && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: STATUS_COLORS[cd.status] }}
                          />
                        )}
                        <span className="text-white font-mono text-[11px] truncate">
                          {cName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* recent activity */}
              <div>
                <p className="text-text-secondary text-xs mb-1.5">
                  Recent Activity
                </p>
                <div className="space-y-1.5">
                  {logEntries.map((entry, i) => (
                    <div
                      key={i}
                      className="bg-surface rounded-lg px-2.5 py-1.5 text-[11px]"
                    >
                      <span className="text-text-secondary font-mono mr-2">
                        {entry.time}
                      </span>
                      <span className="text-white/80">{entry.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-text-secondary text-sm">
              <p className="text-center">
                <Filter size={20} className="mx-auto mb-2 opacity-40" />
                Select a node to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
