"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockTools, mockRuns, mockModels } from "@/lib/data";
import {
  Plug,
  Zap,
  Cpu,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

function StatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-[#17171A] rounded-lg p-4 border border-[#1A1A1F]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-[#8A8A8E] uppercase tracking-wide">
          {label}
        </span>
        <div className="w-7 h-7 rounded-md bg-[#1F1F24] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#8A8A8E]" />
        </div>
      </div>
      <div className="text-2xl font-semibold text-white mb-1">{value}</div>
      <div className="flex items-center gap-1">
        {positive ? (
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
        )}
        <span
          className={`text-[11px] ${positive ? "text-emerald-400" : "text-red-400"}`}
        >
          {change}
        </span>
        <span className="text-[11px] text-[#8A8A8E]">vs last week</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "success")
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400 text-[11px] font-medium">
        <CheckCircle2 className="w-3 h-3" /> Success
      </span>
    );
  if (status === "failure")
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-400/10 text-red-400 text-[11px] font-medium">
        <XCircle className="w-3 h-3" /> Failure
      </span>
    );
  if (status === "running")
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-400/10 text-blue-400 text-[11px] font-medium">
        <Loader2 className="w-3 h-3 animate-spin" /> Running
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#252529] text-[#8A8A8E] text-[11px] font-medium">
      <Clock className="w-3 h-3" /> Queued
    </span>
  );
}

export default function OverviewPage() {
  const totalRuns = mockRuns.length;
  const successRate = Math.round(
    (mockRuns.filter((r) => r.status === "success").length / totalRuns) * 100
  );
  const activeTools = mockTools.filter((t) => t.status === "active").length;
  const avgLatency = "2.4s";
  const recentRuns = mockRuns.slice(0, 5);
  const recentTools = mockTools.slice(0, 4);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar title="Overview" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Runs"
            value="12,847"
            change="+8.2%"
            positive={true}
            icon={Zap}
          />
          <StatCard
            label="Success Rate"
            value={`${successRate}%`}
            change="-0.3%"
            positive={false}
            icon={Activity}
          />
          <StatCard
            label="Active Tools"
            value={String(activeTools)}
            change="+2"
            positive={true}
            icon={Plug}
          />
          <StatCard
            label="Avg Latency"
            value={avgLatency}
            change="-12ms"
            positive={true}
            icon={Cpu}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Recent Runs */}
          <div className="bg-[#17171A] rounded-lg border border-[#1A1A1F]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1F]">
              <h2 className="text-[13px] font-semibold text-white">Recent Runs</h2>
              <a
                href="/runs"
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View all →
              </a>
            </div>
            <div className="divide-y divide-[#1A1A1F]">
              {recentRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-[#1F1F24] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusBadge status={run.status} />
                    <span className="text-[12px] text-[#C4C4C8] truncate">
                      {run.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-[11px] text-[#5C5C60]">
                      {run.startedAt}
                    </span>
                    <span className="text-[11px] text-[#5C5C60] w-12 text-right">
                      {run.duration}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tools */}
          <div className="bg-[#17171A] rounded-lg border border-[#1A1A1F]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1F]">
              <h2 className="text-[13px] font-semibold text-white">Active Tools</h2>
              <a
                href="/tools"
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Manage →
              </a>
            </div>
            <div className="divide-y divide-[#1A1A1F]">
              {recentTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-[#1F1F24] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-[#C4C4C8] truncate">
                      {tool.name}
                    </div>
                    <div className="text-[11px] text-[#5C5C60] truncate">
                      {tool.trigger}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] text-[#5C5C60]">
                      {tool.runs.toLocaleString()} runs
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        tool.status === "active"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-[#252529] text-[#5C5C60]"
                      }`}
                    >
                      {tool.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model status */}
        <div className="bg-[#17171A] rounded-lg border border-[#1A1A1F]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1F]">
            <h2 className="text-[13px] font-semibold text-white">Active Models</h2>
            <a
              href="/models"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Manage →
            </a>
          </div>
          <div className="grid grid-cols-4 divide-x divide-[#1A1A1F]">
            {mockModels
              .filter((m) => m.status === "active")
              .map((model) => (
                <div key={model.id} className="px-4 py-3">
                  <div className="text-[12px] font-medium text-white mb-1">
                    {model.name}
                  </div>
                  <div className="text-[11px] text-[#5C5C60]">{model.provider}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-[#5C5C60]">
                      {model.latency}
                    </span>
                    <span className="text-[10px] text-[#5C5C60]">
                      {model.costPerM}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
