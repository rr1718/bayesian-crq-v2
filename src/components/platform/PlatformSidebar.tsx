"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  LayoutDashboard,
  Search,
  GitBranch,
  Target,
  Eye,
  Activity,
  Cpu,
  Zap,
  Settings,
  Play,
  FileText,
  ClipboardList,
  Brain,
  BarChart3,
  Network,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  color: string;
  items: NavItem[];
}

interface PlatformSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const sections: NavSection[] = [
  {
    title: "OVERVIEW",
    color: "#8892a4",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "PREVENT",
    color: "#3b82f6",
    items: [
      { id: "attack-surface", label: "Attack Surface", icon: Search },
      { id: "attack-paths", label: "Attack Paths", icon: GitBranch },
      { id: "firewall", label: "Firewall Analysis", icon: Shield },
      { id: "mitre", label: "MITRE Coverage", icon: Target },
    ],
  },
  {
    title: "DETECT",
    color: "#8b5cf6",
    items: [
      { id: "detections", label: "Detection Dashboard", icon: Eye },
      { id: "pattern-of-life", label: "Pattern of Life", icon: Activity },
      { id: "next-agent", label: "NEXT Agent", icon: Cpu },
    ],
  },
  {
    title: "RESPOND",
    color: "#ef4444",
    items: [
      { id: "response-dashboard", label: "Response Dashboard", icon: Zap },
      { id: "autonomy", label: "Autonomy Config", icon: Settings },
      { id: "containment", label: "Containment Sim", icon: Play },
    ],
  },
  {
    title: "HEAL",
    color: "#10b981",
    items: [
      { id: "playbooks", label: "AI Playbooks", icon: FileText },
      { id: "simulations", label: "Attack Simulations", icon: Target },
      { id: "reports", label: "Incident Reports", icon: ClipboardList },
    ],
  },
  {
    title: "AI ANALYST",
    color: "#00d4aa",
    items: [
      { id: "investigation-queue", label: "Investigation Queue", icon: Brain },
      { id: "run-investigation", label: "Run Investigation", icon: Search },
    ],
  },
  {
    title: "ANALYTICS",
    color: "#8892a4",
    items: [
      { id: "charts", label: "Charts & Reports", icon: BarChart3 },
      { id: "network-map", label: "Network Map", icon: Network },
    ],
  },
];

export default function PlatformSidebar({
  activeModule,
  onModuleChange,
  collapsed,
  onToggleCollapse,
}: PlatformSidebarProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-surface border-r border-surface-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-surface-border">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" style={{ color: "#6c3bf5" }} />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-white truncate block">
              ActiveAI Platform
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-medium tracking-wider text-success uppercase">
                LIVE
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
        {sections.map((section) => {
          const isSectionCollapsed = collapsedSections.has(section.title);

          return (
            <div key={section.title} className="mb-1">
              {/* Section header */}
              {!collapsed ? (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-4 py-2 group"
                >
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: section.color }}
                  >
                    {section.title}
                  </span>
                  {isSectionCollapsed ? (
                    <ChevronRight
                      className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{ color: section.color }}
                    />
                  ) : (
                    <ChevronDown
                      className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{ color: section.color }}
                    />
                  )}
                </button>
              ) : (
                <div
                  className="w-6 mx-auto my-2 border-t"
                  style={{ borderColor: section.color + "40" }}
                />
              )}

              {/* Section items */}
              {(!isSectionCollapsed || collapsed) &&
                section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onModuleChange(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-all duration-150 relative group ${
                        isActive
                          ? "text-white bg-white/5"
                          : "text-text-secondary hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r"
                          style={{ backgroundColor: section.color }}
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? "" : "group-hover:opacity-100 opacity-70"
                        }`}
                        style={isActive ? { color: section.color } : undefined}
                      />

                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-surface-border p-2 space-y-1">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/[0.03] rounded transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4 flex-shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>

        <Link
          href="/"
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/[0.03] rounded transition-colors"
          title={collapsed ? "Back to Home" : undefined}
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Back to Home</span>}
        </Link>
      </div>
    </aside>
  );
}
