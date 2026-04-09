"use client";

import { Agent } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Bot, Cpu, Eye, Hammer, Search } from "lucide-react";

const roleIcons = {
  coder: Hammer,
  researcher: Search,
  operator: Cpu,
  reviewer: Eye,
};

const roleLabels = {
  coder: "Coder",
  researcher: "Researcher",
  operator: "Operator",
  reviewer: "Reviewer",
};

interface AgentCardProps {
  agent: Agent;
  taskCount: number;
  onToggleStatus: () => void;
}

export function AgentCard({ agent, taskCount, onToggleStatus }: AgentCardProps) {
  const RoleIcon = roleIcons[agent.role];
  const isOllama = agent.provider === "ollama";

  return (
    <div className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-5 hover:border-[#3A3A40] transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            agent.status === "busy" ? "bg-[#FF880020]" :
            agent.status === "active" ? "bg-[#22C55E20]" : "bg-[#5C5C60]"
          }`}>
            <Bot className={`w-5 h-5 ${
              agent.status === "busy" ? "text-[#FF8800]" :
              agent.status === "active" ? "text-[#22C55E]" : "text-[#8A8A8E]"
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{agent.name}</h3>
            <p className="text-sm text-[#8A8A8E]">{agent.model}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        <span 
          className={`text-xs px-2 py-1 rounded font-medium ${
            isOllama ? "bg-[#FF880020] text-[#FF8800]" : "bg-[#8844FF20] text-[#8844FF]"
          }`}
        >
          {isOllama ? "Ollama" : "OpenRouter"}
        </span>
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium bg-[#1A1A1F] text-[#8A8A8E]">
          <RoleIcon className="w-3 h-3" />
          {roleLabels[agent.role]}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-[#2A2A30]">
        <div>
          <div className="text-lg font-semibold text-white">{taskCount}</div>
          <div className="text-xs text-[#5C5C60]">Assigned tasks</div>
        </div>
        <button
          onClick={onToggleStatus}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            agent.status === "active"
              ? "bg-[#1A1A1F] text-[#8A8A8E] hover:text-white"
              : "bg-[#22C55E20] text-[#22C55E] hover:bg-[#22C55E30]"
          }`}
        >
          {agent.status === "active" ? "Pause" : "Activate"}
        </button>
      </div>
    </div>
  );
}
