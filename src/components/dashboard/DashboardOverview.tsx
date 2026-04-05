"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Monitor,
  Activity,
} from "lucide-react";

interface KPIData {
  totalThreats: number;
  activeIncidents: number;
  threatsContained: number;
  avgResponseTime: number;
  aiInvestigations: number;
  devicesMonitored: number;
}

interface KPIDeltas {
  totalThreats: number;
  activeIncidents: number;
  threatsContained: number;
  avgResponseTime: number;
  aiInvestigations: number;
  devicesMonitored: number;
}

interface SeverityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export default function DashboardOverview() {
  const [kpi, setKpi] = useState<KPIData>({
    totalThreats: 259,
    activeIncidents: 5,
    threatsContained: 238,
    avgResponseTime: 2.3,
    aiInvestigations: 1847,
    devicesMonitored: 9495,
  });

  const [deltas, setDeltas] = useState<KPIDeltas>({
    totalThreats: 3,
    activeIncidents: 1,
    threatsContained: 2,
    avgResponseTime: -0.1,
    aiInvestigations: 12,
    devicesMonitored: 0,
  });

  const [severity, setSeverity] = useState<SeverityBreakdown>({
    critical: 12,
    high: 47,
    medium: 118,
    low: 82,
  });

  const updateData = useCallback(() => {
    setKpi((prev) => {
      const threatInc = randomInt(0, 3);
      const containedInc = randomInt(0, threatInc);
      const newActiveIncidents = Math.max(
        3,
        Math.min(8, prev.activeIncidents + randomInt(-1, 1))
      );
      const newAvgResponse = randomFloat(1.8, 3.2, 1);
      const aiInc = randomInt(3, 18);

      return {
        totalThreats: prev.totalThreats + threatInc,
        activeIncidents: newActiveIncidents,
        threatsContained: prev.threatsContained + containedInc,
        avgResponseTime: newAvgResponse,
        aiInvestigations: prev.aiInvestigations + aiInc,
        devicesMonitored: 9495,
      };
    });

    setDeltas((prev) => ({
      totalThreats: randomInt(1, 5),
      activeIncidents: randomInt(-2, 2),
      threatsContained: randomInt(1, 4),
      avgResponseTime: randomFloat(-0.4, 0.3, 1),
      aiInvestigations: randomInt(3, 18),
      devicesMonitored: 0,
    }));

    setSeverity(() => ({
      critical: randomInt(10, 18),
      high: randomInt(40, 58),
      medium: randomInt(105, 135),
      low: randomInt(70, 95),
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateData, 2500);
    return () => clearInterval(interval);
  }, [updateData]);

  const kpiCards = [
    {
      label: "Total Threats Today",
      value: kpi.totalThreats.toLocaleString(),
      delta: deltas.totalThreats,
      deltaLabel: `+${deltas.totalThreats}`,
      isPositiveBad: true,
      icon: Shield,
      iconColor: "text-red-400",
    },
    {
      label: "Active Incidents",
      value: kpi.activeIncidents.toString(),
      delta: deltas.activeIncidents,
      deltaLabel:
        deltas.activeIncidents >= 0
          ? `+${deltas.activeIncidents}`
          : `${deltas.activeIncidents}`,
      isPositiveBad: true,
      icon: AlertTriangle,
      iconColor: "text-orange-400",
    },
    {
      label: "Threats Contained",
      value: kpi.threatsContained.toLocaleString(),
      delta: deltas.threatsContained,
      deltaLabel: `+${deltas.threatsContained}`,
      isPositiveBad: false,
      icon: CheckCircle,
      iconColor: "text-emerald-400",
    },
    {
      label: "Avg Response Time",
      value: `${kpi.avgResponseTime}s`,
      delta: deltas.avgResponseTime,
      deltaLabel:
        deltas.avgResponseTime >= 0
          ? `+${deltas.avgResponseTime}s`
          : `${deltas.avgResponseTime}s`,
      isPositiveBad: true,
      icon: Clock,
      iconColor: "text-accent",
    },
    {
      label: "AI Investigations",
      value: kpi.aiInvestigations.toLocaleString(),
      delta: deltas.aiInvestigations,
      deltaLabel: `+${deltas.aiInvestigations}`,
      isPositiveBad: false,
      icon: Brain,
      iconColor: "text-purple-400",
    },
    {
      label: "Devices Monitored",
      value: kpi.devicesMonitored.toLocaleString(),
      delta: deltas.devicesMonitored,
      deltaLabel: "--",
      isPositiveBad: false,
      icon: Monitor,
      iconColor: "text-blue-400",
    },
  ];

  const severityTotal =
    severity.critical + severity.high + severity.medium + severity.low;

  const severityBars = [
    {
      label: "Critical",
      count: severity.critical,
      color: "bg-red-500",
      textColor: "text-red-400",
    },
    {
      label: "High",
      count: severity.high,
      color: "bg-orange-500",
      textColor: "text-orange-400",
    },
    {
      label: "Medium",
      count: severity.medium,
      color: "bg-yellow-500",
      textColor: "text-yellow-400",
    },
    {
      label: "Low",
      count: severity.low,
      color: "bg-blue-500",
      textColor: "text-blue-400",
    },
  ];

  function getDeltaColor(delta: number, isPositiveBad: boolean): string {
    if (delta === 0) return "text-text-secondary";
    if (delta > 0) return isPositiveBad ? "text-red-400" : "text-emerald-400";
    return isPositiveBad ? "text-emerald-400" : "text-red-400";
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Bar - 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-surface-light border border-surface-border rounded-lg p-4 card-glow"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                <span
                  className={`text-xs font-medium ${getDeltaColor(card.delta, card.isPositiveBad)}`}
                >
                  {card.deltaLabel}
                </span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight transition-all duration-300">
                {card.value}
              </p>
              <p className="text-xs text-text-secondary mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Threat Severity Breakdown */}
      <div className="bg-surface-light border border-surface-border rounded-lg p-5 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Threat Severity Breakdown
          </h3>
          <span className="text-xs text-text-secondary">
            {severityTotal} total threats
          </span>
        </div>

        {/* Stacked horizontal bar */}
        <div className="flex h-4 rounded-full overflow-hidden mb-4">
          {severityBars.map((bar) => (
            <div
              key={bar.label}
              className={`${bar.color} transition-all duration-500 ease-in-out`}
              style={{
                width: `${(bar.count / severityTotal) * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Legend with counts */}
        <div className="flex items-center justify-between">
          {severityBars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${bar.color}`} />
              <span className="text-xs text-text-secondary">{bar.label}</span>
              <span className={`text-xs font-semibold ${bar.textColor}`}>
                {bar.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Indicator */}
      <div className="flex items-center gap-3 bg-surface-light border border-surface-border rounded-lg px-5 py-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
        <Activity className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-emerald-400 font-medium">
          SYSTEM ACTIVE
        </span>
        <span className="text-sm text-text-secondary">
          &mdash; All domains monitored
        </span>
      </div>
    </div>
  );
}
