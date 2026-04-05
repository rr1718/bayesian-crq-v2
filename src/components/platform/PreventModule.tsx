"use client";

import { useState } from "react";
import {
  Search,
  GitBranch,
  Shield,
  Target,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Monitor,
  Server,
  Smartphone,
  Cloud,
  Database,
  ArrowRight,
} from "lucide-react";

interface PreventModuleProps {
  defaultTab?: string;
}

const TABS = [
  { id: "attack-surface", label: "Attack Surface", icon: Search },
  { id: "attack-paths", label: "Attack Paths", icon: GitBranch },
  { id: "firewall", label: "Firewall Rules", icon: Shield },
  { id: "mitre", label: "MITRE Coverage", icon: Target },
];

interface Asset {
  name: string; type: string; ip: string; os: string; dept: string;
  riskScore: number; status: "Known" | "Shadow IT"; vulns: number;
  vulnerabilities: { cve: string; cvss: number; desc: string }[];
}

const ASSETS: Asset[] = [
  { name: "dc-prod-01", type: "Server", ip: "10.0.1.10", os: "Windows Server 2022", dept: "IT", riskScore: 92, status: "Known", vulns: 5, vulnerabilities: [{ cve: "CVE-2024-21412", cvss: 9.8, desc: "Remote code execution in SMB protocol" }, { cve: "CVE-2024-20674", cvss: 8.1, desc: "Kerberos security feature bypass" }] },
  { name: "web-app-03", type: "Web App", ip: "10.0.2.45", os: "Ubuntu 22.04", dept: "Engineering", riskScore: 87, status: "Known", vulns: 4, vulnerabilities: [{ cve: "CVE-2024-3094", cvss: 10.0, desc: "XZ Utils backdoor - supply chain compromise" }] },
  { name: "dev-laptop-jm", type: "Endpoint", ip: "10.0.5.112", os: "macOS 14.2", dept: "Engineering", riskScore: 74, status: "Known", vulns: 2, vulnerabilities: [{ cve: "CVE-2024-1580", cvss: 7.5, desc: "Privilege escalation via IOKit" }] },
  { name: "shadow-nas-01", type: "NAS", ip: "10.0.8.200", os: "Synology DSM 7", dept: "Marketing", riskScore: 95, status: "Shadow IT", vulns: 6, vulnerabilities: [{ cve: "CVE-2024-10443", cvss: 9.1, desc: "Unauthenticated RCE in media service" }, { cve: "CVE-2023-52426", cvss: 7.8, desc: "Buffer overflow in SMB handler" }] },
  { name: "k8s-node-02", type: "Container", ip: "10.0.3.22", os: "Container Linux", dept: "DevOps", riskScore: 68, status: "Known", vulns: 3, vulnerabilities: [{ cve: "CVE-2024-21626", cvss: 8.6, desc: "Container escape via runc" }] },
  { name: "personal-pi", type: "IoT", ip: "10.0.9.88", os: "Raspbian", dept: "Engineering", riskScore: 81, status: "Shadow IT", vulns: 3, vulnerabilities: [{ cve: "CVE-2023-46604", cvss: 9.8, desc: "Apache ActiveMQ RCE" }] },
  { name: "vpn-gw-01", type: "Network", ip: "10.0.0.1", os: "Palo Alto PAN-OS", dept: "IT", riskScore: 45, status: "Known", vulns: 1, vulnerabilities: [{ cve: "CVE-2024-3400", cvss: 10.0, desc: "GlobalProtect command injection" }] },
  { name: "erp-staging", type: "Server", ip: "10.0.4.60", os: "RHEL 9", dept: "Finance", riskScore: 62, status: "Known", vulns: 2, vulnerabilities: [{ cve: "CVE-2024-0567", cvss: 6.5, desc: "GnuTLS certificate verification bypass" }] },
  { name: "wifi-cam-lobby", type: "IoT", ip: "10.0.9.15", os: "Embedded Linux", dept: "Facilities", riskScore: 88, status: "Shadow IT", vulns: 4, vulnerabilities: [{ cve: "CVE-2023-28771", cvss: 9.8, desc: "Unauthenticated command injection" }] },
  { name: "hr-saas-app", type: "SaaS", ip: "—", os: "Cloud", dept: "HR", riskScore: 55, status: "Known", vulns: 1, vulnerabilities: [{ cve: "CVE-2024-22243", cvss: 6.1, desc: "SSRF in API gateway" }] },
  { name: "rogue-ap-3f", type: "Network", ip: "10.0.9.222", os: "Unknown", dept: "Unknown", riskScore: 97, status: "Shadow IT", vulns: 0, vulnerabilities: [] },
  { name: "db-analytics", type: "Database", ip: "10.0.4.100", os: "PostgreSQL 15", dept: "Data", riskScore: 72, status: "Known", vulns: 2, vulnerabilities: [{ cve: "CVE-2024-0985", cvss: 8.0, desc: "Privilege escalation via REFRESH MATERIALIZED VIEW" }] },
  { name: "byod-phone-kl", type: "Mobile", ip: "10.0.7.44", os: "Android 14", dept: "Sales", riskScore: 66, status: "Shadow IT", vulns: 1, vulnerabilities: [{ cve: "CVE-2024-0031", cvss: 7.8, desc: "Bluetooth stack RCE" }] },
  { name: "ci-runner-05", type: "Container", ip: "10.0.3.55", os: "Ubuntu 22.04", dept: "DevOps", riskScore: 58, status: "Known", vulns: 2, vulnerabilities: [{ cve: "CVE-2024-24557", cvss: 7.0, desc: "Docker build cache poisoning" }] },
  { name: "legacy-print-srv", type: "Server", ip: "10.0.1.200", os: "Windows Server 2012", dept: "IT", riskScore: 91, status: "Known", vulns: 5, vulnerabilities: [{ cve: "CVE-2021-34527", cvss: 8.8, desc: "PrintNightmare - Print Spooler RCE" }, { cve: "CVE-2024-21413", cvss: 9.8, desc: "Outlook MonikerLink RCE" }] },
];

const ATTACK_PATHS = [
  { name: "Domain Admin Compromise", risk: 96, apts: ["APT29", "APT28"], steps: [
    { asset: "dev-laptop-jm", technique: "T1566.001 - Spear Phishing" },
    { asset: "web-app-03", technique: "T1078 - Valid Accounts" },
    { asset: "k8s-node-02", technique: "T1610 - Deploy Container" },
    { asset: "dc-prod-01", technique: "T1558.003 - Kerberoasting" },
  ]},
  { name: "Data Exfiltration via Shadow IT", risk: 89, apts: ["FIN7", "Lazarus"], steps: [
    { asset: "byod-phone-kl", technique: "T1091 - Replication via Media" },
    { asset: "shadow-nas-01", technique: "T1021.002 - SMB Shares" },
    { asset: "rogue-ap-3f", technique: "T1048 - Exfiltration Over C2" },
  ]},
  { name: "Supply Chain to Prod", risk: 82, apts: ["APT41"], steps: [
    { asset: "ci-runner-05", technique: "T1195.002 - Supply Chain" },
    { asset: "k8s-node-02", technique: "T1053.007 - Container Orchestration" },
    { asset: "db-analytics", technique: "T1005 - Data from Local System" },
  ]},
  { name: "IoT Pivot to Internal", risk: 78, apts: ["Volt Typhoon"], steps: [
    { asset: "wifi-cam-lobby", technique: "T1190 - Exploit Public App" },
    { asset: "vpn-gw-01", technique: "T1557 - Adversary in the Middle" },
    { asset: "erp-staging", technique: "T1210 - Exploitation of Remote Services" },
  ]},
  { name: "Legacy System Lateral Move", risk: 91, apts: ["APT28", "Sandworm"], steps: [
    { asset: "legacy-print-srv", technique: "T1210 - PrintNightmare Exploit" },
    { asset: "dc-prod-01", technique: "T1003.006 - DCSync" },
    { asset: "hr-saas-app", technique: "T1550.001 - Web Session Cookie" },
  ]},
];

const FIREWALL_RULES = [
  { id: "FW-001", name: "Allow HTTPS Outbound", src: "10.0.0.0/8", dest: "0.0.0.0/0", port: "443/TCP", action: "Allow" as const, risk: "Safe" as const, hits: 1284903 },
  { id: "FW-002", name: "Allow DNS", src: "10.0.0.0/8", dest: "10.0.0.1", port: "53/UDP", action: "Allow" as const, risk: "Safe" as const, hits: 892451 },
  { id: "FW-003", name: "Allow Any Any", src: "0.0.0.0/0", dest: "0.0.0.0/0", port: "ANY", action: "Allow" as const, risk: "Dangerous" as const, hits: 45102 },
  { id: "FW-004", name: "Block Telnet", src: "0.0.0.0/0", dest: "10.0.0.0/8", port: "23/TCP", action: "Deny" as const, risk: "Safe" as const, hits: 1203 },
  { id: "FW-005", name: "Allow SMB Internal", src: "10.0.1.0/24", dest: "10.0.4.0/24", port: "445/TCP", action: "Allow" as const, risk: "Review" as const, hits: 34521 },
  { id: "FW-006", name: "Allow RDP from VPN", src: "10.0.10.0/24", dest: "10.0.1.0/24", port: "3389/TCP", action: "Allow" as const, risk: "Review" as const, hits: 8934 },
  { id: "FW-007", name: "Allow SSH Wide", src: "0.0.0.0/0", dest: "10.0.3.0/24", port: "22/TCP", action: "Allow" as const, risk: "Dangerous" as const, hits: 22310 },
  { id: "FW-008", name: "Block ICMP External", src: "!10.0.0.0/8", dest: "10.0.0.0/8", port: "ICMP", action: "Deny" as const, risk: "Safe" as const, hits: 98201 },
  { id: "FW-009", name: "Allow DB Replication", src: "10.0.4.100", dest: "10.0.4.101", port: "5432/TCP", action: "Allow" as const, risk: "Safe" as const, hits: 445021 },
  { id: "FW-010", name: "Allow IoT Outbound", src: "10.0.9.0/24", dest: "0.0.0.0/0", port: "ANY", action: "Allow" as const, risk: "Dangerous" as const, hits: 12044 },
];

const MITRE_TACTICS = [
  { name: "Recon", id: "TA0043", coverage: 72 },
  { name: "Resource Dev", id: "TA0042", coverage: 45 },
  { name: "Initial Access", id: "TA0001", coverage: 88 },
  { name: "Execution", id: "TA0002", coverage: 91 },
  { name: "Persistence", id: "TA0003", coverage: 67 },
  { name: "Priv Esc", id: "TA0004", coverage: 78 },
  { name: "Defense Evasion", id: "TA0005", coverage: 54 },
  { name: "Credential Access", id: "TA0006", coverage: 82 },
  { name: "Discovery", id: "TA0007", coverage: 63 },
  { name: "Lateral Move", id: "TA0008", coverage: 71 },
  { name: "Collection", id: "TA0009", coverage: 59 },
  { name: "Exfiltration", id: "TA0010", coverage: 76 },
];

function riskColor(score: number) {
  if (score >= 80) return "bg-red-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-accent-blue";
  return "bg-green-500";
}

function coverageColor(pct: number) {
  if (pct >= 75) return "bg-green-500/80";
  if (pct >= 55) return "bg-yellow-500/80";
  return "bg-red-500/80";
}

export default function PreventModule({ defaultTab }: PreventModuleProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || "attack-surface");
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const assetTypes = ["All", ...Array.from(new Set(ASSETS.map((a) => a.type)))];
  const filtered = ASSETS.filter(
    (a) => (typeFilter === "All" || a.type === typeFilter) && (statusFilter === "All" || a.status === statusFilter)
  );

  const overallCoverage = Math.round(MITRE_TACTICS.reduce((s, t) => s + t.coverage, 0) / MITRE_TACTICS.length);

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-surface-light rounded-lg p-1 border border-surface-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-accent-blue text-white" : "text-text-secondary hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Attack Surface */}
      {activeTab === "attack-surface" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Assets", value: "247", sub: "" },
              { label: "Known", value: "162", sub: "" },
              { label: "Shadow IT", value: "85", sub: "34%" },
              { label: "Critical Vulns", value: "23", sub: "" },
            ].map((s) => (
              <div key={s.label} className="bg-surface-light border border-surface-border rounded-lg p-4">
                <p className="text-text-secondary text-xs uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}
                  {s.sub && <span className="text-sm text-red-400 ml-2">{s.sub}</span>}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface-light border border-surface-border text-sm text-white rounded-md px-3 py-1.5 focus:outline-none focus:border-accent-blue">
              {assetTypes.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-light border border-surface-border text-sm text-white rounded-md px-3 py-1.5 focus:outline-none focus:border-accent-blue">
              <option value="All">All Statuses</option>
              <option value="Known">Known</option>
              <option value="Shadow IT">Shadow IT</option>
            </select>
          </div>

          <div className="bg-surface-light border border-surface-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Name</th><th className="text-left px-3 py-3">Type</th>
                  <th className="text-left px-3 py-3">IP</th><th className="text-left px-3 py-3">OS</th>
                  <th className="text-left px-3 py-3">Dept</th><th className="text-left px-3 py-3 w-32">Risk</th>
                  <th className="text-left px-3 py-3">Status</th><th className="text-center px-3 py-3">Vulns</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <>
                    <tr key={a.name} onClick={() => setExpandedAsset(expandedAsset === a.name ? null : a.name)}
                      className="border-b border-surface-border/50 hover:bg-white/[0.03] cursor-pointer transition-colors">
                      <td className="px-4 py-2.5 text-white font-medium flex items-center gap-2">
                        {expandedAsset === a.name ? <ChevronDown className="w-3 h-3 text-text-secondary" /> : <ChevronRight className="w-3 h-3 text-text-secondary" />}
                        {a.name}
                      </td>
                      <td className="px-3 py-2.5 text-text-secondary">{a.type}</td>
                      <td className="px-3 py-2.5 text-text-secondary font-mono text-xs">{a.ip}</td>
                      <td className="px-3 py-2.5 text-text-secondary text-xs">{a.os}</td>
                      <td className="px-3 py-2.5 text-text-secondary">{a.dept}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${riskColor(a.riskScore)}`} style={{ width: `${a.riskScore}%` }} />
                          </div>
                          <span className="text-xs text-white w-7 text-right">{a.riskScore}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.status === "Shadow IT" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center text-white">{a.vulns}</td>
                    </tr>
                    {expandedAsset === a.name && a.vulnerabilities.length > 0 && (
                      <tr key={`${a.name}-vulns`}><td colSpan={8} className="px-8 py-3 bg-surface/60">
                        <div className="space-y-2">
                          {a.vulnerabilities.map((v) => (
                            <div key={v.cve} className="flex items-center gap-4 text-xs">
                              <span className="font-mono text-accent-blue font-medium w-36">{v.cve}</span>
                              <span className={`px-2 py-0.5 rounded font-bold ${v.cvss >= 9 ? "bg-red-500/20 text-red-400" : v.cvss >= 7 ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>
                                CVSS {v.cvss}
                              </span>
                              <span className="text-text-secondary">{v.desc}</span>
                            </div>
                          ))}
                        </div>
                      </td></tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Attack Paths */}
      {activeTab === "attack-paths" && (
        <div className="space-y-4">
          {ATTACK_PATHS.map((path) => (
            <div key={path.name} className="bg-surface-light border border-surface-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold">{path.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${path.risk >= 90 ? "bg-red-500/20 text-red-400" : path.risk >= 75 ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>
                    Risk {path.risk}
                  </span>
                </div>
                <div className="flex gap-2">
                  {path.apts.map((apt) => (
                    <span key={apt} className="px-2 py-0.5 rounded bg-primary/20 text-purple-400 text-xs font-medium">{apt}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {path.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 flex-shrink-0">
                    <div className="bg-surface border border-surface-border rounded-lg px-4 py-3 min-w-[180px]">
                      <p className="text-white text-sm font-medium">{step.asset}</p>
                      <p className="text-text-secondary text-xs mt-1">{step.technique}</p>
                    </div>
                    {i < path.steps.length - 1 && <ArrowRight className="w-4 h-4 text-red-400 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Firewall Rules */}
      {activeTab === "firewall" && (
        <div className="bg-surface-light border border-surface-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-text-secondary text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">ID</th><th className="text-left px-3 py-3">Name</th>
                <th className="text-left px-3 py-3">Source</th><th className="text-left px-3 py-3">Dest</th>
                <th className="text-left px-3 py-3">Port/Proto</th><th className="text-left px-3 py-3">Action</th>
                <th className="text-left px-3 py-3">Risk</th><th className="text-right px-4 py-3">Hit Count</th>
              </tr>
            </thead>
            <tbody>
              {FIREWALL_RULES.map((r) => (
                <tr key={r.id} className={`border-b border-surface-border/50 transition-colors ${r.risk === "Dangerous" ? "bg-red-500/[0.06]" : "hover:bg-white/[0.03]"}`}>
                  <td className="px-4 py-2.5 text-text-secondary font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2.5 text-white font-medium">{r.name}</td>
                  <td className="px-3 py-2.5 text-text-secondary font-mono text-xs">{r.src}</td>
                  <td className="px-3 py-2.5 text-text-secondary font-mono text-xs">{r.dest}</td>
                  <td className="px-3 py-2.5 text-text-secondary text-xs">{r.port}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.action === "Allow" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {r.action}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.risk === "Safe" ? "bg-green-500/20 text-green-400" : r.risk === "Review" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                      {r.risk}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-text-secondary font-mono text-xs">{r.hits.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: MITRE Coverage */}
      {activeTab === "mitre" && (
        <div className="space-y-6">
          <div className="bg-surface-light border border-surface-border rounded-lg p-5 flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider">Overall MITRE ATT&CK Coverage</p>
              <p className="text-3xl font-bold text-white mt-1">{overallCoverage}%</p>
            </div>
            <div className="w-48 h-3 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${coverageColor(overallCoverage)}`} style={{ width: `${overallCoverage}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {MITRE_TACTICS.map((t) => (
              <div key={t.id} className={`rounded-lg border border-surface-border p-3 text-center ${coverageColor(t.coverage)} bg-opacity-10`}
                style={{ backgroundColor: t.coverage >= 75 ? "rgba(34,197,94,0.1)" : t.coverage >= 55 ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)" }}>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">{t.id}</p>
                <p className="text-xs text-white font-medium mb-2 leading-tight">{t.name}</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${coverageColor(t.coverage)}`} style={{ width: `${t.coverage}%` }} />
                </div>
                <p className="text-xs font-bold text-white">{t.coverage}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
