"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Brain, Search, GitMerge, FileText, Zap, Shield, Clock, CheckCircle,
  Play, Eye, AlertTriangle, Database, Mail, Monitor, Globe,
  ChevronRight, X, Loader2,
} from "lucide-react";

interface Investigation {
  id: string; severity: "critical" | "high" | "medium" | "low";
  title: string; status: "completed" | "in_progress" | "escalated";
  mitre: string[]; assets: number; triageTime: string;
}

const investigations: Investigation[] = [
  { id: "INV-28471", severity: "critical", title: "Multi-stage phishing to DC lateral movement", status: "completed", mitre: ["Initial Access", "Lateral Movement", "Exfiltration"], assets: 14, triageTime: "18s" },
  { id: "INV-28470", severity: "high", title: "Suspicious PowerShell execution chain on finance endpoints", status: "in_progress", mitre: ["Execution", "Defense Evasion"], assets: 6, triageTime: "—" },
  { id: "INV-28469", severity: "medium", title: "Anomalous DNS queries to newly registered domain", status: "completed", mitre: ["Command and Control"], assets: 2, triageTime: "9s" },
  { id: "INV-28468", severity: "critical", title: "Credential stuffing attempt against VPN gateway", status: "escalated", mitre: ["Credential Access", "Initial Access"], assets: 1, triageTime: "31s" },
  { id: "INV-28467", severity: "high", title: "Encoded payload delivery via Teams attachment", status: "completed", mitre: ["Initial Access", "Execution"], assets: 3, triageTime: "14s" },
  { id: "INV-28466", severity: "low", title: "Failed MFA brute force on service account", status: "completed", mitre: ["Credential Access"], assets: 1, triageTime: "6s" },
  { id: "INV-28465", severity: "high", title: "Unusual cloud API calls from compromised token", status: "in_progress", mitre: ["Persistence", "Collection"], assets: 22, triageTime: "—" },
  { id: "INV-28464", severity: "medium", title: "Rogue scheduled task creation on web servers", status: "completed", mitre: ["Persistence", "Privilege Escalation"], assets: 4, triageTime: "12s" },
];

const sevColor: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const statusStyle: Record<string, string> = {
  completed: "text-[#00d4aa]", in_progress: "text-yellow-400", escalated: "text-red-400",
};

const dataSources = ["Network Logs", "Email Metadata", "Cloud API Calls", "Endpoint Telemetry", "Identity Records", "Threat Intelligence"];
const correlatedEvents = [
  "Email with malicious link received by j.martinez@corp",
  "Credential harvest page accessed from WKS-FIN-042",
  "Unusual NTLM auth from WKS-FIN-042 to DC-PROD-01",
  "PowerShell encoded command execution on DC-PROD-01",
  "4.7GB data transfer to external IP via encrypted channel",
];
const recommendedActions = [
  "Isolate WKS-FIN-042", "Reset j.martinez credentials", "Block external IP range",
  "Deploy enhanced monitoring on DC-PROD-01", "Initiate incident response playbook",
];

const narrative = `At 09:14 UTC, a phishing email containing a credential-harvesting link was delivered to j.martinez@corp, bypassing email gateway controls via a lookalike domain. The user clicked the link at 09:17 UTC from workstation WKS-FIN-042, submitting domain credentials to an attacker-controlled server hosted on infrastructure matching known threat actor TA-4091 patterns.

Within 8 minutes of credential capture, the attacker authenticated to the corporate network using the compromised credentials and initiated lateral movement from WKS-FIN-042 to DC-PROD-01 using NTLM pass-the-hash techniques. On DC-PROD-01, an encoded PowerShell command was executed to establish persistence via a scheduled task and begin reconnaissance of Active Directory objects.

Between 09:32 and 10:14 UTC, approximately 4.7GB of data was exfiltrated from DC-PROD-01 to an external IP (198.51.100.47) over an encrypted channel on port 443, masquerading as legitimate HTTPS traffic. The data transfer pattern is consistent with staged exfiltration using chunked encoding to evade DLP controls.

Severity assessment: CRITICAL. The attack chain demonstrates sophisticated tradecraft including credential harvesting, lateral movement, privilege escalation, and data exfiltration. Immediate containment actions are required to prevent further compromise.`;

export default function AIAnalystModule({ defaultTab }: { defaultTab?: string }) {
  const [tab, setTab] = useState(defaultTab || "queue");
  const [selected, setSelected] = useState<Investigation | null>(null);
  // Live investigation state
  const [simStep, setSimStep] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const [checkedSources, setCheckedSources] = useState<number>(0);
  const [shownEvents, setShownEvents] = useState<number>(0);
  const [executed, setExecuted] = useState<Set<number>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const startSimulation = useCallback(() => {
    clearTimers();
    setSimStep(0); setCheckedSources(0); setShownEvents(0); setExecuted(new Set());
    setSimRunning(true); setTab("live");
    const t = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };
    t(() => setSimStep(1), 1000);
    t(() => setSimStep(2), 3000);
    for (let i = 0; i < 6; i++) t(() => setCheckedSources(p => p + 1), 3500 + i * 500);
    t(() => setSimStep(3), 6000);
    for (let i = 0; i < 5; i++) t(() => setShownEvents(p => p + 1), 6500 + i * 600);
    t(() => setSimStep(4), 9000);
    t(() => { setSimStep(5); setSimRunning(false); }, 11000);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  const progress = simStep === 0 ? 0 : simStep === 1 ? 15 : simStep === 2 ? 35 : simStep === 3 ? 60 : simStep === 4 ? 85 : 100;

  const handleExecute = (i: number) => setExecuted(prev => new Set(prev).add(i));

  const stats = [
    { label: "Total Investigations", value: "1,847", icon: Search },
    { label: "In Progress", value: "3", icon: Loader2 },
    { label: "Completed", value: "1,831", icon: CheckCircle },
    { label: "Escalated", value: "13", icon: AlertTriangle },
    { label: "Avg Triage", value: "23s", icon: Clock },
    { label: "FTE Saved", value: "~28", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-[#2a2b3d] bg-[#12131f] p-1">
          {[{ id: "queue", label: "Queue" }, { id: "live", label: "Live Investigation" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t.id ? "bg-[#6c3bf5] text-white" : "text-[#8892a4] hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === "queue" && (
          <button onClick={startSimulation}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c3bf5] hover:bg-[#5b2de0] text-white text-sm font-medium transition-colors">
            <Play className="w-4 h-4" /> Run New Investigation
          </button>
        )}
      </div>

      {/* Queue Tab */}
      {tab === "queue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map(s => (
              <div key={s.label} className="rounded-lg border border-[#2a2b3d] bg-[#1a1b2e] p-4">
                <div className="flex items-center gap-2 text-[#8892a4] text-xs mb-2">
                  <s.icon className="w-3.5 h-3.5" />{s.label}
                </div>
                <div className="text-xl font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {/* Investigation List */}
            <div className={`space-y-2 transition-all ${selected ? "w-1/2" : "w-full"}`}>
              {investigations.map(inv => (
                <button key={inv.id} onClick={() => setSelected(inv)}
                  className={`w-full text-left rounded-lg border p-4 transition-colors ${selected?.id === inv.id ? "border-[#6c3bf5] bg-[#6c3bf5]/10" : "border-[#2a2b3d] bg-[#1a1b2e] hover:border-[#6c3bf5]/50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#8892a4]">{inv.id}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${sevColor[inv.severity]}`}>{inv.severity}</span>
                      <span className={`text-xs ${statusStyle[inv.status]}`}>{inv.status.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8892a4]">
                      <Monitor className="w-3 h-3" />{inv.assets} assets
                      <Clock className="w-3 h-3 ml-2" />{inv.triageTime}
                    </div>
                  </div>
                  <p className="text-sm text-white">{inv.title}</p>
                  <div className="flex gap-1.5 mt-2">
                    {inv.mitre.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#6c3bf5]/15 text-[#6c3bf5] border border-[#6c3bf5]/20">{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Detail Panel */}
            {selected && (
              <div className="w-1/2 rounded-lg border border-[#2a2b3d] bg-[#1a1b2e] p-5 space-y-4 overflow-y-auto max-h-[700px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">{selected.id}</h3>
                  <button onClick={() => setSelected(null)} className="text-[#8892a4] hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-white">{selected.title}</p>
                <Section title="Summary" icon={FileText}>
                  <p className="text-sm text-[#8892a4]">Automated triage identified a {selected.severity}-severity event chain involving {selected.assets} assets. MITRE ATT&CK tactics: {selected.mitre.join(", ")}.</p>
                </Section>
                <Section title="Hypothesis" icon={Brain}>
                  <p className="text-sm text-[#8892a4]">The observed activity is consistent with a targeted intrusion leveraging {selected.mitre[0].toLowerCase()} techniques, likely orchestrated by an automated or semi-automated adversary toolkit.</p>
                </Section>
                <Section title="Key Findings" icon={Search}>
                  <ul className="text-sm text-[#8892a4] list-disc list-inside space-y-1">
                    <li>Anomalous authentication patterns detected across {selected.assets} endpoints</li>
                    <li>Correlated events match known attack chain signatures</li>
                    <li>Triage completed in {selected.triageTime}</li>
                  </ul>
                </Section>
                <Section title="Narrative" icon={FileText}>
                  <p className="text-sm text-[#8892a4]">The investigation was initiated by automated alert correlation. Sequential analysis of {selected.mitre.length} attack stages revealed a coherent adversary workflow. All relevant artifacts have been preserved for forensic review.</p>
                </Section>
                <Section title="Actions Taken" icon={Shield}>
                  <div className="flex flex-wrap gap-2">
                    {["Contained affected hosts", "Notified SOC lead", "Preserved evidence"].map(a => (
                      <span key={a} className="text-xs px-2 py-1 rounded bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />{a}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Investigation Tab */}
      {tab === "live" && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="rounded-lg border border-[#2a2b3d] bg-[#1a1b2e] p-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-white font-medium">Investigation Progress</span>
              <span className="text-[#00d4aa]">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#12131f] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#6c3bf5] to-[#00d4aa] transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {simStep === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-[#8892a4]">
              <Brain className="w-10 h-10 mb-3 animate-pulse text-[#6c3bf5]" />
              <p className="text-sm">Initializing AI Analyst...</p>
            </div>
          )}

          {/* Step 1: Hypothesis */}
          {simStep >= 1 && (
            <StepCard step={1} title="Forming Hypothesis" icon={Brain} active={simStep === 1}>
              {simStep === 1 && <Brain className="w-6 h-6 text-[#6c3bf5] animate-pulse" />}
              <p className="text-sm text-[#8892a4] mt-2">
                <span className="text-[#00d4aa] font-medium">Hypothesis:</span> Coordinated multi-stage attack originating from phishing email, with lateral movement to domain controller and potential data exfiltration via encrypted channel.
              </p>
            </StepCard>
          )}

          {/* Step 2: Data Sources */}
          {simStep >= 2 && (
            <StepCard step={2} title="Querying Data Sources" icon={Database} active={simStep === 2}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {dataSources.map((src, i) => (
                  <div key={src} className={`flex items-center gap-2 text-sm px-3 py-2 rounded border transition-all duration-300 ${i < checkedSources ? "border-[#00d4aa]/30 bg-[#00d4aa]/5 text-[#00d4aa]" : "border-[#2a2b3d] text-[#8892a4]"}`}>
                    {i < checkedSources ? <CheckCircle className="w-4 h-4 shrink-0" /> : <Loader2 className="w-4 h-4 shrink-0 animate-spin" />}
                    {src}
                  </div>
                ))}
              </div>
            </StepCard>
          )}

          {/* Step 3: Correlated Events */}
          {simStep >= 3 && (
            <StepCard step={3} title="Correlating Events" icon={GitMerge} active={simStep === 3}>
              <div className="space-y-2 mt-2">
                {correlatedEvents.slice(0, shownEvents).map((ev, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#8892a4] pl-2 border-l-2 border-[#6c3bf5]/40 py-1 animate-[fadeIn_0.3s_ease-in]">
                    <ChevronRight className="w-4 h-4 text-[#6c3bf5] shrink-0 mt-0.5" />{ev}
                  </div>
                ))}
              </div>
            </StepCard>
          )}

          {/* Step 4: Report */}
          {simStep >= 4 && (
            <StepCard step={4} title="Generating Report" icon={FileText} active={simStep === 4}>
              <div className="mt-2 space-y-3 text-sm text-[#8892a4] leading-relaxed">
                {narrative.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <div>
                  <span className="text-[10px] uppercase text-[#8892a4] block mb-1">AI Models Used</span>
                  <div className="flex gap-2">
                    {["DIGEST", "DEMIST-2"].map(m => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded bg-[#6c3bf5]/15 text-[#6c3bf5] border border-[#6c3bf5]/25 font-mono">{m}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#8892a4] block mb-1">MITRE Tactics</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {["Initial Access", "Lateral Movement", "Execution", "Exfiltration"].map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#8892a4] block mb-1">Affected Assets</span>
                  <span className="text-sm text-white font-medium">WKS-FIN-042, DC-PROD-01</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#8892a4] block mb-1">Affected Users</span>
                  <span className="text-sm text-white font-medium">j.martinez@corp</span>
                </div>
              </div>
            </StepCard>
          )}

          {/* Step 5: Actions */}
          {simStep >= 5 && (
            <StepCard step={5} title="Recommended Actions" icon={Zap} active={simStep === 5}>
              <div className="space-y-2 mt-2">
                {recommendedActions.map((action, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded border border-[#2a2b3d] bg-[#12131f]">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Shield className="w-4 h-4 text-[#6c3bf5]" />{action}
                    </div>
                    {executed.has(i) ? (
                      <span className="flex items-center gap-1 text-xs text-[#00d4aa]"><CheckCircle className="w-4 h-4" />Executed</span>
                    ) : (
                      <button onClick={() => handleExecute(i)}
                        className="text-xs px-3 py-1 rounded bg-[#6c3bf5] hover:bg-[#5b2de0] text-white transition-colors">Execute</button>
                    )}
                  </div>
                ))}
              </div>
            </StepCard>
          )}

          {/* Bottom Stats */}
          {simStep >= 5 && (
            <div className="rounded-lg border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-4 flex items-center justify-center gap-8 text-sm">
              <span className="text-[#00d4aa] font-medium flex items-center gap-1.5"><Clock className="w-4 h-4" />Triage: 11 seconds</span>
              <span className="text-[#8892a4]">Manual equivalent: 4.2 hours</span>
              <span className="text-white font-bold">Effort saved: 99.9%</span>
            </div>
          )}

          {!simRunning && simStep === 0 && (
            <button onClick={startSimulation}
              className="mx-auto flex items-center gap-2 px-6 py-3 rounded-lg bg-[#6c3bf5] hover:bg-[#5b2de0] text-white font-medium transition-colors">
              <Play className="w-5 h-5" /> Start Investigation
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase text-[#8892a4] flex items-center gap-1.5 mb-2"><Icon className="w-3.5 h-3.5" />{title}</h4>
      {children}
    </div>
  );
}

function StepCard({ step, title, icon: Icon, active, children }: { step: number; title: string; icon: React.ElementType; active: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg border p-5 transition-colors ${active ? "border-[#6c3bf5] bg-[#6c3bf5]/5" : "border-[#2a2b3d] bg-[#1a1b2e]"}`}>
      <div className="flex items-center gap-3 mb-1">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#6c3bf5]/20 text-[#6c3bf5] text-xs font-bold">{step}</span>
        <Icon className={`w-5 h-5 ${active ? "text-[#6c3bf5] animate-pulse" : "text-[#00d4aa]"}`} />
        <h3 className="text-white font-medium text-sm">{title}</h3>
        {!active && <CheckCircle className="w-4 h-4 text-[#00d4aa] ml-auto" />}
      </div>
      {children}
    </div>
  );
}
