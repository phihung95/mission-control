"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { useStore } from "@/lib/store";
import { Team } from "@/lib/types";
import { Bot, ChevronDown, ChevronRight, Users, Plus, Settings } from "lucide-react";

function AgentNode({ agentId }: { agentId: string }) {
  const agent = useStore((s) => s.agents.find((a) => a.id === agentId));

  if (!agent) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#17171A] border border-[#1A1A1F] rounded-lg">
      <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
        <Bot className="w-4 h-4 text-indigo-400" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-white truncate">{agent.name}</div>
        <div className="text-[10px] text-[#5C5C60] truncate">{agent.model}</div>
      </div>
      <div
        className={`ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          agent.status === "active"
            ? "bg-emerald-400"
            : agent.status === "busy"
            ? "bg-amber-400"
            : "bg-[#5C5C60]"
        }`}
      />
    </div>
  );
}

function TeamNode({ team }: { team: Team }) {
  const [expanded, setExpanded] = useState(true);
  const store = useStore();
  const agents = store.agents.filter((a) => team.agents.includes(a.id));

  return (
    <div className="pl-6 border-l border-[#1A1A1F] ml-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 py-2 hover:opacity-80 transition-opacity w-full text-left"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-[#5C5C60] flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[#5C5C60] flex-shrink-0" />
        )}
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: team.color }}
        />
        <span className="text-sm font-medium text-white">{team.name}</span>
        <span className="text-xs text-[#5C5C60]">({agents.length})</span>
      </button>
      {expanded && (
        <div className="space-y-2 pb-2">
          {agents.map((agent) => (
            <AgentNode key={agent.id} agentId={agent.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamsPage() {
  const { organization } = useStore();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(organization.boardGroups.map((g) => [g.id, true]))
  );

  const toggleGroup = (id: string) =>
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar title="Teams" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Org Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              PN
            </div>
            <div>
              <div className="text-base font-semibold text-white">{organization.ownerName}</div>
              <div className="text-xs text-[#5C5C60]">{organization.name}</div>
            </div>
          </div>
        </div>

        {/* Chief of Staff */}
        <div className="mb-6">
          <div className="pl-6 border-l-2 border-indigo-500 ml-5">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#17171A] border border-[#1A1A1F] rounded-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Jarvis</div>
                <div className="text-xs text-[#8A8A8E]">Chief of Staff</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-[#5C5C60]">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teams by Board Group */}
        {organization.boardGroups.map((group) => (
          <div key={group.id} className="mb-6">
            {/* Group header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center gap-2 mb-3 w-full text-left"
            >
              {expandedGroups[group.id] ? (
                <ChevronDown className="w-4 h-4 text-[#5C5C60]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#5C5C60]" />
              )}
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <span className="text-xs font-semibold uppercase text-[#8A8A8E] tracking-wide">
                {group.identifier}
              </span>
              <span className="text-sm font-medium text-white">{group.name}</span>
              <span className="text-xs text-[#5C5C60]">· {group.teams.length} teams</span>
            </button>

            {/* Teams */}
            {expandedGroups[group.id] && (
              <div className="space-y-1">
                {group.teams.map((team) => (
                  <TeamNode key={team.id} team={team} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
