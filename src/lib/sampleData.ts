export interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: "malware" | "phishing" | "lateral_movement" | "data_exfil" | "c2_callback" | "insider" | "brute_force" | "privilege_escalation";
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  destination: string;
  domain: "network" | "email" | "cloud" | "endpoint" | "identity" | "ot";
  description: string;
  status: "active" | "contained" | "investigating" | "resolved";
  aiConfidence: number;
  respondAction?: string;
}

export interface DeviceNode {
  id: string;
  name: string;
  type: "server" | "workstation" | "firewall" | "switch" | "iot" | "cloud" | "ot_device";
  ip: string;
  status: "normal" | "anomalous" | "compromised" | "isolated";
  riskScore: number;
  connections: string[];
  department: string;
}

export interface AlertMetric {
  time: string;
  threats: number;
  anomalies: number;
  contained: number;
}

export interface DomainStats {
  domain: string;
  threats: number;
  anomalies: number;
  devices: number;
  coverage: number;
}

export interface SOCAlert {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  domain: string;
  timestamp: Date;
  assignee: string | null;
  aiTriaged: boolean;
  aiVerdict: string;
  status: "new" | "investigating" | "escalated" | "resolved";
}

const THREAT_TYPES = [
  "malware", "phishing", "lateral_movement", "data_exfil",
  "c2_callback", "insider", "brute_force", "privilege_escalation",
] as const;

const DOMAINS = ["network", "email", "cloud", "endpoint", "identity", "ot"] as const;

const SEVERITIES = ["critical", "high", "medium", "low"] as const;

const DEVICE_NAMES = [
  "DC-PROD-01", "WEB-SVR-03", "DB-CLUSTER-A", "FW-EDGE-01", "SW-CORE-02",
  "WKS-FIN-042", "WKS-ENG-017", "WKS-HR-003", "IOT-CAM-12", "IOT-HVAC-05",
  "CLOUD-K8S-PROD", "CLOUD-S3-LOGS", "OT-PLC-07", "OT-HMI-02", "MAIL-GW-01",
  "VPN-CONC-01", "PROXY-01", "SIEM-COLLECTOR", "AD-DC-02", "BACKUP-NAS-01",
];

const DEPARTMENTS = ["Engineering", "Finance", "HR", "Operations", "IT", "Executive", "Manufacturing"];

const DESCRIPTIONS: Record<string, string[]> = {
  malware: [
    "Suspicious executable detected on endpoint with unknown hash signature",
    "Fileless malware activity detected via PowerShell memory injection",
    "Ransomware encryption patterns observed on file server shares",
  ],
  phishing: [
    "Credential harvesting page accessed from email link",
    "QR code in email redirects to spoofed Microsoft 365 login",
    "Business Email Compromise attempt targeting CFO approval chain",
  ],
  lateral_movement: [
    "Unusual SMB connection from workstation to domain controller",
    "RDP session initiated from non-admin device to production server",
    "Pass-the-hash detected using NTLM authentication anomaly",
  ],
  data_exfil: [
    "Large data transfer to external IP via encrypted channel",
    "Unusual upload volume to cloud storage outside business hours",
    "Database export query followed by outbound FTP connection",
  ],
  c2_callback: [
    "Beaconing pattern detected with regular interval HTTP POST requests",
    "DNS tunneling activity to newly registered domain",
    "Encrypted traffic to known C2 infrastructure IP range",
  ],
  insider: [
    "User accessing sensitive files outside normal working pattern",
    "Bulk download of intellectual property documents by departing employee",
    "Privilege escalation attempt on production database server",
  ],
  brute_force: [
    "Multiple failed SSH login attempts from external IP",
    "Distributed credential stuffing attack targeting VPN gateway",
    "Kerberos pre-authentication failures exceeding baseline by 500%",
  ],
  privilege_escalation: [
    "Service account granted domain admin privileges outside change window",
    "Sudo escalation to root on production Linux server by new user",
    "Azure AD role assignment change detected outside approved workflow",
  ],
};

const RESPOND_ACTIONS = [
  "Device isolated — enforcing pattern of life",
  "Connection blocked — maintaining normal traffic",
  "User session terminated — credential reset initiated",
  "Network segment quarantined — lateral movement contained",
  "Email quarantined — phishing campaign blocked",
  "Process killed — endpoint remediation in progress",
];

const AI_VERDICTS = [
  "High-confidence threat — autonomous containment recommended",
  "Likely true positive — matches known APT pattern",
  "Behavioral anomaly — deviates 4.2σ from baseline",
  "False positive — matches approved change window activity",
  "Requires analyst review — ambiguous intent signals",
  "Confirmed benign — automated by scheduled task",
  "Suspicious but low risk — monitoring escalated",
];

const ALERT_TITLES = [
  "Unusual outbound data transfer from finance workstation",
  "Multiple failed authentication attempts on VPN gateway",
  "New executable running from TEMP directory on DC-PROD-01",
  "Anomalous DNS query volume from IoT segment",
  "Credential dumping tool detected on WKS-ENG-017",
  "Suspicious email forwarding rule created on executive mailbox",
  "Cloud storage API calls from unrecognized IP address",
  "OT device communicating with IT network segment",
  "Lateral movement via WMI from compromised workstation",
  "Certificate authority server accessed outside maintenance window",
  "Shadow IT SaaS application detected — unauthorized AI tool",
  "Unusual Azure AD token refresh pattern for service account",
  "Encrypted payload download from newly registered domain",
  "PLC firmware update attempt from unauthorized workstation",
  "Beaconing activity to Tor exit node detected",
];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIP(): string {
  return `${10 + Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

let threatCounter = 0;
let alertCounter = 0;

export function generateThreatEvent(): ThreatEvent {
  const type = randomItem(THREAT_TYPES);
  const severity = randomItem(SEVERITIES);
  threatCounter++;
  return {
    id: `THR-${String(threatCounter).padStart(6, "0")}`,
    timestamp: new Date(),
    type,
    severity,
    source: randomItem(DEVICE_NAMES),
    destination: randomItem(DEVICE_NAMES),
    domain: randomItem(DOMAINS),
    description: randomItem(DESCRIPTIONS[type]),
    status: Math.random() > 0.6 ? "contained" : Math.random() > 0.4 ? "investigating" : "active",
    aiConfidence: Math.round((70 + Math.random() * 30) * 10) / 10,
    respondAction: Math.random() > 0.4 ? randomItem(RESPOND_ACTIONS) : undefined,
  };
}

export function generateSOCAlert(): SOCAlert {
  alertCounter++;
  return {
    id: `ALT-${String(alertCounter).padStart(5, "0")}`,
    title: randomItem(ALERT_TITLES),
    severity: randomItem(SEVERITIES),
    domain: randomItem(DOMAINS),
    timestamp: new Date(),
    assignee: Math.random() > 0.7 ? randomItem(["J. Chen", "S. Patel", "M. Torres", "A. Kim"]) : null,
    aiTriaged: Math.random() > 0.15,
    aiVerdict: randomItem(AI_VERDICTS),
    status: randomItem(["new", "investigating", "escalated", "resolved"]),
  };
}

export function generateTimeSeriesData(hours: number = 24): AlertMetric[] {
  const data: AlertMetric[] = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const isBusinessHours = time.getHours() >= 8 && time.getHours() <= 18;
    const baseThreats = isBusinessHours ? 12 : 5;
    const baseAnomalies = isBusinessHours ? 45 : 18;
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      threats: baseThreats + Math.floor(Math.random() * 15),
      anomalies: baseAnomalies + Math.floor(Math.random() * 30),
      contained: Math.floor((baseThreats + Math.random() * 10) * 0.85),
    });
  }
  return data;
}

export function generateDomainStats(): DomainStats[] {
  return [
    { domain: "Network", threats: 47, anomalies: 234, devices: 1847, coverage: 98.2 },
    { domain: "Email", threats: 128, anomalies: 456, devices: 3200, coverage: 99.8 },
    { domain: "Cloud", threats: 23, anomalies: 89, devices: 412, coverage: 94.5 },
    { domain: "Endpoint", threats: 34, anomalies: 167, devices: 2650, coverage: 96.7 },
    { domain: "Identity", threats: 19, anomalies: 78, devices: 3200, coverage: 99.1 },
    { domain: "OT", threats: 8, anomalies: 42, devices: 186, coverage: 91.3 },
  ];
}

export function generateDeviceNodes(): DeviceNode[] {
  return DEVICE_NAMES.map((name, i) => {
    const types: DeviceNode["type"][] = ["server", "workstation", "firewall", "switch", "iot", "cloud", "ot_device"];
    const status: DeviceNode["status"][] = ["normal", "normal", "normal", "normal", "anomalous", "compromised"];
    const connections: string[] = [];
    const numConnections = 1 + Math.floor(Math.random() * 4);
    for (let j = 0; j < numConnections; j++) {
      const target = DEVICE_NAMES[Math.floor(Math.random() * DEVICE_NAMES.length)];
      if (target !== name && !connections.includes(target)) {
        connections.push(target);
      }
    }
    return {
      id: `dev-${i}`,
      name,
      type: types[i % types.length],
      ip: randomIP(),
      status: status[Math.floor(Math.random() * status.length)],
      riskScore: Math.round(Math.random() * 100),
      connections,
      department: randomItem(DEPARTMENTS),
    };
  });
}
