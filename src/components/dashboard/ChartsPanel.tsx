"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import {
  generateTimeSeriesData,
  generateDomainStats,
  type AlertMetric,
  type DomainStats,
} from "@/lib/sampleData";

// --- Theme constants ---
const COLORS = {
  primary: "#6c3bf5",
  accent: "#00d4aa",
  accentBlue: "#3b82f6",
  surface: "#12131f",
  surfaceLight: "#1a1b2e",
  surfaceBorder: "#2a2b3d",
  textSecondary: "#8892a4",
  danger: "#ef4444",
  warning: "#f59e0b",
  success: "#10b981",
};

const GRID_STROKE = "#2a2b3d";
const AXIS_TICK = { fill: "#8892a4", fontSize: 11 };

// --- Threat category data ---
interface ThreatCategory {
  name: string;
  count: number;
  color: string;
}

const threatCategories: ThreatCategory[] = [
  { name: "Malware", count: 187, color: COLORS.danger },
  { name: "Phishing", count: 156, color: COLORS.warning },
  { name: "Lateral Movement", count: 89, color: COLORS.primary },
  { name: "Data Exfil", count: 73, color: "#f97316" },
  { name: "C2 Callback", count: 64, color: COLORS.danger },
  { name: "Insider", count: 42, color: COLORS.accentBlue },
  { name: "Brute Force", count: 128, color: COLORS.warning },
  { name: "Privilege Esc.", count: 51, color: COLORS.primary },
];

// --- Response time data ---
interface ResponseTimePoint {
  time: string;
  responseMs: number;
}

function generateResponseTimeData(): ResponseTimePoint[] {
  const data: ResponseTimePoint[] = [];
  for (let i = 60; i >= 0; i--) {
    const base = 800 + Math.random() * 1800;
    const spike = Math.random() > 0.92 ? 1500 + Math.random() * 2000 : 0;
    data.push({
      time: `${i}m ago`,
      responseMs: Math.round(base + spike),
    });
  }
  return data;
}

// --- Custom Tooltip ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-surface-border bg-surface-light px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-text-secondary">{label}</p>
      {payload.map((entry: { color: string; name: string; value: number }, i: number) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

// --- Chart Card wrapper ---
function ChartCard({
  title,
  stat,
  statLabel,
  children,
}: {
  title: string;
  stat: string;
  statLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-glow rounded-xl border border-surface-border bg-surface-light p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <div className="text-right">
          <span className="text-lg font-bold text-white">{stat}</span>
          <span className="ml-1.5 text-xs text-text-secondary">{statLabel}</span>
        </div>
      </div>
      <div className="h-[240px] w-full">{children}</div>
    </div>
  );
}

// --- Main component ---
export default function ChartsPanel() {
  const [timeSeriesData, setTimeSeriesData] = useState<AlertMetric[]>(() =>
    generateTimeSeriesData(24)
  );
  const [domainStats] = useState<DomainStats[]>(() => generateDomainStats());
  const [responseTimeData] = useState<ResponseTimePoint[]>(() =>
    generateResponseTimeData()
  );

  // Live update: append a new data point every 5 seconds
  const appendDataPoint = useCallback(() => {
    setTimeSeriesData((prev) => {
      const now = new Date();
      const isBusinessHours = now.getHours() >= 8 && now.getHours() <= 18;
      const baseThreats = isBusinessHours ? 12 : 5;
      const baseAnomalies = isBusinessHours ? 45 : 18;
      const newPoint: AlertMetric = {
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        threats: baseThreats + Math.floor(Math.random() * 15),
        anomalies: baseAnomalies + Math.floor(Math.random() * 30),
        contained: Math.floor((baseThreats + Math.random() * 10) * 0.85),
      };
      return [...prev.slice(1), newPoint];
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(appendDataPoint, 5000);
    return () => clearInterval(interval);
  }, [appendDataPoint]);

  // Compute key stats
  const totalThreats = timeSeriesData.reduce((s, d) => s + d.threats, 0);
  const avgCoverage =
    Math.round(
      (domainStats.reduce((s, d) => s + d.coverage, 0) / domainStats.length) *
        10
    ) / 10;
  const totalCategoryThreats = threatCategories.reduce(
    (s, d) => s + d.count,
    0
  );
  const avgResponseMs =
    Math.round(
      responseTimeData.reduce((s, d) => s + d.responseMs, 0) /
        responseTimeData.length
    );

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* 1. Threat Detection Timeline */}
      <ChartCard
        title="Threat Detection Timeline"
        stat={totalThreats.toLocaleString()}
        statLabel="threats / 24h"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="gradThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradAnomalies" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradContained" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis
              dataKey="time"
              tick={AXIS_TICK}
              axisLine={{ stroke: GRID_STROKE }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={AXIS_TICK}
              axisLine={{ stroke: GRID_STROKE }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="anomalies"
              name="Anomalies"
              stroke={COLORS.primary}
              fill="url(#gradAnomalies)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="threats"
              name="Threats"
              stroke={COLORS.danger}
              fill="url(#gradThreats)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="contained"
              name="Contained"
              stroke={COLORS.success}
              fill="url(#gradContained)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 2. Domain Coverage */}
      <ChartCard
        title="Domain Coverage"
        stat={`${avgCoverage}%`}
        statLabel="avg coverage"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={domainStats} outerRadius="70%">
            <PolarGrid stroke={GRID_STROKE} />
            <PolarAngleAxis
              dataKey="domain"
              tick={{ fill: "#8892a4", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#8892a4", fontSize: 10 }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Coverage %"
              dataKey="coverage"
              stroke={COLORS.accent}
              fill={COLORS.accent}
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3. Threat Categories */}
      <ChartCard
        title="Threat Categories"
        stat={totalCategoryThreats.toLocaleString()}
        statLabel="total events"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={threatCategories}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={GRID_STROKE}
              horizontal={false}
            />
            <XAxis type="number" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#8892a4", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Events" radius={[0, 4, 4, 0]} barSize={18}>
              {threatCategories.map((entry, index) => (
                <Cell key={index} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 4. Response Time Distribution */}
      <ChartCard
        title="AI Response Time"
        stat={`${(avgResponseMs / 1000).toFixed(1)}s`}
        statLabel="avg response"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis
              dataKey="time"
              tick={AXIS_TICK}
              axisLine={{ stroke: GRID_STROKE }}
              tickLine={false}
              interval={14}
            />
            <YAxis
              tick={AXIS_TICK}
              axisLine={{ stroke: GRID_STROKE }}
              tickLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}s`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgResponseMs}
              stroke={COLORS.warning}
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: `Avg ${(avgResponseMs / 1000).toFixed(1)}s`,
                fill: COLORS.warning,
                fontSize: 11,
                position: "insideTopRight",
              }}
            />
            <Line
              type="monotone"
              dataKey="responseMs"
              name="Response Time"
              stroke={COLORS.accentBlue}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLORS.accentBlue }}
            />
            <ReferenceLine
              y={3000}
              stroke={COLORS.danger}
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: "3s SLA",
                fill: COLORS.danger,
                fontSize: 10,
                position: "insideTopRight",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}
