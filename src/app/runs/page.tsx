"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { mockRuns, type Run } from "@/lib/data";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ChevronRight,
  X,
  Terminal,
  ScrollText,
  Network,
  Copy,
  ExternalLink,
} from "lucide-react";

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

function SourceBadge({ source, icon }: { source: string; icon: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-[#8A8A8E]">
      <span>{icon}</span>
      <span className="capitalize">{source}</span>
    </span>
  );
}

function RunDetail({ run, onClose }: { run: Run; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "logs" | "trace">("overview");
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: ScrollText },
    { id: "logs", label: "Logs", icon: Terminal },
    { id: "trace", label: "Trace", icon: Network },
  ];

  return (
    <div className="w-96 border-l border-[#1A1A1F] bg-[#0D0D0F] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1F]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[12px] font-medium text-white truncate">
            {run.name}
          </span>
          <StatusBadge status={run.status} />
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[#1F1F24] text-[#8A8A8E] hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1A1A1F]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-indigo-500 text-white"
                : "border-transparent text-[#8A8A8E] hover:text-white"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="p-4 space-y-4">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-[#5C5C60] uppercase tracking-wide mb-1">
                  Duration
                </div>
                <div className="text-[12px] text-white">{run.duration}s</div>
              </div>
              <div>
                <div className="text-[10px] text-[#5C5C60] uppercase tracking-wide mb-1">
                  Source
                </div>
                <div className="text-[12px] text-white capitalize">{run.source}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#5C5C60] uppercase tracking-wide mb-1">
                  Started
                </div>
                <div className="text-[12px] text-white">{run.startedAt}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#5C5C60] uppercase tracking-wide mb-1">
                  Run ID
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[12px] text-white font-mono text-[10px]">
                    {run.id}
                  </span>
                  <button className="p-0.5 text-[#5C5C60] hover:text-white transition-colors">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div>
              <div className="text-[10px] text-[#5C5C60] uppercase tracking-wide mb-2">
                Steps
              </div>
              <div className="space-y-1">
                {run.steps.map((step, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setActiveStep(activeStep === i ? null : i)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md transition-colors text-left ${
                        activeStep === i ? "bg-[#1F1F24]" : "hover:bg-[#17171A]"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          step.status === "ok" ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      <span
                        className={`flex-1 text-[12px] ${
                          step.status === "error"
                            ? "text-red-400"
                            : "text-[#C4C4C8]"
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="text-[11px] text-[#5C5C60] flex-shrink-0">
                        {step.duration}ms
                      </span>
                      <ChevronRight
                        className={`w-3 h-3 text-[#5C5C60] flex-shrink-0 transition-transform ${
                          activeStep === i ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {activeStep === i && step.detail && (
                      <div className="ml-6 mr-2 mb-1 px-2.5 py-1.5 rounded bg-[#1F1F24] border-l-2 border-red-400/50">
                        <span className="text-[11px] text-[#8A8A8E]">{step.detail}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="p-4">
            <pre className="text-[11px] text-[#8A8A8E] font-mono leading-relaxed">
{`[00:00:00.001] ✓ Tool initialized
[00:00:00.021] ✓ Build prompt (21ms)
[00:00:00.066] ✓ Search inbox (45ms) → Found 3 emails
[00:00:00.078] ✓ Parse meeting requests (12ms)
[00:00:00.490] ✓ Make API request (412ms)
[00:00:00.498] ✓ Format output (8ms)
[00:00:02.100] ✓ Save to Notion (1602ms)
[00:00:02.100] ✓ Run completed successfully`}
            </pre>
          </div>
        )}

        {activeTab === "trace" && (
          <div className="p-4">
            <div className="text-[11px] text-[#8A8A8E] mb-3">
              Execution trace for this run
            </div>
            <div className="space-y-2">
              {run.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-[10px] text-[#5C5C60] w-16 text-right flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="w-16 text-[11px] text-[#5C5C60]">{step.duration}ms</div>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      step.status === "ok" ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  <div className="text-[12px] text-[#C4C4C8]">{step.name}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#1A1A1F]">
              <button className="flex items-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">
                <ExternalLink className="w-3 h-3" />
                Open in trace viewer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RunsPage() {
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const [filterSource, setFilterSource] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Newest");

  const sources = ["All", "webhook", "schedule", "email"];
  const statuses = ["All", "success", "failure", "running"];

  const filteredRuns = mockRuns.filter((run) => {
    if (filterSource !== "All" && run.source !== filterSource) return false;
    if (filterStatus !== "All" && run.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar title="Runs" />
      <div className="flex flex-1 overflow-hidden">
        {/* Main list */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-[#1A1A1F]">
            {/* Source filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8A8A8E]">Source</span>
              <div className="flex items-center bg-[#17171A] rounded-md border border-[#1A1A1F] overflow-hidden">
                {sources.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterSource(s)}
                    className={`px-2.5 py-1 text-[11px] transition-colors ${
                      filterSource === s
                        ? "bg-[#252529] text-white"
                        : "text-[#8A8A8E] hover:text-white"
                    }`}
                  >
                    {s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8A8A8E]">Status</span>
              <div className="flex items-center bg-[#17171A] rounded-md border border-[#1A1A1F] overflow-hidden">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 text-[11px] transition-colors capitalize ${
                      filterStatus === s
                        ? "bg-[#252529] text-white"
                        : "text-[#8A8A8E] hover:text-white"
                    }`}
                  >
                    {s === "All" ? "All" : s}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] text-[#8A8A8E]">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#17171A] border border-[#1A1A1F] rounded-md px-2 py-1 text-[11px] text-white outline-none"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Fastest</option>
                <option>Slowest</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#0D0D0F] z-10">
                <tr className="border-b border-[#1A1A1F]">
                  <th className="text-left text-[10px] font-medium text-[#5C5C60] uppercase tracking-wide px-6 py-2">
                    Name
                  </th>
                  <th className="text-left text-[10px] font-medium text-[#5C5C60] uppercase tracking-wide px-4 py-2 w-28">
                    Status
                  </th>
                  <th className="text-left text-[10px] font-medium text-[#5C5C60] uppercase tracking-wide px-4 py-2 w-28">
                    Source
                  </th>
                  <th className="text-left text-[10px] font-medium text-[#5C5C60] uppercase tracking-wide px-4 py-2 w-24">
                    Started
                  </th>
                  <th className="text-right text-[10px] font-medium text-[#5C5C60] uppercase tracking-wide px-6 py-2 w-20">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1F]">
                {filteredRuns.map((run) => (
                  <tr
                    key={run.id}
                    onClick={() => setSelectedRun(run)}
                    className={`cursor-pointer transition-colors ${
                      selectedRun?.id === run.id
                        ? "bg-[#1F1F24]"
                        : "hover:bg-[#17171A]"
                    }`}
                  >
                    <td className="px-6 py-3">
                      <span className="text-[12px] text-[#C4C4C8]">{run.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-4 py-3">
                      <SourceBadge source={run.source} icon={run.sourceIcon} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-[#5C5C60]">{run.startedAt}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-[12px] text-[#5C5C60]">{run.duration}s</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selectedRun && (
          <RunDetail run={selectedRun} onClose={() => setSelectedRun(null)} />
        )}
      </div>
    </div>
  );
}
