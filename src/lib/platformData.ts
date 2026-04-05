export interface Detection {
  id: string;
  modelName: string;
  score: number;
  device: string;
  deviceIP: string;
  timestamp: Date;
  domain: "network" | "email" | "cloud" | "endpoint" | "identity" | "ot";
  mitreMapping: string;
  mitreTactic: string;
  description: string;
  patternDeviations: PatternDeviation[];
  rawEvents: string[];
  relatedDetections: string[];
}

export interface PatternDeviation {
  metric: string;
  normalMin: number;
  normalMax: number;
  observed: number;
  unit: string;
  sigma: number;
}

const DEVICE_NAMES = [
  "DC-PROD-01", "WEB-SVR-03", "DB-CLUSTER-A", "FW-EDGE-01", "SW-CORE-02",
  "WKS-FIN-042", "WKS-ENG-017", "WKS-HR-003", "IOT-CAM-12", "IOT-HVAC-05",
  "CLOUD-K8S-PROD", "CLOUD-S3-LOGS", "OT-PLC-07", "OT-HMI-02", "MAIL-GW-01",
  "VPN-CONC-01", "PROXY-01", "SIEM-COLLECTOR", "AD-DC-02", "BACKUP-NAS-01",
];

const DOMAINS = ["network", "email", "cloud", "endpoint", "identity", "ot"] as const;

const MODEL_NAMES = [
  "Lateral Movement Detector",
  "Beaconing Analysis Engine",
  "Data Exfil Volumetric Model",
  "Credential Abuse Classifier",
  "Anomalous Process Tree",
  "DNS Tunneling Detector",
  "Insider Threat Behavioral Model",
  "Brute Force Correlator",
  "Fileless Malware Heuristic",
  "Privilege Escalation Monitor",
  "Cloud API Abuse Detector",
  "Email Header Anomaly Model",
  "OT Protocol Deviation Engine",
  "Identity Graph Anomaly",
  "Encrypted C2 Classifier",
];

const MITRE_MAPPINGS: { id: string; tactic: string }[] = [
  { id: "T1071.001", tactic: "Command and Control" },
  { id: "T1059.001", tactic: "Execution" },
  { id: "T1078", tactic: "Persistence" },
  { id: "T1048.002", tactic: "Exfiltration" },
  { id: "T1110.003", tactic: "Credential Access" },
  { id: "T1021.002", tactic: "Lateral Movement" },
  { id: "T1027", tactic: "Defense Evasion" },
  { id: "T1053.005", tactic: "Privilege Escalation" },
  { id: "T1566.001", tactic: "Initial Access" },
  { id: "T1190", tactic: "Initial Access" },
  { id: "T1556.001", tactic: "Credential Access" },
  { id: "T1569.002", tactic: "Execution" },
];

const DESCRIPTIONS = [
  "Anomalous lateral movement pattern detected: device initiated connections to 14 new internal hosts within 3 minutes, exceeding 4.7σ from 30-day baseline.",
  "Beaconing activity identified with regular interval HTTP POST requests every 62±2 seconds to external IP 185.234.xx.xx over encrypted channel.",
  "Volumetric data exfiltration: 4.7GB transferred to external endpoint over 45 minutes via DNS over HTTPS, 12.3σ above normal daily volume.",
  "Credential stuffing attempt: 847 unique username/password combinations attempted against VPN gateway from distributed IP range in 10 minutes.",
  "Fileless execution chain: PowerShell invoked from WMI, spawned encoded script loading .NET assembly from memory with no disk artifact.",
  "DNS tunneling detected: TXT record queries to newly registered domain at 340 queries/min with high entropy payload encoding.",
  "Insider risk: bulk document access pattern (142 files in 8 minutes) from user flagged in HR departure pipeline, outside normal hours.",
  "Cloud API anomaly: 2,400 S3 ListBucket calls from service account in 5 minutes, 8.1σ above baseline. Possible reconnaissance.",
  "OT protocol deviation: Modbus function code 8 (diagnostics) sent to PLC from IT subnet workstation, never observed in 90-day baseline.",
  "Identity graph anomaly: service account svc-backup authenticated from 3 new geographic locations within 12 minutes.",
  "Encrypted C2 channel: TLS session to known threat infrastructure with JA3 hash matching Cobalt Strike malleable C2 profile.",
  "Email header anomaly: SPF soft-fail with DKIM mismatch on 34 emails from spoofed executive sender in 2-hour window.",
];

const RAW_EVENTS = [
  "2026-04-05T14:23:01Z | SRC:10.42.1.17 DST:10.42.8.3 | TCP/445 | SMB Session Setup | 2.4KB",
  "2026-04-05T14:23:03Z | SRC:10.42.1.17 DST:10.42.8.5 | TCP/135 | RPC Endpoint Mapper | 1.1KB",
  "2026-04-05T14:23:05Z | SRC:10.42.1.17 DST:10.42.9.12 | TCP/5985 | WinRM Session | 4.8KB",
  "2026-04-05T14:23:07Z | DNS Query: update-check.xyz123.com | Type: TXT | Response: 342 bytes",
  "2026-04-05T14:23:09Z | HTTPS POST 185.234.72.19:443 | Content-Length: 1847 | JA3: a0e9f5d6...",
  "2026-04-05T14:23:11Z | Process: powershell.exe | PID: 7842 | CMD: -enc SQBFAFg...",
  "2026-04-05T14:23:13Z | AUTH: NTLM | User: svc-backup | Source: 10.42.3.88 | Result: SUCCESS",
  "2026-04-05T14:23:15Z | S3:ListBucket | Bucket: prod-financial-data | Caller: svc-pipeline",
  "2026-04-05T14:23:17Z | Modbus TCP | FuncCode: 8 | Unit: PLC-07 | SRC: 10.42.1.17",
  "2026-04-05T14:23:19Z | EMAIL | From: ceo@company.com | SPF: softfail | DKIM: fail | To: finance@",
];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIP(): string {
  return `10.${42 + Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

let detectionCounter = 0;

function generatePatternDeviations(): PatternDeviation[] {
  const templates: { metric: string; normalMin: number; normalMax: number; unit: string }[] = [
    { metric: "Outbound Connections/hr", normalMin: 20, normalMax: 65, unit: "conn" },
    { metric: "Data Volume", normalMin: 0.5, normalMax: 3.2, unit: "GB/day" },
    { metric: "DNS Queries/min", normalMin: 5, normalMax: 25, unit: "q/min" },
    { metric: "Auth Attempts/hr", normalMin: 2, normalMax: 12, unit: "attempts" },
    { metric: "Process Spawns/hr", normalMin: 10, normalMax: 45, unit: "procs" },
    { metric: "Unique Destinations/hr", normalMin: 3, normalMax: 18, unit: "IPs" },
  ];

  const count = 3 + Math.floor(Math.random() * 3);
  const shuffled = [...templates].sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map((t) => {
    const range = t.normalMax - t.normalMin;
    const sigma = 0.5 + Math.random() * 4.5;
    const direction = Math.random() > 0.3 ? 1 : -1;
    const observed = Math.round(((t.normalMin + t.normalMax) / 2 + direction * sigma * (range / 4)) * 10) / 10;
    return {
      metric: t.metric,
      normalMin: t.normalMin,
      normalMax: t.normalMax,
      observed: Math.max(0, observed),
      unit: t.unit,
      sigma: Math.round(sigma * 10) / 10,
    };
  });
}

export function generateDetections(count: number): Detection[] {
  const detections: Detection[] = [];
  for (let i = 0; i < count; i++) {
    detections.push(generateSingleDetection(i * 4000));
  }
  return detections;
}

function generateSingleDetection(ageMs: number = 0): Detection {
  detectionCounter++;
  const mitre = randomItem(MITRE_MAPPINGS);
  const rawCount = 2 + Math.floor(Math.random() * 4);
  const rawEvents: string[] = [];
  for (let j = 0; j < rawCount; j++) {
    rawEvents.push(randomItem(RAW_EVENTS));
  }
  const relatedCount = Math.floor(Math.random() * 3);
  const related: string[] = [];
  for (let j = 0; j < relatedCount; j++) {
    related.push(`DET-${String(Math.max(1, detectionCounter - 1 - Math.floor(Math.random() * 10))).padStart(6, "0")}`);
  }

  return {
    id: `DET-${String(detectionCounter).padStart(6, "0")}`,
    modelName: randomItem(MODEL_NAMES),
    score: Math.round((0.3 + Math.random() * 0.7) * 100) / 100,
    device: randomItem(DEVICE_NAMES),
    deviceIP: randomIP(),
    timestamp: new Date(Date.now() - ageMs),
    domain: randomItem(DOMAINS),
    mitreMapping: mitre.id,
    mitreTactic: mitre.tactic,
    description: randomItem(DESCRIPTIONS),
    patternDeviations: generatePatternDeviations(),
    rawEvents,
    relatedDetections: related,
  };
}

export function generateNewDetection(): Detection {
  return generateSingleDetection(0);
}

// ── RESPOND Module Data ──────────────────────────────────────────────

export interface RespondAction {
  id: string;
  timestamp: Date;
  actionType: "block_connection" | "isolate_device" | "kill_process" | "quarantine_email" | "disable_account" | "restrict_access" | "enforce_pol";
  target: string;
  description: string;
  confidence: number;
  status: "completed" | "in_progress" | "pending_approval" | "failed";
  autonomous: boolean;
  triggerDetection: string;
  impactAssessment: string;
  duration: string;
}

const RESPOND_TARGETS = [
  ...DEVICE_NAMES,
  "10.42.18.207", "10.88.3.54", "172.16.9.102",
  "user:j.martinez@corp.local", "user:s.chen@corp.local",
  "user:d.wilson@corp.local", "svc-pipeline@corp.local",
];

const RESPOND_DESCRIPTIONS: Record<RespondAction["actionType"], string[]> = {
  block_connection: [
    "Blocked outbound C2 connection to 185.220.101.x on port 443",
    "Terminated suspicious SSH tunnel to external IP range",
    "Blocked lateral movement via SMB to domain controller",
    "Dropped encrypted traffic to known malicious infrastructure",
  ],
  isolate_device: [
    "Device isolated from network — ransomware encryption activity detected",
    "Endpoint quarantined after credential dumping tool execution",
    "Workstation isolated due to anomalous beaconing behavior",
    "Server isolated — unauthorized privilege escalation detected",
  ],
  kill_process: [
    "Terminated malicious PowerShell process with encoded payload",
    "Killed process injecting into LSASS memory space",
    "Stopped unauthorized data compression utility execution",
    "Terminated reverse shell process on compromised endpoint",
  ],
  quarantine_email: [
    "Quarantined phishing email with weaponized Excel attachment",
    "Removed credential harvesting emails from 47 mailboxes",
    "Blocked BEC attempt targeting finance department wire transfer",
    "Quarantined spear-phishing campaign impersonating CEO",
  ],
  disable_account: [
    "Disabled compromised service account after brute-force success",
    "Locked user account following impossible travel detection",
    "Disabled account after credential leak found on dark web",
    "Suspended account performing bulk data access outside hours",
  ],
  restrict_access: [
    "Restricted VPN access to compromised user pending investigation",
    "Limited cloud resource access after unusual API call pattern",
    "Enforced MFA step-up for suspicious session from new geolocation",
    "Restricted database access after anomalous query volume detected",
  ],
  enforce_pol: [
    "Enforced pattern of life — blocked non-standard process execution",
    "Restricted device to baseline network behavior model",
    "Enforced normal communication pattern — anomalous DNS blocked",
    "Applied behavioral lockdown — only known-good processes allowed",
  ],
};

const RESPOND_TRIGGER_DETECTIONS = [
  "AI correlation engine detected multi-stage attack pattern across 3 devices",
  "Behavioral analysis flagged 4.7σ deviation from device baseline",
  "Threat intelligence match — IOC linked to APT-29 campaign",
  "Anomaly detection: unusual data flow volume exceeding 3x daily average",
  "Real-time ML model classified activity as malicious with 97.2% confidence",
  "Cross-domain correlation identified coordinated attack across email and endpoint",
  "Network traffic analysis revealed encrypted C2 beaconing pattern",
  "Identity analytics detected impossible travel for privileged account",
  "File integrity monitoring triggered on critical system binary modification",
  "Deception technology triggered — honeypot interaction from internal IP",
];

const RESPOND_IMPACT_ASSESSMENTS = [
  "Low business impact — non-critical endpoint, no active users affected",
  "Medium impact — development server isolated, 3 engineers notified",
  "Minimal impact — automated failover maintained service availability",
  "High impact — finance workstation quarantined during business hours, escalated to SOC",
  "No user impact — IoT device isolation does not affect business operations",
  "Low impact — email quarantine affected 12 messages, 2 legitimate re-released",
  "Medium impact — VPN access restricted for 1 user, temporary alternative provided",
  "Minimal impact — pattern of life enforcement transparent to normal operations",
];

const RESPOND_DURATIONS = [
  "0.3s", "0.5s", "0.8s", "1.1s", "1.4s", "1.8s", "2.1s", "2.7s", "3.2s", "0.2s",
];

const RESPOND_ACTION_TYPES: RespondAction["actionType"][] = [
  "block_connection", "isolate_device", "kill_process", "quarantine_email",
  "disable_account", "restrict_access", "enforce_pol",
];

const RESPOND_STATUSES: RespondAction["status"][] = [
  "completed", "completed", "completed", "completed", "in_progress", "pending_approval", "failed",
];

let respondCounter = 1000;

export function generateRespondActions(count: number = 1): RespondAction[] {
  const actions: RespondAction[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    respondCounter++;
    const actionType = randomItem(RESPOND_ACTION_TYPES);
    const isAutonomous = Math.random() > 0.3;
    const status: RespondAction["status"] = isAutonomous
      ? (Math.random() > 0.1 ? "completed" : "in_progress")
      : randomItem(RESPOND_STATUSES);
    actions.push({
      id: `RSP-${String(respondCounter).padStart(5, "0")}`,
      timestamp: new Date(now - i * (Math.random() * 120000 + 30000)),
      actionType,
      target: randomItem(RESPOND_TARGETS),
      description: randomItem(RESPOND_DESCRIPTIONS[actionType]),
      confidence: Math.round((75 + Math.random() * 25) * 10) / 10,
      status,
      autonomous: isAutonomous,
      triggerDetection: randomItem(RESPOND_TRIGGER_DETECTIONS),
      impactAssessment: randomItem(RESPOND_IMPACT_ASSESSMENTS),
      duration: randomItem(RESPOND_DURATIONS),
    });
  }
  return actions;
}

// ── HEAL Module Data ────────────────────────────────────────────────

export interface PlaybookStep {
  id: string;
  order: number;
  action: string;
  type: "automated" | "manual" | "approval";
  status: "pending" | "in_progress" | "completed" | "failed";
  estimatedTime: string;
  assignee: string;
}

export interface IncidentPlaybook {
  id: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  estimatedRecovery: string;
  estimatedRecoveryMinutes: number;
  steps: PlaybookStep[];
}

export interface SimulationStage {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: string;
}

export interface SimulationFinding {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

export interface AttackSimulation {
  id: string;
  name: string;
  type: "tabletop" | "red_team" | "purple_team" | "automated";
  status: "scheduled" | "running" | "completed" | "failed";
  attackVector: string;
  targetAssets: string[];
  stages: SimulationStage[];
  findings: SimulationFinding[];
  score: number;
  startedAt?: string;
  completedAt?: string;
}

export function generatePlaybook(incidentType: string): IncidentPlaybook {
  const playbooks: Record<string, IncidentPlaybook> = {
    "Ransomware Attack": {
      id: "pb-001",
      title: "Ransomware Attack Response Playbook",
      priority: "critical",
      estimatedRecovery: "4-6 hours",
      estimatedRecoveryMinutes: 300,
      steps: [
        { id: "s1", order: 1, action: "Isolate affected endpoints from network", type: "automated", status: "pending", estimatedTime: "2 min", assignee: "SOC Automation" },
        { id: "s2", order: 2, action: "Block malicious C2 domains at firewall", type: "automated", status: "pending", estimatedTime: "1 min", assignee: "SOC Automation" },
        { id: "s3", order: 3, action: "Capture forensic memory dump from patient zero", type: "manual", status: "pending", estimatedTime: "15 min", assignee: "Forensics Team" },
        { id: "s4", order: 4, action: "Identify ransomware strain and encryption method", type: "manual", status: "pending", estimatedTime: "30 min", assignee: "Malware Analyst" },
        { id: "s5", order: 5, action: "Assess lateral movement and scope of encryption", type: "automated", status: "pending", estimatedTime: "5 min", assignee: "SOC Automation" },
        { id: "s6", order: 6, action: "Notify CISO and Legal for breach assessment", type: "approval", status: "pending", estimatedTime: "10 min", assignee: "Incident Commander" },
        { id: "s7", order: 7, action: "Disable compromised service accounts", type: "automated", status: "pending", estimatedTime: "1 min", assignee: "SOC Automation" },
        { id: "s8", order: 8, action: "Begin restoration from clean backups", type: "manual", status: "pending", estimatedTime: "120 min", assignee: "Infrastructure Team" },
        { id: "s9", order: 9, action: "Validate restored systems integrity", type: "manual", status: "pending", estimatedTime: "45 min", assignee: "QA Team" },
        { id: "s10", order: 10, action: "Approve reconnection of restored systems to network", type: "approval", status: "pending", estimatedTime: "15 min", assignee: "CISO" },
        { id: "s11", order: 11, action: "Re-enable network connectivity for clean systems", type: "automated", status: "pending", estimatedTime: "3 min", assignee: "SOC Automation" },
        { id: "s12", order: 12, action: "Deploy enhanced monitoring rules for IOCs", type: "automated", status: "pending", estimatedTime: "5 min", assignee: "SOC Automation" },
      ],
    },
    "Business Email Compromise": {
      id: "pb-002",
      title: "Business Email Compromise Response Playbook",
      priority: "high",
      estimatedRecovery: "2-3 hours",
      estimatedRecoveryMinutes: 150,
      steps: [
        { id: "s1", order: 1, action: "Reset compromised user credentials immediately", type: "automated", status: "pending", estimatedTime: "1 min", assignee: "SOC Automation" },
        { id: "s2", order: 2, action: "Revoke all active OAuth tokens for affected accounts", type: "automated", status: "pending", estimatedTime: "2 min", assignee: "SOC Automation" },
        { id: "s3", order: 3, action: "Review mailbox rules for auto-forwarding to external addresses", type: "manual", status: "pending", estimatedTime: "15 min", assignee: "Email Security" },
        { id: "s4", order: 4, action: "Analyze email headers and trace attack origin", type: "manual", status: "pending", estimatedTime: "30 min", assignee: "Forensics Team" },
        { id: "s5", order: 5, action: "Identify all recipients of fraudulent emails", type: "automated", status: "pending", estimatedTime: "5 min", assignee: "SOC Automation" },
        { id: "s6", order: 6, action: "Notify finance department of potential wire fraud", type: "approval", status: "pending", estimatedTime: "10 min", assignee: "Incident Commander" },
        { id: "s7", order: 7, action: "Block sender domains and add to threat intelligence", type: "automated", status: "pending", estimatedTime: "2 min", assignee: "SOC Automation" },
        { id: "s8", order: 8, action: "Enable MFA enforcement for all affected accounts", type: "manual", status: "pending", estimatedTime: "20 min", assignee: "Identity Team" },
        { id: "s9", order: 9, action: "Send employee awareness notification", type: "approval", status: "pending", estimatedTime: "15 min", assignee: "Communications" },
      ],
    },
    "Data Breach - Cloud Storage": {
      id: "pb-003",
      title: "Cloud Storage Data Breach Response Playbook",
      priority: "critical",
      estimatedRecovery: "6-8 hours",
      estimatedRecoveryMinutes: 420,
      steps: [
        { id: "s1", order: 1, action: "Revoke public access on exposed storage buckets", type: "automated", status: "pending", estimatedTime: "1 min", assignee: "SOC Automation" },
        { id: "s2", order: 2, action: "Rotate all access keys for affected cloud accounts", type: "automated", status: "pending", estimatedTime: "3 min", assignee: "SOC Automation" },
        { id: "s3", order: 3, action: "Audit CloudTrail/activity logs for unauthorized access", type: "manual", status: "pending", estimatedTime: "45 min", assignee: "Cloud Security" },
        { id: "s4", order: 4, action: "Identify scope of exposed data and classification level", type: "manual", status: "pending", estimatedTime: "60 min", assignee: "Data Privacy Team" },
        { id: "s5", order: 5, action: "Approve regulatory notification (GDPR/CCPA assessment)", type: "approval", status: "pending", estimatedTime: "30 min", assignee: "Legal / DPO" },
        { id: "s6", order: 6, action: "Deploy WAF rules to block suspicious IP ranges", type: "automated", status: "pending", estimatedTime: "5 min", assignee: "SOC Automation" },
        { id: "s7", order: 7, action: "Scan all cloud storage for additional misconfigurations", type: "automated", status: "pending", estimatedTime: "15 min", assignee: "SOC Automation" },
        { id: "s8", order: 8, action: "Implement bucket policies and encryption enforcement", type: "manual", status: "pending", estimatedTime: "90 min", assignee: "Cloud Engineering" },
        { id: "s9", order: 9, action: "Notify affected individuals if PII exposed", type: "approval", status: "pending", estimatedTime: "60 min", assignee: "Legal / Communications" },
        { id: "s10", order: 10, action: "Deploy CSPM monitoring for continuous compliance", type: "automated", status: "pending", estimatedTime: "10 min", assignee: "SOC Automation" },
      ],
    },
    "Insider Threat": {
      id: "pb-004",
      title: "Insider Threat Response Playbook",
      priority: "high",
      estimatedRecovery: "3-5 hours",
      estimatedRecoveryMinutes: 240,
      steps: [
        { id: "s1", order: 1, action: "Restrict suspect user account access to critical systems", type: "automated", status: "pending", estimatedTime: "1 min", assignee: "SOC Automation" },
        { id: "s2", order: 2, action: "Enable enhanced DLP monitoring for suspect activity", type: "automated", status: "pending", estimatedTime: "3 min", assignee: "SOC Automation" },
        { id: "s3", order: 3, action: "Review UEBA alerts and anomaly timeline", type: "manual", status: "pending", estimatedTime: "30 min", assignee: "Threat Intel" },
        { id: "s4", order: 4, action: "Coordinate with HR and Legal for investigation scope", type: "approval", status: "pending", estimatedTime: "20 min", assignee: "Incident Commander" },
        { id: "s5", order: 5, action: "Capture forensic image of suspect workstation", type: "manual", status: "pending", estimatedTime: "45 min", assignee: "Forensics Team" },
        { id: "s6", order: 6, action: "Audit all data access and file transfers in last 90 days", type: "automated", status: "pending", estimatedTime: "10 min", assignee: "SOC Automation" },
        { id: "s7", order: 7, action: "Revoke all access and disable accounts", type: "approval", status: "pending", estimatedTime: "5 min", assignee: "CISO" },
        { id: "s8", order: 8, action: "Assess data exfiltration scope and impact", type: "manual", status: "pending", estimatedTime: "60 min", assignee: "Data Privacy Team" },
      ],
    },
    "DDoS Attack": {
      id: "pb-005",
      title: "DDoS Attack Mitigation Playbook",
      priority: "medium",
      estimatedRecovery: "1-2 hours",
      estimatedRecoveryMinutes: 90,
      steps: [
        { id: "s1", order: 1, action: "Activate DDoS mitigation service (scrubbing center)", type: "automated", status: "pending", estimatedTime: "1 min", assignee: "SOC Automation" },
        { id: "s2", order: 2, action: "Enable rate limiting on affected endpoints", type: "automated", status: "pending", estimatedTime: "2 min", assignee: "SOC Automation" },
        { id: "s3", order: 3, action: "Analyze attack traffic patterns and vectors", type: "manual", status: "pending", estimatedTime: "15 min", assignee: "Network Security" },
        { id: "s4", order: 4, action: "Implement geo-blocking for attack source regions", type: "automated", status: "pending", estimatedTime: "3 min", assignee: "SOC Automation" },
        { id: "s5", order: 5, action: "Scale infrastructure to absorb residual traffic", type: "automated", status: "pending", estimatedTime: "5 min", assignee: "SOC Automation" },
        { id: "s6", order: 6, action: "Coordinate with ISP for upstream filtering", type: "manual", status: "pending", estimatedTime: "30 min", assignee: "Network Ops" },
        { id: "s7", order: 7, action: "Validate service restoration and performance baselines", type: "manual", status: "pending", estimatedTime: "20 min", assignee: "SRE Team" },
      ],
    },
    "Supply Chain Compromise": {
      id: "pb-006",
      title: "Supply Chain Compromise Response Playbook",
      priority: "critical",
      estimatedRecovery: "8-12 hours",
      estimatedRecoveryMinutes: 600,
      steps: [
        { id: "s1", order: 1, action: "Quarantine systems with compromised software versions", type: "automated", status: "pending", estimatedTime: "5 min", assignee: "SOC Automation" },
        { id: "s2", order: 2, action: "Block network communication to compromised vendor infrastructure", type: "automated", status: "pending", estimatedTime: "2 min", assignee: "SOC Automation" },
        { id: "s3", order: 3, action: "Enumerate all systems running affected software", type: "automated", status: "pending", estimatedTime: "10 min", assignee: "SOC Automation" },
        { id: "s4", order: 4, action: "Analyze compromised update package for embedded payloads", type: "manual", status: "pending", estimatedTime: "120 min", assignee: "Malware Analyst" },
        { id: "s5", order: 5, action: "Approve enterprise-wide rollback to known-good version", type: "approval", status: "pending", estimatedTime: "15 min", assignee: "CISO" },
        { id: "s6", order: 6, action: "Execute rollback across all affected systems", type: "manual", status: "pending", estimatedTime: "180 min", assignee: "Infrastructure Team" },
        { id: "s7", order: 7, action: "Hunt for persistence mechanisms and backdoors", type: "manual", status: "pending", estimatedTime: "90 min", assignee: "Threat Hunting" },
        { id: "s8", order: 8, action: "Validate software integrity with hash verification", type: "automated", status: "pending", estimatedTime: "15 min", assignee: "SOC Automation" },
        { id: "s9", order: 9, action: "Notify vendor and coordinate joint response", type: "approval", status: "pending", estimatedTime: "30 min", assignee: "Vendor Management" },
        { id: "s10", order: 10, action: "Implement software allowlisting for critical systems", type: "manual", status: "pending", estimatedTime: "60 min", assignee: "Endpoint Security" },
      ],
    },
  };

  return playbooks[incidentType] || playbooks["Ransomware Attack"];
}

export function generateSimulations(): AttackSimulation[] {
  return [
    {
      id: "sim-001",
      name: "APT29 Lateral Movement Simulation",
      type: "red_team",
      status: "completed",
      attackVector: "Spear Phishing",
      targetAssets: ["Exchange Server", "Active Directory", "File Shares"],
      stages: [
        { id: "st1", name: "Initial Access via Phishing", status: "completed", result: "Achieved - User clicked payload" },
        { id: "st2", name: "Credential Harvesting", status: "completed", result: "Achieved - Mimikatz extracted 3 hashes" },
        { id: "st3", name: "Lateral Movement", status: "completed", result: "Achieved - Moved to DC via pass-the-hash" },
        { id: "st4", name: "Data Exfiltration", status: "completed", result: "Blocked - DLP detected exfil attempt" },
        { id: "st5", name: "Persistence Establishment", status: "completed", result: "Partial - Scheduled task created but flagged" },
      ],
      findings: [
        { id: "f1", severity: "critical", description: "Credential harvesting succeeded with no detection for 12 minutes", recommendation: "Deploy credential guard and enable LSA protection" },
        { id: "f2", severity: "high", description: "Lateral movement via pass-the-hash was not blocked", recommendation: "Implement network segmentation and restrict NTLM authentication" },
        { id: "f3", severity: "medium", description: "Phishing email bypassed initial email gateway filter", recommendation: "Update email filter rules and enable advanced threat protection" },
      ],
      score: 62,
      startedAt: "2026-03-28T09:00:00Z",
      completedAt: "2026-03-28T17:30:00Z",
    },
    {
      id: "sim-002",
      name: "Ransomware Tabletop Exercise",
      type: "tabletop",
      status: "completed",
      attackVector: "Compromised RDP",
      targetAssets: ["Domain Controller", "Backup Server", "ERP System"],
      stages: [
        { id: "st1", name: "Scenario Briefing", status: "completed", result: "Team briefed on RDP brute force scenario" },
        { id: "st2", name: "Detection & Analysis", status: "completed", result: "Team identified attack within 8 min SLA" },
        { id: "st3", name: "Containment Decision", status: "completed", result: "Correct isolation decision made" },
        { id: "st4", name: "Recovery Planning", status: "completed", result: "Backup restoration plan validated" },
      ],
      findings: [
        { id: "f1", severity: "high", description: "Backup restoration SLA exceeds RTO by 2 hours", recommendation: "Implement incremental backup strategy with faster restore capability" },
        { id: "f2", severity: "medium", description: "Communication plan lacked external stakeholder notifications", recommendation: "Update IR plan to include vendor and regulator notification templates" },
      ],
      score: 78,
      startedAt: "2026-03-25T14:00:00Z",
      completedAt: "2026-03-25T16:00:00Z",
    },
    {
      id: "sim-003",
      name: "Cloud Infrastructure Purple Team",
      type: "purple_team",
      status: "running",
      attackVector: "Stolen API Keys",
      targetAssets: ["AWS S3 Buckets", "Lambda Functions", "RDS Instances"],
      stages: [
        { id: "st1", name: "Reconnaissance & Key Discovery", status: "completed", result: "API keys found in public GitHub repo" },
        { id: "st2", name: "Initial Cloud Access", status: "completed", result: "Authenticated to AWS with stolen keys" },
        { id: "st3", name: "Privilege Escalation", status: "running" },
        { id: "st4", name: "Data Access & Exfiltration", status: "pending" },
        { id: "st5", name: "Detection Validation", status: "pending" },
      ],
      findings: [
        { id: "f1", severity: "critical", description: "API keys committed to public repository with no secret scanning", recommendation: "Enable GitHub secret scanning and implement pre-commit hooks" },
      ],
      score: 0,
      startedAt: "2026-04-05T08:00:00Z",
    },
    {
      id: "sim-004",
      name: "Phishing Resilience Assessment",
      type: "automated",
      status: "completed",
      attackVector: "Social Engineering",
      targetAssets: ["Employee Endpoints", "Email System", "SSO Portal"],
      stages: [
        { id: "st1", name: "Campaign Deployment", status: "completed", result: "2,500 phishing emails sent" },
        { id: "st2", name: "Click Rate Analysis", status: "completed", result: "12.4% click rate (target: <10%)" },
        { id: "st3", name: "Credential Submission", status: "completed", result: "3.2% entered credentials" },
        { id: "st4", name: "Reporting Rate", status: "completed", result: "34% reported to security team" },
      ],
      findings: [
        { id: "f1", severity: "high", description: "Click rate exceeds organizational target of 10%", recommendation: "Conduct targeted security awareness training for high-risk departments" },
        { id: "f2", severity: "medium", description: "Low reporting rate indicates awareness gap", recommendation: "Implement phishing report button and incentivize reporting" },
        { id: "f3", severity: "low", description: "Executive team had 0% click rate", recommendation: "Maintain current executive protection program" },
      ],
      score: 71,
      startedAt: "2026-04-01T06:00:00Z",
      completedAt: "2026-04-02T06:00:00Z",
    },
    {
      id: "sim-005",
      name: "OT Network Segmentation Validation",
      type: "red_team",
      status: "scheduled",
      attackVector: "Network Pivot",
      targetAssets: ["SCADA Systems", "PLC Controllers", "Historian Server"],
      stages: [
        { id: "st1", name: "IT/OT Boundary Probe", status: "pending" },
        { id: "st2", name: "Protocol Analysis", status: "pending" },
        { id: "st3", name: "Segmentation Bypass Attempt", status: "pending" },
        { id: "st4", name: "OT Device Enumeration", status: "pending" },
        { id: "st5", name: "Impact Assessment", status: "pending" },
      ],
      findings: [],
      score: 0,
      startedAt: "2026-04-10T09:00:00Z",
    },
  ];
}

// ── AI Analyst Investigation Data ──────────────────────────────────

export interface Investigation {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "queued" | "in_progress" | "completed" | "escalated";
  createdAt: Date;
  completedAt?: Date;
  affectedAssets: string[];
  affectedUsers: string[];
  mitreTactics: string[];
  hypothesis: string;
  executiveSummary: string;
  timeline: { time: string; event: string }[];
  dataSources: string[];
  correlations: { from: string; to: string; relationship: string }[];
  mitreMapping: { tactic: string; technique: string; id: string }[];
  confidenceScore: number;
  aiModels: string[];
  recommendedActions: { action: string; target: string; priority: "high" | "medium" | "low" }[];
  triageTimeSeconds: number;
  manualEquivalentMinutes: number;
}

const INV_ASSETS = [
  "DC-PROD-01", "WEB-SVR-03", "DB-CLUSTER-A", "FW-EDGE-01",
  "WKS-FIN-042", "WKS-ENG-017", "MAIL-GW-01", "VPN-CONC-01",
  "CLOUD-K8S-PROD", "CLOUD-S3-LOGS", "AD-DC-02", "PROXY-01",
];

const INV_USERS = [
  "j.chen@corp.local", "s.patel@corp.local", "m.torres@corp.local",
  "a.kim@corp.local", "r.johnson@corp.local", "svc-backup@corp.local",
  "admin@corp.local", "d.williams@corp.local",
];

const INV_DATA_SOURCES = [
  "Network flow logs", "Email gateway metadata", "Cloud API audit trail",
  "Endpoint telemetry (EDR)", "Identity provider logs", "DNS query logs",
  "Proxy access logs", "SIEM correlation engine", "Firewall session logs",
  "Active Directory event logs",
];

const INV_MITRE_TECHNIQUES: { tactic: string; technique: string; id: string }[] = [
  { tactic: "Initial Access", technique: "Phishing: Spearphishing Attachment", id: "T1566.001" },
  { tactic: "Execution", technique: "PowerShell", id: "T1059.001" },
  { tactic: "Persistence", technique: "Registry Run Keys", id: "T1547.001" },
  { tactic: "Privilege Escalation", technique: "Process Injection", id: "T1055" },
  { tactic: "Defense Evasion", technique: "Obfuscated Files or Information", id: "T1027" },
  { tactic: "Credential Access", technique: "OS Credential Dumping", id: "T1003" },
  { tactic: "Lateral Movement", technique: "Remote Services: SMB/Windows Admin Shares", id: "T1021.002" },
  { tactic: "Exfiltration", technique: "Exfiltration Over Web Service", id: "T1567" },
  { tactic: "Command and Control", technique: "Application Layer Protocol", id: "T1071" },
  { tactic: "Discovery", technique: "Network Service Discovery", id: "T1046" },
  { tactic: "Collection", technique: "Data from Local System", id: "T1005" },
  { tactic: "Impact", technique: "Data Encrypted for Impact", id: "T1486" },
];

const INV_TEMPLATES: {
  title: string;
  severity: Investigation["severity"];
  hypothesis: string;
  executiveSummary: string;
  timeline: { time: string; event: string }[];
  tactics: string[];
}[] = [
  {
    title: "Suspected Credential Harvesting via Spearphishing Campaign",
    severity: "critical",
    hypothesis: "An adversary is conducting a targeted spearphishing campaign to harvest employee credentials, potentially as a precursor to a deeper network compromise.",
    executiveSummary: "A coordinated spearphishing campaign was detected targeting 14 employees across the Finance and Executive departments. The attack used a convincing replica of an internal HR benefits portal hosted on a recently registered domain. Three employees submitted credentials before the campaign was identified. The adversary subsequently used stolen credentials to authenticate to the VPN gateway and attempted lateral movement to the domain controller. DIGEST behavioral analysis flagged the anomalous authentication pattern within 4 minutes of initial access, triggering automated credential revocation and session termination. Network forensics confirm no data exfiltration occurred. The attack infrastructure has been attributed to a known financially-motivated threat group based on TLS certificate fingerprinting and domain registration patterns consistent with previous campaigns tracked by threat intelligence feeds.",
    timeline: [
      { time: "08:23:14", event: "Phishing emails delivered to 14 recipients across Finance and Executive departments" },
      { time: "08:31:47", event: "First credential submission detected on spoofed HR portal (j.chen@corp.local)" },
      { time: "08:34:02", event: "Second credential submission (r.johnson@corp.local)" },
      { time: "08:35:19", event: "Third credential submission (d.williams@corp.local)" },
      { time: "08:38:41", event: "VPN authentication from anomalous geolocation using j.chen credentials" },
      { time: "08:39:55", event: "DIGEST model flags behavioral anomaly — 4.7 sigma deviation from baseline" },
      { time: "08:40:12", event: "Lateral movement attempt via SMB to DC-PROD-01" },
      { time: "08:40:18", event: "RESPOND autonomous action: session terminated, credentials revoked" },
      { time: "08:42:30", event: "Network quarantine applied to affected segments" },
    ],
    tactics: ["Initial Access", "Credential Access", "Lateral Movement"],
  },
  {
    title: "Ransomware Precursor Activity on Engineering Subnet",
    severity: "critical",
    hypothesis: "Pre-ransomware reconnaissance and staging activity has been detected on the engineering subnet, consistent with known ransomware group TTPs.",
    executiveSummary: "Behavioral analysis identified ransomware precursor activity on the engineering subnet originating from workstation WKS-ENG-017. The compromised endpoint exhibited a sequence of behaviors consistent with the Lockbit 3.0 kill chain: initial access via a trojanized software update, followed by credential dumping using a memory-resident tool, network discovery via port scanning, and attempted deployment of a group policy object to disable Windows Defender across the domain. The DEMIST-2 model correlated endpoint telemetry with network flow data and identified the staging of encryption payloads on three file server shares before any encryption began. Autonomous containment isolated the compromised workstation and blocked lateral movement within 6 minutes of initial compromise. Shadow copy integrity has been verified on all file servers. The attack was neutralized before any data encryption or exfiltration could occur.",
    timeline: [
      { time: "14:12:03", event: "Trojanized software update executed on WKS-ENG-017" },
      { time: "14:14:22", event: "In-memory credential dumping tool loaded via reflective DLL injection" },
      { time: "14:16:45", event: "LSASS process memory accessed — credential extraction detected" },
      { time: "14:17:30", event: "Network discovery scan initiated on engineering VLAN (ports 445, 3389, 5985)" },
      { time: "14:18:55", event: "GPO modification attempt detected — Windows Defender disable policy" },
      { time: "14:19:12", event: "DIGEST model triggers: ransomware precursor pattern match (confidence 97.2%)" },
      { time: "14:19:30", event: "Encryption payload staged on \\\\FILESRV-01\\engineering$" },
      { time: "14:19:45", event: "RESPOND: WKS-ENG-017 isolated, network micro-segmentation enforced" },
      { time: "14:22:00", event: "All affected shares verified — no encryption occurred" },
    ],
    tactics: ["Execution", "Credential Access", "Discovery", "Lateral Movement", "Impact"],
  },
  {
    title: "Insider Data Exfiltration — Departing Employee",
    severity: "high",
    hypothesis: "A departing employee may be exfiltrating proprietary data through unauthorized cloud storage services in violation of data loss prevention policies.",
    executiveSummary: "User analytics flagged anomalous behavior by employee s.patel@corp.local, who submitted a resignation notice 8 days ago. Over the past 72 hours, the user accessed 847 files from restricted project repositories — a 12x increase over their 90-day baseline. The user then uploaded approximately 2.3 GB of data to a personal Dropbox account via the web browser, bypassing the corporate DLP agent by using a browser extension that tunneled traffic through WebSocket connections. DEMIST-2 cross-domain analysis correlated the file access patterns with the upload activity and the HR resignation flag. The user's access to sensitive repositories has been revoked, and the Dropbox upload endpoint has been blocked at the proxy. Legal and HR have been notified for further investigation. Forensic preservation of the user's workstation has been initiated.",
    timeline: [
      { time: "Day -3 09:15", event: "s.patel begins accessing restricted R&D project files outside normal scope" },
      { time: "Day -3 11:42", event: "312 files accessed from /projects/quantum-core/ repository" },
      { time: "Day -2 08:30", event: "Continued access — 289 files from /projects/fusion-api/" },
      { time: "Day -2 14:18", event: "Browser extension installed: WebSocket tunnel proxy" },
      { time: "Day -1 10:05", event: "246 additional files accessed from /projects/ml-models/" },
      { time: "Day -1 15:33", event: "2.3 GB upload to personal Dropbox via WebSocket tunnel" },
      { time: "Day 0 06:45", event: "DEMIST-2 correlation: file access + upload + HR flag = insider threat" },
      { time: "Day 0 06:46", event: "RESPOND: repository access revoked, Dropbox endpoint blocked" },
    ],
    tactics: ["Collection", "Exfiltration", "Defense Evasion"],
  },
  {
    title: "C2 Beaconing via DNS Tunneling from IoT Segment",
    severity: "high",
    hypothesis: "An IoT device on the operational technology network segment is being used as a beachhead for command-and-control communication via DNS tunneling.",
    executiveSummary: "DNS analytics detected anomalous query patterns from IoT device IOT-CAM-12 on the OT network segment. The device was generating encoded DNS TXT queries to a newly registered domain at precise 30-second intervals — a pattern consistent with DNS tunneling for C2 communication. Investigation revealed the device firmware had been compromised via an unpatched CVE (CVE-2024-31497) in the device management API. The adversary used the compromised camera as a pivot point to scan the OT network, identifying 3 PLCs and 2 HMI systems. No OT device compromise occurred. The C2 domain has been sinkholed, the compromised device has been isolated, and firmware integrity verification is in progress across all IoT devices in the segment.",
    timeline: [
      { time: "03:14:22", event: "DNS analytics flags anomalous TXT query pattern from IOT-CAM-12" },
      { time: "03:14:45", event: "Query frequency analysis: 30-second beaconing interval confirmed" },
      { time: "03:15:10", event: "Domain age check: tyro-analytics[.]net registered 48 hours ago" },
      { time: "03:16:30", event: "DIGEST model: DNS tunneling confidence 94.8%, C2 pattern match" },
      { time: "03:17:00", event: "Historical analysis: device compromised ~36 hours ago via management API" },
      { time: "03:18:22", event: "OT network scan detected from IOT-CAM-12 — targeting PLC/HMI ports" },
      { time: "03:19:00", event: "RESPOND: device isolated, DNS domain sinkholed" },
      { time: "03:25:00", event: "OT device integrity verification initiated — no compromise detected" },
    ],
    tactics: ["Initial Access", "Command and Control", "Discovery"],
  },
  {
    title: "Supply Chain Compromise via Malicious NPM Package",
    severity: "medium",
    hypothesis: "A malicious dependency introduced through a developer's package update may be exfiltrating environment variables and API keys from the CI/CD pipeline.",
    executiveSummary: "Static and behavioral analysis of the CI/CD pipeline detected a recently updated NPM package (color-utils-extended v2.4.1) containing an obfuscated postinstall script that harvests environment variables and transmits them to an external endpoint. The package was introduced as a transitive dependency through a legitimate-appearing library update. Three build pipelines executed the malicious postinstall script, potentially exposing AWS access keys, database connection strings, and internal API tokens. All exposed credentials have been rotated. The malicious package has been removed from package-lock files across all repositories, and the NPM registry has been notified.",
    timeline: [
      { time: "Day -2 16:30", event: "Developer updates dependencies in frontend repository" },
      { time: "Day -2 16:35", event: "Transitive dependency color-utils-extended@2.4.1 introduced" },
      { time: "Day -1 09:00", event: "CI/CD pipeline build #4471 executes malicious postinstall script" },
      { time: "Day -1 09:01", event: "Environment variables harvested and base64-encoded" },
      { time: "Day -1 09:02", event: "Outbound HTTP POST to collect-metrics[.]xyz with encoded payload" },
      { time: "Day 0 02:15", event: "DIGEST behavioral anomaly: unusual network call during npm install" },
      { time: "Day 0 02:16", event: "Package analysis: obfuscated code in postinstall hook" },
      { time: "Day 0 02:20", event: "RESPOND: pipeline halted, credentials rotation initiated" },
    ],
    tactics: ["Initial Access", "Execution", "Exfiltration"],
  },
  {
    title: "Brute Force Attack on VPN Gateway — Distributed Campaign",
    severity: "medium",
    hypothesis: "A distributed credential stuffing campaign targeting the corporate VPN gateway using leaked credentials from a recent third-party breach.",
    executiveSummary: "Authentication monitoring detected a distributed brute-force campaign against the VPN gateway VPN-CONC-01, originating from 847 unique source IPs across 23 countries. The attack leveraged credential pairs from a recently published breach database (BreachDB-2025-Q1). Analysis shows 12 successful authentications using valid employee credentials that had been reused from compromised personal accounts. All affected sessions were terminated within 90 seconds of detection, and mandatory password resets have been enforced.",
    timeline: [
      { time: "22:14:00", event: "Authentication failure rate exceeds baseline by 340% on VPN-CONC-01" },
      { time: "22:14:30", event: "Source IP analysis: 847 unique IPs across 23 countries" },
      { time: "22:15:00", event: "DIGEST model: credential stuffing pattern detected (confidence 96.1%)" },
      { time: "22:15:45", event: "Credential correlation: matches BreachDB-2025-Q1 dataset" },
      { time: "22:16:20", event: "12 successful authentications identified with reused credentials" },
      { time: "22:16:50", event: "RESPOND: all 12 sessions terminated, accounts locked" },
      { time: "22:18:00", event: "Geographic blocking rules deployed for high-risk source countries" },
      { time: "22:20:00", event: "MFA gap analysis: 34 accounts identified without hardware tokens" },
    ],
    tactics: ["Credential Access", "Initial Access"],
  },
  {
    title: "Cloud Infrastructure Misconfiguration — Exposed S3 Bucket",
    severity: "low",
    hypothesis: "A cloud infrastructure misconfiguration has exposed an S3 storage bucket containing non-sensitive log data to public access.",
    executiveSummary: "Cloud security posture monitoring detected a configuration change on S3 bucket cloud-logs-staging-2025 that removed the block-public-access policy. The change was traced to an infrastructure-as-code deployment (Terraform apply) by a DevOps engineer during a staging environment update. The bucket contained application debug logs from the staging environment — no production data, PII, or credentials were present. The misconfiguration was active for approximately 4 hours before detection. Access logs show no external access during the exposure window.",
    timeline: [
      { time: "10:30:00", event: "Terraform apply modifies S3 bucket policy for cloud-logs-staging-2025" },
      { time: "10:30:05", event: "Block-public-access policy removed from bucket" },
      { time: "14:22:00", event: "Cloud posture scan detects publicly accessible bucket" },
      { time: "14:22:30", event: "DIGEST analysis: bucket contents are staging debug logs only" },
      { time: "14:23:00", event: "Access log review: no external access during exposure window" },
      { time: "14:25:00", event: "RESPOND: bucket policy corrected, public access blocked" },
    ],
    tactics: ["Defense Evasion"],
  },
  {
    title: "Privilege Escalation via Compromised Service Account",
    severity: "critical",
    hypothesis: "A service account has been compromised and is being used to escalate privileges within Active Directory, potentially leading to domain admin access.",
    executiveSummary: "Identity analytics detected anomalous behavior from service account svc-backup@corp.local, which was observed requesting Kerberos TGS tickets for services it does not normally access — including the KRBTGT account. This pattern is consistent with a Kerberoasting attack followed by an attempted Golden Ticket creation. The service account password had not been rotated in 287 days, violating the 90-day rotation policy. Investigation revealed the account credentials were exposed in a configuration file on an internal Git repository with overly permissive access controls. DIGEST flagged the ticket request anomaly within 2 minutes, and autonomous containment disabled the account before domain admin access was achieved.",
    timeline: [
      { time: "01:45:00", event: "VPN authentication for svc-backup@corp.local from external IP 185.x.x.x" },
      { time: "01:46:22", event: "Anomalous Kerberos TGS requests from svc-backup — 14 services in 60 seconds" },
      { time: "01:47:15", event: "KRBTGT ticket request detected — Golden Ticket attempt" },
      { time: "01:47:30", event: "DIGEST model: Kerberoasting + privilege escalation pattern (confidence 98.4%)" },
      { time: "01:47:45", event: "RESPOND: svc-backup account disabled, all sessions terminated" },
      { time: "01:48:00", event: "VPN session from 185.x.x.x forcefully disconnected" },
      { time: "01:50:00", event: "Credential exposure traced to internal Git repo config file" },
      { time: "01:55:00", event: "KRBTGT password double-reset initiated as precaution" },
    ],
    tactics: ["Credential Access", "Privilege Escalation", "Persistence"],
  },
];

const INV_STATUSES: Investigation["status"][] = ["queued", "in_progress", "completed", "escalated"];

let investigationCounter = 0;

export function generateInvestigation(): Investigation {
  const template = randomItem(INV_TEMPLATES);
  investigationCounter++;

  const numAssets = 2 + Math.floor(Math.random() * 4);
  const numUsers = 1 + Math.floor(Math.random() * 3);
  const numSources = 4 + Math.floor(Math.random() * 4);

  const selectedAssets: string[] = [];
  const assetsCopy = [...INV_ASSETS];
  for (let i = 0; i < numAssets; i++) {
    const idx = Math.floor(Math.random() * assetsCopy.length);
    selectedAssets.push(assetsCopy.splice(idx, 1)[0]);
  }

  const selectedUsers: string[] = [];
  const usersCopy = [...INV_USERS];
  for (let i = 0; i < numUsers; i++) {
    const idx = Math.floor(Math.random() * usersCopy.length);
    selectedUsers.push(usersCopy.splice(idx, 1)[0]);
  }

  const selectedSources: string[] = [];
  const sourcesCopy = [...INV_DATA_SOURCES];
  for (let i = 0; i < numSources; i++) {
    const idx = Math.floor(Math.random() * sourcesCopy.length);
    selectedSources.push(sourcesCopy.splice(idx, 1)[0]);
  }

  const mitreMapping = INV_MITRE_TECHNIQUES.filter((t) =>
    template.tactics.includes(t.tactic)
  );

  const correlations = selectedAssets.slice(0, -1).map((a, i) => ({
    from: a,
    to: selectedAssets[i + 1],
    relationship: randomItem([
      "authenticated_to", "transferred_data_to", "scanned", "lateral_movement",
      "credential_reuse", "process_spawned_on", "dns_query_from",
    ]),
  }));

  const created = new Date(Date.now() - Math.floor(Math.random() * 86400000));
  const triageTime = 8 + Math.floor(Math.random() * 20);

  return {
    id: `INV-${String(investigationCounter).padStart(5, "0")}`,
    title: template.title,
    severity: template.severity,
    status: randomItem(INV_STATUSES),
    createdAt: created,
    completedAt: Math.random() > 0.3 ? new Date(created.getTime() + triageTime * 1000) : undefined,
    affectedAssets: selectedAssets,
    affectedUsers: selectedUsers,
    mitreTactics: template.tactics,
    hypothesis: template.hypothesis,
    executiveSummary: template.executiveSummary,
    timeline: template.timeline,
    dataSources: selectedSources,
    correlations,
    mitreMapping,
    confidenceScore: Math.round((85 + Math.random() * 14) * 10) / 10,
    aiModels: Math.random() > 0.3 ? ["DIGEST", "DEMIST-2"] : ["DIGEST"],
    recommendedActions: [
      { action: "Isolate affected endpoints", target: selectedAssets[0], priority: "high" },
      { action: "Revoke compromised credentials", target: selectedUsers[0], priority: "high" },
      { action: "Block malicious indicators at perimeter", target: "FW-EDGE-01", priority: "medium" },
      { action: "Initiate forensic preservation", target: selectedAssets[1] || selectedAssets[0], priority: "medium" },
      { action: "Notify incident response team", target: "SOC-Team", priority: "low" },
    ],
    triageTimeSeconds: triageTime,
    manualEquivalentMinutes: 35 + Math.floor(Math.random() * 50),
  };
}

export function generateInvestigations(count: number = 8): Investigation[] {
  return Array.from({ length: count }, () => generateInvestigation());
}
