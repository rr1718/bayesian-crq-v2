"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ThreatFeed from "@/components/dashboard/ThreatFeed";
import SOCPanel from "@/components/dashboard/SOCPanel";
import NetworkTopology from "@/components/dashboard/NetworkTopology";

const ChartsPanel = dynamic(() => import("@/components/dashboard/ChartsPanel"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-text-secondary">Loading analytics...</div>
    </div>
  ),
});

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-[1920px] mx-auto p-4 sm:p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <DashboardOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThreatFeed />
              <SOCPanel />
            </div>
          </div>
        )}
        {activeTab === "threats" && <ThreatFeed fullWidth />}
        {activeTab === "analytics" && <ChartsPanel />}
        {activeTab === "soc" && <SOCPanel fullWidth />}
        {activeTab === "topology" && <NetworkTopology />}
      </div>
    </div>
  );
}
