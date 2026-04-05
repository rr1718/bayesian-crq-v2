"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Users,
  Network,
  Shield,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

interface DashboardNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "threats", label: "Threat Feed", icon: Activity },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "soc", label: "SOC Operations", icon: Users },
  { id: "topology", label: "Network Map", icon: Network },
];

export default function DashboardNav({ activeTab, onTabChange }: DashboardNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
              <span className="text-sm hidden sm:inline">Back</span>
            </a>
            <div className="w-px h-6 bg-surface-border" />
            <Shield size={20} className="text-primary" />
            <span className="font-bold text-sm">
              Darktrace <span className="text-accent">ActiveAI</span> Dashboard
            </span>
            <div className="flex items-center gap-1.5 ml-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-green-400 hidden md:inline">LIVE</span>
            </div>
          </div>

          {/* Desktop tabs */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-text-secondary hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Time */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-text-secondary">
            <LiveClock />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile tabs */}
        {mobileOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-all ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-text-secondary hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  if (typeof window !== "undefined") {
    setTimeout(() => setTime(new Date().toLocaleTimeString()), 1000);
  }

  return <span className="font-mono">{time} UTC</span>;
}
