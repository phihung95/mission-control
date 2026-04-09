"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { mockTools, type Tool } from "@/lib/data";
import {
  Plus,
  Search,
  Zap,
  Clock,
  Play,
  Pause,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  X,
  GitBranch,
} from "lucide-react";

function ToolCard({ tool }: { tool: Tool }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-[#17171A] rounded-lg border border-[#1A1A1F] p-4 hover:border-[#2A2A30] transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-500/10 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-white">{tool.name}</div>
            <div className="text-[11px] text-[#5C5C60]">{tool.trigger}</div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[#252529] text-[#5C5C60] hover:text-white transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-6 w-36 bg-[#252529] border border-[#1A1A1F] rounded-lg shadow-xl z-20 overflow-hidden">
                <button className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-white hover:bg-[#2F2F36] transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-white hover:bg-[#2F2F36] transition-colors">
                  <Play className="w-3.5 h-3.5" /> Run now
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-white hover:bg-[#2F2F36] transition-colors">
                  <Pause className="w-3.5 h-3.5" />{" "}
                  {tool.status === "active" ? "Pause" : "Resume"}
                </button>
                <div className="border-t border-[#1A1A1F]" />
                <button className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-red-400 hover:bg-[#2F2F36] transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-[12px] text-[#8A8A8E] mb-4 line-clamp-2 leading-relaxed">
        {tool.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              tool.status === "active"
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-[#252529] text-[#5C5C60]"
            }`}
          >
            {tool.status}
          </span>
          <span className="text-[11px] text-[#5C5C60]">
            {tool.runs.toLocaleString()} runs
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#5C5C60]">
          <Clock className="w-3 h-3" />
          {tool.lastRun}
        </div>
      </div>
    </div>
  );
}

function CreateToolModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[520px] bg-[#17171A] border border-[#1A1A1F] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1F]">
          <div>
            <h2 className="text-[14px] font-semibold text-white">New Tool</h2>
            <p className="text-[11px] text-[#8A8A8E] mt-0.5">
              Step {step} of 3 — Configure trigger
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#252529] text-[#8A8A8E] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex px-5 py-3 gap-1.5 border-b border-[#1A1A1F]">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-indigo-500" : "bg-[#252529]"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-[#8A8A8E] mb-1.5">
                  Tool Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gmail Monitor"
                  className="w-full bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-2 text-[13px] text-white placeholder-[#5C5C60] outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#8A8A8E] mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="What does this tool do?"
                  rows={3}
                  className="w-full bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-2 text-[13px] text-white placeholder-[#5C5C60] outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#8A8A8E] mb-1.5">
                  Trigger Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: "⚡", label: "Webhook", desc: "HTTP POST" },
                    { icon: "⏰", label: "Schedule", desc: "Cron / interval" },
                    { icon: "📧", label: "Email", desc: "Inbound email" },
                  ].map((t) => (
                    <button
                      key={t.label}
                      className="flex flex-col items-center gap-1 p-3 rounded-lg border border-[#1A1A1F] hover:border-indigo-500/50 bg-[#0D0D0F] transition-colors text-left"
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-[11px] font-medium text-white">
                        {t.label}
                      </span>
                      <span className="text-[10px] text-[#5C5C60]">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0F] border border-[#1A1A1F]">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="text-[12px] font-medium text-white">
                    Connect an agent
                  </div>
                  <div className="text-[11px] text-[#8A8A8E]">
                    Assign an AI agent to power this tool
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5C5C60] ml-auto" />
              </div>
              <div>
                <label className="block text-[11px] text-[#8A8A8E] mb-1.5">
                  System Prompt
                </label>
                <textarea
                  placeholder="You are an AI assistant that..."
                  rows={6}
                  className="w-full bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-2 text-[12px] text-white placeholder-[#5C5C60] outline-none focus:border-indigo-500 transition-colors resize-none font-mono leading-relaxed"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-[12px] text-[#8A8A8E] mb-2">
                Review your tool configuration before creating.
              </div>
              <div className="space-y-3">
                {[
                  { label: "Name", value: "Gmail Monitor" },
                  { label: "Trigger", value: "Webhook — POST /hooks/gmail" },
                  { label: "Agent", value: "gemma4:e4b (Ollama)" },
                  { label: "Max duration", value: "30s" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-[#1A1A1F]"
                  >
                    <span className="text-[11px] text-[#5C5C60]">{item.label}</span>
                    <span className="text-[12px] text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#1A1A1F]">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className="px-3 py-1.5 text-[12px] text-[#8A8A8E] hover:text-white transition-colors"
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[12px] text-[#8A8A8E] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep(Math.min(3, step + 1))}
              className="px-4 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium transition-colors"
            >
              {step === 3 ? "Create Tool" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredTools = mockTools.filter((tool) => {
    if (filterStatus !== "All" && tool.status !== filterStatus) return false;
    if (
      search &&
      !tool.name.toLowerCase().includes(search.toLowerCase()) &&
      !tool.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        title="Tools"
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-[12px] font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Tool
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Search + filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#17171A] border border-[#1A1A1F] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#5C5C60]" />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[12px] text-white placeholder-[#5C5C60] outline-none w-full"
            />
          </div>
          <div className="flex items-center bg-[#17171A] rounded-md border border-[#1A1A1F] overflow-hidden">
            {["All", "Active", "Paused"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-[11px] transition-colors ${
                  filterStatus === s
                    ? "bg-[#252529] text-white"
                    : "text-[#8A8A8E] hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-[#5C5C60]">
            {filteredTools.length} tools
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {showCreate && <CreateToolModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
