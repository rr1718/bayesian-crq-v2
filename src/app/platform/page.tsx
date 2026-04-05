"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Shield,
  ChevronRight,
  Circle,
  Wifi,
  Server,
  Menu,
} from "lucide-react";
import PlatformSidebar from "@/components/platform/PlatformSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ThreatFeed from "@/components/dashboard/ThreatFeed";
import NetworkTopology from "@/components/dashboard/NetworkTopology";

const PreventModule = dynamic(
  () => import("@/components/platform/PreventModule"),
  { ssr: false }
);
const DetectModule = dynamic(
  () => import("@/components/platform/DetectModule"),
  { ssr: false }
);
const RespondModule = dynamic(
  () => import("@/components/platform/RespondModule"),
  { ssr: false }
);
const HealModule = dynamic(
  () => import("@/components/platform/HealModule"),
  { ssr: false }
);
const AIAnalystModule = dynamic(
  () => import("@/components/platform/AIAnalystModule"),
  { ssr: false }
);
const ChartsPanel = dynamic(
  () => import("@/components/dashboard/ChartsPanel"),
  { ssr: false }
);

// Maps sidebar item IDs to top-level module keys
const moduleMap: Record<string, string> = {
  dashboard: "dashboard",
  "attack-surface": "prevent",
  "attack-paths": "prevent",
  firewall: "prevent",
  mitre: "prevent",
  detections: "detect",
  "pattern-of-life": "detect",
  "next-agent": "detect",
  "response-dashboard": "respond",
  autonomy: "respond",
  containment: "respond",
  playbooks: "heal",
  simulations: "heal",
  reports: "heal",
  "investigation-queue": "analyst",
  "run-investigation": "analyst",
  charts: "analytics",
  "network-map": "topology",
};

// Sub-tab mapping: sidebar item id -> default tab string passed to module
const subTabMap: Record<string, string> = {
  "attack-surface": "attack-surface",
  "attack-paths": "attack-paths",
  firewall: "firewall",
  mitre: "mitre",
  detections: "detections",
  "pattern-of-life": "pattern-of-life",
  "next-agent": "next-agent",
  "response-dashboard": "response-dashboard",
  autonomy: "autonomy",
  containment: "containment",
  playbooks: "playbooks",
  simulations: "simulations",
  reports: "reports",
  "investigation-queue": "investigation-queue",
  "run-investigation": "run-investigation",
  charts: "charts",
  "network-map": "network-map",
};

// Breadcrumb labels for each sidebar item
const breadcrumbLabels: Record<string, string[]> = {
  dashboard: ["Overview", "Dashboard"],
  "attack-surface": ["Prevent", "Attack Surface"],
  "attack-paths": ["Prevent", "Attack Paths"],
  firewall: ["Prevent", "Firewall Analysis"],
  mitre: ["Prevent", "MITRE Coverage"],
  detections: ["Detect", "Detection Dashboard"],
  "pattern-of-life": ["Detect", "Pattern of Life"],
  "next-agent": ["Detect", "NEXT Agent"],
  "response-dashboard": ["Respond", "Response Dashboard"],
  autonomy: ["Respond", "Autonomy Config"],
  containment: ["Respond", "Containment Sim"],
  playbooks: ["Heal", "AI Playbooks"],
  simulations: ["Heal", "Attack Simulations"],
  reports: ["Heal", "Incident Reports"],
  "investigation-queue": ["AI Analyst", "Investigation Queue"],
  "run-investigation": ["AI Analyst", "Run Investigation"],
  charts: ["Analytics", "Charts & Reports"],
  "network-map": ["Analytics", "Network Map"],
};

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " UTC"
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function PlatformPage() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const clock = useClock();

  const resolvedModule = moduleMap[activeModule] ?? "dashboard";
  const defaultTab = subTabMap[activeModule] ?? activeModule;
  const crumbs = breadcrumbLabels[activeModule] ?? ["Platform"];

  // Close mobile sidebar on module change
  const handleModuleChange = (mod: string) => {
    setActiveModule(mod);
    setMobileOpen(false);
  };

  const content = useMemo(() => {
    switch (resolvedModule) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
            <div className="xl:col-span-2">
              <DashboardOverview />
            </div>
            <div className="xl:col-span-1">
              <ThreatFeed />
            </div>
          </div>
        );
      case "prevent":
        return <PreventModule defaultTab={defaultTab} />;
      case "detect":
        return <DetectModule defaultTab={defaultTab} />;
      case "respond":
        return <RespondModule defaultTab={defaultTab} />;
      case "heal":
        return <HealModule defaultTab={defaultTab} />;
      case "analyst":
        return <AIAnalystModule defaultTab={defaultTab} />;
      case "analytics":
        return <ChartsPanel />;
      case "topology":
        return <NetworkTopology />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <p>Select a module from the sidebar.</p>
          </div>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedModule, defaultTab]);

  return (
    <div className="flex h-screen bg-[#0a0b14] overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:flex">
        <PlatformSidebar
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        />
      </div>

      {/* Sidebar - mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <PlatformSidebar
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          collapsed={false}
          onToggleCollapse={() => setMobileOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 bg-surface border-b border-surface-border flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-text-secondary hover:text-white rounded transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm">
              <Shield className="w-4 h-4 text-text-secondary" />
              <span className="text-text-secondary">Platform</span>
              {crumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-text-secondary/50" />
                  <span
                    className={
                      i === crumbs.length - 1
                        ? "text-white font-medium"
                        : "text-text-secondary"
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          {/* Right side: status + clock */}
          <div className="flex items-center gap-4">
            {/* System status indicators */}
            <div className="hidden md:flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-success" />
                <span>Connected</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-success" />
                <span>All Systems Normal</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Circle className="w-2 h-2 fill-success text-success animate-pulse" />
                <span>Threat Engine Active</span>
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-surface-border" />

            {/* Clock */}
            <span className="text-xs font-mono text-text-secondary tabular-nums">
              {clock}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{content}</main>
      </div>
    </div>
  );
}
