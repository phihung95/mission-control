"use client";

import { useStore } from "@/lib/store";
import { getTaskStats } from "@/lib/data";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar } from "@/components/shared/Avatar";
import { LiveFeed } from "@/components/shared/LiveFeed";
import { getRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { 
  ListTodo, 
  Play, 
  CheckCircle2, 
  Bot, 
  ArrowRight,
  Kanban
} from "lucide-react";

export default function OverviewPage() {
  const { organization, agents } = useStore();
  const stats = getTaskStats(organization);

  // Get recent boards
  const recentBoards = organization.boardGroups.flatMap((g) => 
    g.boards.map((b) => ({ ...b, groupName: g.name, groupColor: g.color }))
  ).slice(0, 4);

  return (
    <div className="flex flex-col h-full">
      <TopBar 
        title="Overview" 
        subtitle="Phi Hung's Lab"
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#4488FF20] flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-[#4488FF]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
            <div className="text-sm text-[#8A8A8E]">Total tasks</div>
          </div>

          <div className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#FF880020] flex items-center justify-center">
                <Play className="w-4 h-4 text-[#FF8800]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.inProgress}</div>
            <div className="text-sm text-[#8A8A8E]">In progress</div>
          </div>

          <div className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#22C55E20] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.completedThisWeek}</div>
            <div className="text-sm text-[#8A8A8E]">Completed this week</div>
          </div>

          <div className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#8844FF20] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#8844FF]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.activeAgents}</div>
            <div className="text-sm text-[#8A8A8E]">Active agents</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Boards */}
          <div className="col-span-2 bg-[#17171A] border border-[#2A2A30] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Recent Boards</h2>
              <Link 
                href="/tasks" 
                className="flex items-center gap-1 text-sm text-[#5E5CE6] hover:text-[#6E6CF0] transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentBoards.map((board) => (
                <Link
                  key={board.id}
                  href={`/board/${board.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0F] border border-[#2A2A30] hover:border-[#3A3A40] transition-colors group"
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${board.groupColor}20` }}
                  >
                    <Kanban className="w-4 h-4" style={{ color: board.groupColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{board.name}</div>
                    <div className="text-xs text-[#5C5C60]">{board.groupName}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5C5C60] group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Active Agents</h2>
              <Link 
                href="/agents" 
                className="flex items-center gap-1 text-sm text-[#5E5CE6] hover:text-[#6E6CF0] transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {agents.slice(0, 4).map((agent) => (
                <div 
                  key={agent.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#0D0D0F] transition-colors"
                >
                  <Avatar name={agent.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{agent.name}</div>
                    <div className="text-xs text-[#5C5C60]">{agent.model}</div>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Live Feed */}
          <div className="col-span-3 bg-[#17171A] border border-[#2A2A30] rounded-xl overflow-hidden">
            <LiveFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
