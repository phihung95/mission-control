"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { TopBar } from "@/components/layout/TopBar";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentModal } from "@/components/agents/AgentModal";
import { Agent } from "@/lib/types";
import { Plus, Bot } from "lucide-react";

export default function AgentsPage() {
  const { agents, organization, toggleAgentStatus, addAgent } = useStore();
  const [showModal, setShowModal] = useState(false);

  // Calculate task counts per agent
  const getTaskCountForAgent = (agentId: string): number => {
    let count = 0;
    organization.boardGroups.forEach((group) => {
      group.boards.forEach((board) => {
        board.columns.forEach((col) => {
          count += col.tasks.filter((t) => t.assigneeId === agentId).length;
        });
      });
    });
    return count;
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar 
        title="Agents" 
        subtitle={`${agents.length} agents configured`}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Agent
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-2xl bg-[#1A1A1F] flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-[#5C5C60]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No agents yet</h3>
            <p className="text-[#8A8A8E] mb-6">Add your first AI agent to start automating tasks.</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                taskCount={getTaskCountForAgent(agent.id)}
                onToggleStatus={() => toggleAgentStatus(agent.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AgentModal 
          onClose={() => setShowModal(false)} 
          onAdd={(agent) => {
            addAgent(agent);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
