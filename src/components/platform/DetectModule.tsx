"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity, Wifi, Mail, Cloud, Monitor, User, Factory,
  AlertCircle, Search, Eye, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  generateDetections, generateNewDetection,
  type Detection, type PatternDeviation,
} from "@/lib/platformData";

const TABS = ["Detections", "Pattern of Life", "NEXT Agent"] as const;
type Tab = (typeof TABS)[number];

const DOMAINS = [
  { key: "network", label: "Network", icon: Wifi },
  { key: "email", label: "Email", icon: Mail },
  { key: "cloud", label: "Cloud", icon: Cloud },
  { key: "endpoint", label: "Endpoint", icon: Monitor },
  { key: "identity", label: "Identity", icon: User },
  { key: "ot", label: "OT", icon: Factory },
] as const;

const DEVICES = [
  { name: "DC-PROD-01", ip: "10.0.1.10", type: "Domain Controller", dept: "IT Infrastructure",
    metrics: [
      { label: "Auth Requests/min", normal: [80, 150], current: 142, unit: "/min", sigma: 0.3 },
      { label: "LDAP Queries/min", normal: [200, 400], current: 385, unit: "/min", sigma: 0.2 },
      { label: "CPU Utilization", normal: [20, 60], current: 55, unit: "%", sigma: 0.5 },
      { label: "Outbound Connections", normal: [5, 20], current: 18, unit: "", sigma: 0.8 },
      { label: "Failed Logins/hr", normal: [0, 10], current: 8, unit: "/hr", sigma: 0.6 },
    ],
  },
  { name: "WEB-SVR-03", ip: "10.0.2.30", type: "Web Server", dept: "Engineering",
    metrics: [
      { label: "HTTP Requests/sec", normal: [100, 500], current: 480, unit: "/sec", sigma: 0.4 },
      { label: "Response Latency", normal: [10, 80], current: 145, unit: "ms", sigma: 2.8 },
      { label: "Active Sessions", normal: [50, 200], current: 310, unit: "", sigma: 3.1 },
      { label: "Error Rate", normal: [0, 2], current: 4.5, unit: "%", sigma: 2.5 },
      { label: "Bandwidth Out", normal: [10, 100], current: 92, unit: "MB/s", sigma: 0.7 },
      { label: "DNS Queries/min", normal: [5, 25], current: 22, unit: "/min", sigma: 0.4 },
    ],
  },
  { name: "WKS-FIN-042", ip: "10.0.5.42", type: "Workstation", dept: "Finance",
    metrics: [
      { label: "Data Uploaded/hr", normal: [0, 50], current: 210, unit: "MB", sigma: 4.2 },
      { label: "New Processes/hr", normal: [5, 30], current: 28, unit: "/hr", sigma: 0.3 },
      { label: "USB Activity", normal: [0, 2], current: 0, unit: "events", sigma: 0 },
      { label: "Email Attachments/hr", normal: [0, 5], current: 12, unit: "/hr", sigma: 3.0 },
      { label: "VPN Sessions", normal: [0, 1], current: 1, unit: "", sigma: 0.5 },
    ],
  },
  { name: "OT-PLC-07", ip: "172.16.0.7", type: "PLC Controller", dept: "Manufacturing",
    metrics: [
      { label: "Modbus Writes/min", normal: [10, 40], current: 38, unit: "/min", sigma: 0.3 },
      { label: "Firmware Queries", normal: [0, 1], current: 5, unit: "/hr", sigma: 4.5 },
      { label: "Network Peers", normal: [3, 8], current: 12, unit: "", sigma: 3.2 },
      { label: "Cycle Time Jitter", normal: [0, 5], current: 4, unit: "ms", sigma: 0.6 },
      { label: "Config Changes", normal: [0, 0], current: 2, unit: "/day", sigma: 5.0 },
    ],
  },
  { name: "CLOUD-K8S-PROD", ip: "10.100.0.1", type: "K8s Cluster", dept: "DevOps",
    metrics: [
      { label: "Pod Restarts/hr", normal: [0, 3], current: 2, unit: "/hr", sigma: 0.4 },
      { label: "API Calls/min", normal: [200, 800], current: 750, unit: "/min", sigma: 0.3 },
      { label: "Egress Traffic", normal: [50, 300], current: 280, unit: "MB/s", sigma: 0.5 },
      { label: "RBAC Denials/hr", normal: [0, 5], current: 3, unit: "/hr", sigma: 0.3 },
      { label: "Image Pulls/hr", normal: [0, 10], current: 8, unit: "/hr", sigma: 0.4 },
      { label: "Secrets Access/hr", normal: [2, 15], current: 14, unit: "/hr", sigma: 0.7 },
    ],
  },
];

const CONNECTIONS = [
  { src: "10.0.5.42", dst: "185.220.101.1", port: 443, proto: "TCP", bytes: "1.2 GB", process: "chrome.exe", pid: 4812, cmd: "chrome.exe --no-sandbox", user: "jsmith", parent: "explorer.exe" },
  { src: "10.0.2.30", dst: "10.0.1.10", port: 389, proto: "TCP", bytes: "45 MB", process: "httpd", pid: 1024, cmd: "/usr/sbin/httpd -DFOREGROUND", user: "www-data", parent: "systemd" },
  { src: "172.16.0.7", dst: "91.234.56.78", port: 502, proto: "TCP", bytes: "800 KB", process: "modbus_cli", pid: 312, cmd: "modbus_cli --write-coil 0x0001", user: "root", parent: "crontab" },
  { src: "10.0.5.42", dst: "10.0.3.50", port: 445, proto: "SMB", bytes: "3.8 GB", process: "powershell.exe", pid: 6720, cmd: "powershell -ep bypass -f sync.ps1", user: "jsmith", parent: "cmd.exe" },
  { src: "10.100.0.1", dst: "169.254.169.254", port: 80, proto: "HTTP", bytes: "12 KB", process: "curl", pid: 8841, cmd: "curl http://169.254.169.254/latest/meta-data/", user: "app-svc", parent: "bash" },
];

function scoreColor(s: number) {
  if (s >= 0.8) return "bg-red-500";
  if (s >= 0.5) return "bg-yellow-500";
  return "bg-green-500";
}

function sigmaColor(sigma: number) {
  if (sigma >= 2.5) return "bg-red-500";
  if (sigma >= 1.5) return "bg-yellow-500";
  return "bg-green-500";
}

function sigmaTextColor(sigma: number) {
  if (sigma >= 2.5) return "text-red-400";
  if (sigma >= 1.5) return "text-yellow-400";
  return "text-green-400";
}

export default function DetectModule({ defaultTab }: { defaultTab?: string }) {
  const initialTab: Tab = TABS.find((t) => t.toLowerCase() === defaultTab?.toLowerCase()) ?? "Detections";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [detections, setDetections] = useState<Detection[]>(() => generateDetections(10));
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0].name);
  const [selectedConn, setSelectedConn] = useState<number | null>(null);

  useEffect(() => {
    if (tab !== "Detections") return;
    const iv = setInterval(() => {
      setDetections((prev) => [generateNewDetection(), ...prev]);
    }, 4000);
    return () => clearInterval(iv);
  }, [tab]);

  const filtered = domainFilter ? detections.filter((d) => d.domain === domainFilter) : detections;

  const domainCounts = useCallback(() => {
    const counts: Record<string, number> = {};
    for (const d of detections) counts[d.domain] = (counts[d.domain] || 0) + 1;
    return counts;
  }, [detections]);

  const device = DEVICES.find((d) => d.name === selectedDevice) ?? DEVICES[0];

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-surface-border pb-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${tab === t ? "bg-primary text-white" : "text-text-secondary hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Detections Tab ── */}
      {tab === "Detections" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {DOMAINS.map(({ key, label, icon: Icon }) => {
              const count = domainCounts()[key] || 0;
              const coverage = Math.min(100, 60 + count * 3);
              const active = domainFilter === key;
              return (
                <button key={key} onClick={() => setDomainFilter(active ? null : key)}
                  className={`p-3 rounded-lg border transition-all text-left ${active ? "border-primary bg-primary/10 card-glow" : "border-surface-border bg-surface-light hover:border-primary/50"}`}>
                  <Icon className="w-4 h-4 text-accent mb-1" />
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-xs text-text-secondary">{count} detections</div>
                  <div className="mt-1 h-1 rounded bg-surface-border">
                    <div className="h-1 rounded bg-accent" style={{ width: `${coverage}%` }} />
                  </div>
                  <div className="text-[10px] text-text-secondary mt-0.5">{coverage}% coverage</div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Activity className="w-4 h-4 text-accent animate-pulse" />
            <span>Live feed — {filtered.length} detections{domainFilter ? ` (${domainFilter})` : ""}</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((d) => {
              const isOpen = expanded === d.id;
              return (
                <div key={d.id} className="bg-surface-light border border-surface-border rounded-lg p-3 hover:border-primary/40 transition-colors">
                  <button className="w-full text-left" onClick={() => setExpanded(isOpen ? null : d.id)}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertCircle className={`w-4 h-4 flex-shrink-0 ${d.score >= 0.8 ? "text-red-400" : d.score >= 0.5 ? "text-yellow-400" : "text-green-400"}`} />
                        <span className="text-sm font-medium text-white truncate">{d.modelName}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">{d.domain}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-accent-blue/20 text-blue-400 border border-accent-blue/30">{d.mitreMapping}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 rounded bg-surface-border">
                        <div className={`h-1.5 rounded ${scoreColor(d.score)}`} style={{ width: `${d.score * 100}%` }} />
                      </div>
                      <span className="text-xs text-text-secondary w-8 text-right">{d.score.toFixed(2)}</span>
                      <span className="text-xs text-text-secondary">{d.device}</span>
                      <span className="text-[10px] text-text-secondary">{d.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-surface-border space-y-3">
                      <p className="text-sm text-text-secondary">{d.description}</p>
                      <div>
                        <div className="text-xs font-semibold text-white mb-2">Pattern-of-Life Deviations</div>
                        {d.patternDeviations.map((p, i) => {
                          const range = p.normalMax - p.normalMin || 1;
                          const scale = range * 3;
                          const barMin = p.normalMin - range;
                          const pct = (v: number) => Math.max(0, Math.min(100, ((v - barMin) / scale) * 100));
                          return (
                            <div key={i} className="mb-2">
                              <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-text-secondary">{p.metric}</span>
                                <span className={sigmaTextColor(p.sigma)}>{p.observed}{p.unit} ({p.sigma.toFixed(1)}σ)</span>
                              </div>
                              <div className="relative h-3 rounded bg-surface-border">
                                <div className="absolute h-3 rounded bg-green-500/30"
                                  style={{ left: `${pct(p.normalMin)}%`, width: `${pct(p.normalMax) - pct(p.normalMin)}%` }} />
                                <div className={`absolute top-0 w-0.5 h-3 ${sigmaColor(p.sigma)}`}
                                  style={{ left: `${pct(p.observed)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white mb-1">Raw Events</div>
                        <div className="bg-surface rounded p-2 text-xs font-mono text-text-secondary space-y-0.5 max-h-32 overflow-y-auto">
                          {d.rawEvents.map((e, i) => <div key={i}>{e}</div>)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Pattern of Life Tab ── */}
      {tab === "Pattern of Life" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-text-secondary" />
            <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}
              className="bg-surface-light border border-surface-border rounded px-3 py-2 text-sm text-white focus:border-primary outline-none">
              {DEVICES.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          <div className="bg-surface-light border border-surface-border rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div><div className="text-xs text-text-secondary">Device</div><div className="text-sm font-semibold text-white">{device.name}</div></div>
              <div><div className="text-xs text-text-secondary">IP Address</div><div className="text-sm font-mono text-accent">{device.ip}</div></div>
              <div><div className="text-xs text-text-secondary">Type</div><div className="text-sm text-white">{device.type}</div></div>
              <div><div className="text-xs text-text-secondary">Department</div><div className="text-sm text-white">{device.dept}</div></div>
            </div>

            <div className="text-xs font-semibold text-white mb-3">Behavioral Metrics</div>
            <div className="space-y-4">
              {device.metrics.map((m, i) => {
                const range = m.normal[1] - m.normal[0] || 1;
                const scale = range * 4;
                const barMin = m.normal[0] - range;
                const pct = (v: number) => Math.max(0, Math.min(100, ((v - barMin) / scale) * 100));
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{m.label}</span>
                      <span className={sigmaTextColor(m.sigma)}>
                        {m.current}{m.unit} <span className="text-text-secondary">({m.sigma.toFixed(1)}σ)</span>
                      </span>
                    </div>
                    <div className="relative h-4 rounded bg-surface-border">
                      <div className="absolute h-4 rounded bg-green-500/25 border border-green-500/40"
                        style={{ left: `${pct(m.normal[0])}%`, width: `${pct(m.normal[1]) - pct(m.normal[0])}%` }} />
                      <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-light ${sigmaColor(m.sigma)}`}
                        style={{ left: `calc(${pct(m.current)}% - 5px)` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-secondary mt-0.5">
                      <span>Normal: {m.normal[0]}–{m.normal[1]}{m.unit}</span>
                      <span>Current: {m.current}{m.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── NEXT Agent Tab ── */}
      {tab === "NEXT Agent" && (
        <div className="space-y-4">
          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-sm text-blue-300">
              <strong>NEXT</strong> combines full packet capture + endpoint process context for unmatched visibility.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Traditional NDR</div>
            <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">NEXT Agent</div>
          </div>

          <div className="space-y-2">
            {CONNECTIONS.map((c, i) => {
              const active = selectedConn === i;
              return (
                <button key={i} onClick={() => setSelectedConn(active ? null : i)}
                  className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded-lg border transition-all text-left ${active ? "border-primary bg-primary/5 card-glow" : "border-surface-border bg-surface-light hover:border-primary/40"}`}>
                  {/* Traditional NDR side */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-x-4 text-xs">
                      <span className="text-text-secondary">Source</span><span className="text-white font-mono">{c.src}</span>
                      <span className="text-text-secondary">Destination</span><span className="text-white font-mono">{c.dst}</span>
                      <span className="text-text-secondary">Port</span><span className="text-white">{c.port}</span>
                      <span className="text-text-secondary">Protocol</span><span className="text-white">{c.proto}</span>
                      <span className="text-text-secondary">Bytes</span><span className="text-white">{c.bytes}</span>
                    </div>
                  </div>
                  {/* NEXT Agent side */}
                  <div className="space-y-1 border-l border-surface-border pl-3">
                    <div className="grid grid-cols-2 gap-x-4 text-xs">
                      <span className="text-text-secondary">Source</span><span className="text-white font-mono">{c.src}</span>
                      <span className="text-text-secondary">Destination</span><span className="text-white font-mono">{c.dst}</span>
                      <span className="text-text-secondary">Port</span><span className="text-white">{c.port}</span>
                      <span className="text-text-secondary">Protocol</span><span className="text-white">{c.proto}</span>
                      <span className="text-text-secondary">Bytes</span><span className="text-white">{c.bytes}</span>
                      <span className="text-accent">Process</span><span className="text-accent font-mono">{c.process}</span>
                      <span className="text-accent">PID</span><span className="text-accent">{c.pid}</span>
                      <span className="text-accent">Command</span><span className="text-accent font-mono text-[11px] truncate">{c.cmd}</span>
                      <span className="text-accent">User</span><span className="text-accent">{c.user}</span>
                      <span className="text-accent">Parent</span><span className="text-accent font-mono">{c.parent}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
