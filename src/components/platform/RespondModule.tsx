"use client";

import { useState, useEffect, useCallback } from "react";
import { Zap, Shield, Lock, Settings, Clock, AlertTriangle, CheckCircle, Play, Monitor } from "lucide-react";
import { generateRespondActions, RespondAction } from "@/lib/platformData";

const ACTION_LABELS: Record<RespondAction["actionType"], string> = {
  block_connection: "Block Connection", isolate_device: "Isolate Device", kill_process: "Kill Process",
  quarantine_email: "Quarantine Email", disable_account: "Disable Account", restrict_access: "Restrict Access",
  enforce_pol: "Enforce PoL",
};
const ACTION_COLORS: Record<RespondAction["actionType"], string> = {
  block_connection: "bg-danger", isolate_device: "bg-warning", kill_process: "bg-red-600",
  quarantine_email: "bg-accent-blue", disable_account: "bg-purple-600", restrict_access: "bg-orange-500",
  enforce_pol: "bg-teal-600",
};
const STATUS_COLORS: Record<RespondAction["status"], string> = {
  completed: "text-accent", in_progress: "text-accent-blue", pending_approval: "text-warning", failed: "text-red-400",
};
const TABS = ["Actions", "Autonomy Config", "Simulator"] as const;

const SCENARIOS = [
  { id: "ransomware", label: "Ransomware Outbreak", steps: [
    { action: "Isolate patient zero", target: "WKS-FIN-042" }, { action: "Block C2 communication", target: "FW-EDGE-01" },
    { action: "Kill encryption process", target: "WKS-FIN-042" }, { action: "Quarantine lateral spread", target: "DC-PROD-01" },
    { action: "Restore from snapshot", target: "WKS-FIN-042" },
  ]},
  { id: "lateral", label: "Lateral Movement", steps: [
    { action: "Detect anomalous SMB", target: "SW-CORE-02" }, { action: "Isolate source device", target: "WKS-ENG-017" },
    { action: "Block internal pivoting", target: "FW-EDGE-01" }, { action: "Revoke compromised creds", target: "AD-DC-02" },
  ]},
  { id: "dns_exfil", label: "DNS Exfiltration", steps: [
    { action: "Identify DNS tunneling", target: "PROXY-01" }, { action: "Block malicious domain", target: "FW-EDGE-01" },
    { action: "Isolate exfil source", target: "DB-CLUSTER-A" }, { action: "Audit data exposure", target: "SIEM-COLLECTOR" },
    { action: "Enforce DNS policy", target: "PROXY-01" },
  ]},
  { id: "insider", label: "Insider Threat", steps: [
    { action: "Flag bulk file access", target: "WKS-HR-003" }, { action: "Restrict cloud uploads", target: "CLOUD-S3-LOGS" },
    { action: "Disable user account", target: "AD-DC-02" }, { action: "Preserve forensic image", target: "WKS-HR-003" },
  ]},
  { id: "supply_chain", label: "Supply Chain Compromise", steps: [
    { action: "Detect malicious update", target: "WEB-SVR-03" }, { action: "Block update server", target: "FW-EDGE-01" },
    { action: "Rollback package version", target: "WEB-SVR-03" }, { action: "Scan affected endpoints", target: "SIEM-COLLECTOR" },
    { action: "Enforce package allowlist", target: "CLOUD-K8S-PROD" }, { action: "Verify integrity hashes", target: "WEB-SVR-03" },
  ]},
];

interface Props { defaultTab?: string }

export default function RespondModule({ defaultTab }: Props) {
  const [tab, setTab] = useState<string>(defaultTab || "Actions");
  const [actions, setActions] = useState<RespondAction[]>(() => generateRespondActions(12));
  const [expanded, setExpanded] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Autonomy Config state
  const [autonomyLevel, setAutonomyLevel] = useState<"confirm" | "oversight" | "autonomous">("oversight");
  const [policies, setPolicies] = useState<
    { label: string; enabled: boolean; threshold: number; schedule: string | null; requiresApproval?: boolean }[]
  >([
    { label: "Block malicious connections", enabled: true, threshold: 82, schedule: "24/7" },
    { label: "Isolate compromised devices", enabled: true, threshold: 90, schedule: "24/7" },
    { label: "Enforce pattern of life", enabled: true, threshold: 75, schedule: null },
    { label: "Quarantine malicious emails", enabled: true, threshold: 70, schedule: null },
    { label: "Disable compromised accounts", enabled: false, threshold: 95, schedule: null, requiresApproval: true },
    { label: "Restrict unusual access", enabled: true, threshold: 80, schedule: null },
  ]);

  // Simulator state
  const [scenario, setScenario] = useState(SCENARIOS[0].id);
  const [simRunning, setSimRunning] = useState(false);
  const [simSteps, setSimSteps] = useState<number>(0);

  // Auto-add action every 6s
  useEffect(() => {
    if (tab !== "Actions") return;
    const iv = setInterval(() => {
      setActions(prev => [...generateRespondActions(1), ...prev]);
    }, 6000);
    return () => clearInterval(iv);
  }, [tab]);

  // Autonomy level changes adjust sliders
  useEffect(() => {
    const base = autonomyLevel === "confirm" ? 95 : autonomyLevel === "oversight" ? 82 : 65;
    setPolicies(p => p.map(pol => ({ ...pol, threshold: Math.min(100, base + Math.round(Math.random() * 10)) })));
  }, [autonomyLevel]);

  const runSim = useCallback(() => {
    const sc = SCENARIOS.find(s => s.id === scenario)!;
    setSimRunning(true); setSimSteps(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setSimSteps(step);
      if (step >= sc.steps.length) { clearInterval(iv); setSimRunning(false); }
    }, 1500);
  }, [scenario]);

  const filtered = actions.filter(a =>
    (typeFilter === "all" || a.actionType === typeFilter) &&
    (statusFilter === "all" || a.status === statusFilter)
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const currentScenario = SCENARIOS.find(s => s.id === scenario)!;

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-surface rounded-lg w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-primary text-white" : "text-text-secondary hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Actions ── */}
      {tab === "Actions" && (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Total Actions", value: "47", icon: Zap, color: "text-primary" },
              { label: "Autonomous", value: "39", icon: Shield, color: "text-accent" },
              { label: "Avg Response", value: "1.8s", icon: Clock, color: "text-accent-blue" },
              { label: "Contained Today", value: "34", icon: CheckCircle, color: "text-green-400" },
              { label: "Pending Approval", value: "3", icon: AlertTriangle, color: "text-warning" },
            ].map(s => (
              <div key={s.label} className="bg-surface-light border border-surface-border rounded-lg p-4 cyber-border">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-text-secondary text-xs">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="bg-surface-light border border-surface-border rounded-md px-3 py-1.5 text-sm text-white">
              <option value="all">All Types</option>
              {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-surface-light border border-surface-border rounded-md px-3 py-1.5 text-sm text-white">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_approval">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filtered.map(a => (
              <div key={a.id} className="bg-surface-light border border-surface-border rounded-lg overflow-hidden card-glow">
                <button onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-border/20 transition-colors">
                  <span className="text-text-secondary text-xs w-20 shrink-0">{a.timestamp.toLocaleTimeString()}</span>
                  <span className={`${ACTION_COLORS[a.actionType]} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                    {ACTION_LABELS[a.actionType]}
                  </span>
                  <span className="text-white text-sm font-mono truncate flex-1">{a.target}</span>
                  <span className="text-text-secondary text-xs truncate max-w-[200px] hidden xl:block">{a.description}</span>
                  <span className="text-accent text-xs font-bold w-14 text-right">{a.confidence}%</span>
                  <span className={`text-xs capitalize ${STATUS_COLORS[a.status]}`}>{a.status.replace("_", " ")}</span>
                  {a.autonomous && <span className="bg-accent/20 text-accent text-[10px] px-1.5 py-0.5 rounded">AUTO</span>}
                </button>
                {expanded === a.id && (
                  <div className="px-4 pb-3 pt-1 border-t border-surface-border grid grid-cols-3 gap-4 text-sm">
                    <div><p className="text-text-secondary text-xs mb-1">Trigger Detection</p><p className="text-white">{a.triggerDetection}</p></div>
                    <div><p className="text-text-secondary text-xs mb-1">Impact Assessment</p><p className="text-white">{a.impactAssessment}</p></div>
                    <div><p className="text-text-secondary text-xs mb-1">Duration</p><p className="text-accent font-bold text-lg">{a.duration}</p></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: Autonomy Config ── */}
      {tab === "Autonomy Config" && (
        <div className="space-y-6">
          <div className="bg-surface-light border border-surface-border rounded-lg p-6 cyber-border">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> Autonomy Level</h3>
            <div className="flex gap-4">
              {([["confirm", "Human Confirmation"], ["oversight", "Human Oversight"], ["autonomous", "Fully Autonomous"]] as const).map(([val, label]) => (
                <label key={val} className={`flex-1 flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  autonomyLevel === val ? "border-primary bg-primary/10" : "border-surface-border bg-surface hover:border-primary/50"}`}>
                  <input type="radio" name="autonomy" checked={autonomyLevel === val} onChange={() => setAutonomyLevel(val)}
                    className="accent-primary" />
                  <div>
                    <p className="text-white font-medium text-sm">{label}</p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {val === "confirm" ? "All actions require human approval" : val === "oversight" ? "Auto-act with human notification" : "Full automated response"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {policies.map((pol, i) => (
              <div key={i} className="bg-surface-light border border-surface-border rounded-lg p-5 cyber-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium text-sm">{pol.label}</span>
                  <button onClick={() => setPolicies(p => p.map((x, j) => j === i ? { ...x, enabled: !x.enabled } : x))}
                    className={`w-10 h-5 rounded-full relative transition-colors ${pol.enabled ? "bg-accent" : "bg-surface-border"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${pol.enabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">Confidence Threshold</span>
                      <span className="text-accent font-bold">{pol.threshold}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={pol.threshold}
                      onChange={e => setPolicies(p => p.map((x, j) => j === i ? { ...x, threshold: +e.target.value } : x))}
                      className="w-full h-1 bg-surface-border rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
                  </div>
                  {pol.schedule !== undefined && pol.schedule !== null && (
                    <div className="flex gap-2 mt-2">
                      {["24/7", "Business Hours"].map(s => (
                        <button key={s} onClick={() => setPolicies(p => p.map((x, j) => j === i ? { ...x, schedule: s } : x))}
                          className={`text-xs px-3 py-1 rounded-md border transition-colors ${pol.schedule === s ? "border-primary bg-primary/20 text-white" : "border-surface-border text-text-secondary"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  {"requiresApproval" in pol && (
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-primary" />
                      <span className="text-text-secondary text-xs">Requires manager approval</span>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: Simulator ── */}
      {tab === "Simulator" && (
        <div className="space-y-6">
          <div className="bg-surface-light border border-surface-border rounded-lg p-6 cyber-border">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-accent" /> Attack Scenario Simulator</h3>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-text-secondary text-xs mb-1 block">Scenario</label>
                <select value={scenario} onChange={e => { setScenario(e.target.value); setSimSteps(0); }}
                  disabled={simRunning}
                  className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-white text-sm">
                  {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <button onClick={runSim} disabled={simRunning}
                className="bg-primary hover:bg-primary/80 disabled:opacity-50 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <Play className="w-4 h-4" /> {simRunning ? "Running..." : "Simulate"}
              </button>
            </div>
          </div>

          {/* Device icons */}
          <div className="flex justify-center gap-3">
            {currentScenario.steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all duration-500 ${
                  i < simSteps ? "bg-green-500/20 border-green-500 text-green-400" : simSteps > 0 || simRunning ? "bg-red-500/20 border-red-500 text-red-400" : "bg-surface border-surface-border text-text-secondary"}`}>
                  <Monitor className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-text-secondary font-mono truncate w-16 text-center">{s.target}</span>
              </div>
            ))}
          </div>

          {/* Steps timeline */}
          <div className="space-y-3">
            {currentScenario.steps.slice(0, simSteps).map((s, i) => (
              <div key={i} className="flex items-center gap-4 bg-surface-light border border-surface-border rounded-lg px-4 py-3 animate-in">
                <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{s.action}</p>
                  <p className="text-text-secondary text-xs font-mono">{s.target}</p>
                </div>
                <span className="text-accent text-xs font-bold">{((i + 1) * 1.5).toFixed(1)}s</span>
                <span className="text-accent text-xs">Complete</span>
              </div>
            ))}
          </div>

          {/* Final banner */}
          {!simRunning && simSteps >= currentScenario.steps.length && simSteps > 0 && (
            <div className="bg-accent/10 border border-accent rounded-lg p-5 text-center space-y-1">
              <p className="text-accent font-bold text-lg flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" /> Contained in {(currentScenario.steps.length * 1.5).toFixed(1)}s
              </p>
              <p className="text-text-secondary text-sm">Manual equivalent: ~{currentScenario.steps.length * 0.8} hours</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
