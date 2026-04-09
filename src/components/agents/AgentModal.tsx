"use client";

import { useState } from "react";
import { Agent } from "@/lib/types";
import { X, Bot } from "lucide-react";

interface AgentModalProps {
  onClose: () => void;
  onAdd: (agent: Agent) => void;
}

export function AgentModal({ onClose, onAdd }: AgentModalProps) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [provider, setProvider] = useState<"ollama" | "openrouter">("ollama");
  const [role, setRole] = useState<Agent["role"]>("coder");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !model) return;

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name,
      model,
      provider,
      role,
      status: "idle",
    };

    onAdd(newAgent);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#17171A] border border-[#2A2A30] rounded-xl w-full max-w-md animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A30]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5E5CE620] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#5E5CE6]" />
            </div>
            <h2 className="font-semibold text-white">Add New Agent</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1A1A1F] text-[#8A8A8E] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8A8A8E] mb-2">
              Agent Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="e.g. Coder-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8A8A8E] mb-2">
              Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full"
              placeholder="e.g. gemma4:e4b"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8A8A8E] mb-2">
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as "ollama" | "openrouter")}
              className="w-full"
            >
              <option value="ollama">Ollama</option>
              <option value="openrouter">OpenRouter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8A8A8E] mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Agent["role"])}
              className="w-full"
            >
              <option value="coder">Coder</option>
              <option value="researcher">Researcher</option>
              <option value="operator">Operator</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#8A8A8E] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white rounded-lg transition-colors"
            >
              Add Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
