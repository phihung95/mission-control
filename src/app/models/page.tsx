"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockModels } from "@/lib/data";
import {
  Cpu,
  Plus,
  Activity,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Settings,
  MoreHorizontal,
} from "lucide-react";

function ModelRow({
  model,
}: {
  model: {
    id: string;
    name: string;
    provider: string;
    status: string;
    latency: string;
    costPerM: string;
  };
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-3 border-b border-[#1A1A1F] hover:bg-[#17171A] transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            model.status === "active" ? "bg-emerald-400" : "bg-[#5C5C60]"
          }`}
        />
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-white">{model.name}</div>
          <div className="text-[11px] text-[#5C5C60]">{model.provider}</div>
        </div>
      </div>

      <div className="flex items-center gap-1 w-20">
        {model.status === "active" ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-[#5C5C60]" />
        )}
        <span
          className={`text-[11px] ${
            model.status === "active" ? "text-emerald-400" : "text-[#5C5C60]"
          }`}
        >
          {model.status}
        </span>
      </div>

      <div className="flex items-center gap-1 w-24 text-[12px] text-[#8A8A8E]">
        <Activity className="w-3.5 h-3.5 text-[#5C5C60]" />
        {model.latency}
      </div>

      <div className="flex items-center gap-1 w-20 text-[12px] text-[#8A8A8E]">
        <DollarSign className="w-3.5 h-3.5 text-[#5C5C60]" />
        {model.costPerM === "Free" ? "Free" : `$${model.costPerM}`}
      </div>

      <div className="flex items-center gap-1 w-16 text-[12px] text-[#5C5C60]">
        <Clock className="w-3.5 h-3.5" />
        Now
      </div>

      <button className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#252529] text-[#5C5C60] hover:text-white transition-all">
        <Settings className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ModelsPage() {
  const activeModels = mockModels.filter((m) => m.status === "active");
  const avgLatency =
    activeModels.length > 0
      ? Math.round(
          activeModels
            .map((m) => parseInt(m.latency))
            .reduce((a, b) => a + b, 0) / activeModels.length
        ) + "ms"
      : "—";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        title="Models"
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#252529] hover:bg-[#2F2F36] text-white text-[12px] font-medium transition-colors border border-[#1A1A1F]">
            <Plus className="w-3.5 h-3.5" />
            Add Model
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto">
        {/* Summary bar */}
        <div className="flex items-center gap-6 px-6 py-4 border-b border-[#1A1A1F] bg-[#17171A]/50">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#5C5C60]" />
            <span className="text-[12px] text-[#8A8A8E]">
              {activeModels.length} active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#5C5C60]" />
            <span className="text-[12px] text-[#8A8A8E]">
              Avg latency: {avgLatency}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#5C5C60]" />
            <span className="text-[12px] text-[#8A8A8E]">
              Est. cost: $0.00 / day
            </span>
          </div>
        </div>

        {/* Table header */}
        <div className="flex items-center gap-4 px-6 py-2 border-b border-[#1A1A1F]">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-[#5C5C60] uppercase tracking-wide font-medium">
              Model
            </span>
          </div>
          <div className="w-20">
            <span className="text-[10px] text-[#5C5C60] uppercase tracking-wide font-medium">
              Status
            </span>
          </div>
          <div className="w-24">
            <span className="text-[10px] text-[#5C5C60] uppercase tracking-wide font-medium">
              Latency
            </span>
          </div>
          <div className="w-20">
            <span className="text-[10px] text-[#5C5C60] uppercase tracking-wide font-medium">
              Cost / 1M
            </span>
          </div>
          <div className="w-16">
            <span className="text-[10px] text-[#5C5C60] uppercase tracking-wide font-medium">
              Last used
            </span>
          </div>
          <div className="w-6" />
        </div>

        {/* Rows */}
        {mockModels.map((model) => (
          <ModelRow key={model.id} model={model} />
        ))}

        {/* Quick actions */}
        <div className="px-6 py-6">
          <h3 className="text-[11px] text-[#5C5C60] uppercase tracking-wide font-medium mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Pull from Ollama", desc: "Download a new model" },
              { label: "Add OpenRouter key", desc: "Enable cloud models" },
              { label: "Set default model", desc: "Change primary model" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex flex-col gap-1 p-3 rounded-lg border border-[#1A1A1F] bg-[#17171A] hover:border-[#2A2A30] text-left transition-colors"
              >
                <span className="text-[12px] font-medium text-white">
                  {action.label}
                </span>
                <span className="text-[11px] text-[#5C5C60]">{action.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
