"use client";

import { useState } from "react";
import {
  Search,
  Menu,
  Shield,
  ShieldCheck,
  Eye,
  Zap,
  Heart,
  Radio,
  ChevronLeft,
  Check,
  Copy,
  Bell,
  Settings,
  User,
} from "lucide-react";
import EventSidebar from "./EventSidebar";
import DetectSummary from "./DetectSummary";
import NetworkGraph from "./NetworkGraph";
import IncidentCards from "./IncidentCards";

type PlatformTab = "PREVENT" | "DETECT" | "RESPOND" | "HEAL";

const TABS: { id: PlatformTab; icon: React.ElementType; color: string; activeColor: string }[] = [
  { id: "PREVENT", icon: ShieldCheck, color: "text-text-secondary", activeColor: "text-accent-blue" },
  { id: "DETECT", icon: Eye, color: "text-text-secondary", activeColor: "text-primary" },
  { id: "RESPOND", icon: Zap, color: "text-text-secondary", activeColor: "text-danger" },
  { id: "HEAL", icon: Heart, color: "text-text-secondary", activeColor: "text-success" },
];

export default function DashboardShell() {
  const [activeTab, setActiveTab] = useState<PlatformTab>("DETECT");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[#0a0b14] text-foreground overflow-hidden">
      {/* ============ TOP BAR ============ */}
      <header className="flex items-center h-12 px-4 bg-[#0d0e1a] border-b border-surface-border shrink-0">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-surface-light rounded transition-colors">
            <Menu className="w-4 h-4 text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-wider text-white uppercase">
              Darktrace
            </span>
          </div>
          <span className="text-sm text-text-secondary ml-2">Dashboard</span>
        </div>

        {/* Center: search */}
        <div className="flex-1 flex justify-center px-8">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search for a device, subnet, IP or host..."
              className="w-full bg-surface/60 border border-surface-border rounded pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-text-secondary/60 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Right: date/time + controls */}
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4 text-text-secondary hover:text-white cursor-pointer transition-colors" />
          <Settings className="w-4 h-4 text-text-secondary hover:text-white cursor-pointer transition-colors" />
          <div className="text-right">
            <div className="text-[11px] font-mono text-white leading-tight">Wed Mar 20 2024</div>
            <div className="text-[10px] font-mono text-text-secondary leading-tight">13:30:00</div>
          </div>
          <div className="text-right border-l border-surface-border pl-3">
            <div className="text-[11px] text-white leading-tight">London</div>
            <div className="text-[10px] text-accent leading-tight">+01:00</div>
          </div>
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center ml-1">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </header>

      {/* ============ INCIDENT HEADER ============ */}
      <div className="flex items-center h-9 px-4 bg-[#0d0e1a]/80 border-b border-surface-border/50 shrink-0">
        <Shield className="w-3.5 h-3.5 text-yellow-500 mr-2" />
        <span className="text-xs font-semibold text-white">
          Critical Incident - S1-VEM-01
        </span>
      </div>

      {/* ============ TAB BAR ============ */}
      <div className="flex items-center h-10 px-4 bg-[#0d0e1a]/60 border-b border-surface-border shrink-0">
        {/* Back button */}
        <button className="flex items-center justify-center w-7 h-7 rounded hover:bg-surface-light transition-colors mr-2">
          <ChevronLeft className="w-4 h-4 text-text-secondary" />
        </button>

        {/* Platform tabs */}
        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                  isActive
                    ? `bg-surface-light border border-surface-border ${tab.activeColor}`
                    : `${tab.color} hover:text-white hover:bg-surface/40`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.id}
              </button>
            );
          })}
        </div>

        {/* Communications Center */}
        <button className="ml-3 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:bg-surface/40 transition-all">
          <Radio className="w-3.5 h-3.5" />
          Communications Center
        </button>

        {/* Right side icons */}
        <div className="ml-auto flex items-center gap-1">
          {[Check, Copy].map((Icon, i) => (
            <button
              key={i}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-light transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-text-secondary" />
            </button>
          ))}
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Event list */}
        <div
          className={`transition-all duration-300 overflow-hidden shrink-0 ${
            sidebarOpen ? "w-72" : "w-0"
          }`}
        >
          <EventSidebar />
        </div>

        {/* Center panel - DETECT Summary */}
        <div className="flex-1 min-w-0 border-r border-surface-border bg-[#0c0d18]">
          <DetectSummary />
        </div>

        {/* Right panel - Network Graph */}
        <div className="w-[380px] shrink-0 bg-[#0a0b12]">
          <NetworkGraph />
        </div>
      </div>

      {/* ============ BOTTOM PANEL ============ */}
      <IncidentCards />

      {/* ============ PLAYBACK CONTROLS ============ */}
      <div className="flex items-center justify-center gap-2 h-8 bg-[#0d0e1a] border-t border-surface-border/50 shrink-0">
        {["⏮", "⏪", "▶", "⏩", "⏭", "↻"].map((icon, i) => (
          <button
            key={i}
            className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-white text-xs transition-colors rounded hover:bg-surface-light"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
