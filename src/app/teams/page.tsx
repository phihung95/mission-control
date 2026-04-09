"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar } from "@/components/shared/Avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChevronDown, ChevronRight, Users, Bot, Kanban } from "lucide-react";

export default function TeamsPage() {
  const { organization, agents } = useStore();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar 
        title="Teams" 
        subtitle={`${organization.boardGroups.length} teams`}
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {organization.boardGroups.map((group) => {
            const isExpanded = expandedGroup === group.id;
            const groupAgents = agents.filter((a) => a.teamId === group.id);
            
            // Count members who have tasks in this group's boards
            const memberIdsWithTasks = new Set<string>();
            group.boards.forEach((board) => {
              board.columns.forEach((col) => {
                col.tasks.forEach((task) => {
                  if (task.assigneeId && task.assigneeId.startsWith('member-')) {
                    memberIdsWithTasks.add(task.assigneeId);
                  }
                });
              });
            });
            
            // Count total tasks
            let taskCount = 0;
            group.boards.forEach((board) => {
              board.columns.forEach((col) => {
                taskCount += col.tasks.length;
              });
            });

            return (
              <div 
                key={group.id}
                className="bg-[#17171A] border border-[#2A2A30] rounded-xl overflow-hidden"
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-[#1A1A1F] transition-colors"
                >
                  <div className="text-[#5C5C60]">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    <Users className="w-5 h-5" style={{ color: group.color }} />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-white">{group.name}</h3>
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: `${group.color}20`, color: group.color }}
                    >
                      {group.identifier}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-white font-medium">{memberIdsWithTasks.size || organization.members.length}</div>
                      <div className="text-[#5C5C60] text-xs">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">{groupAgents.length}</div>
                      <div className="text-[#5C5C60] text-xs">Agents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">{group.boards.length}</div>
                      <div className="text-[#5C5C60] text-xs">Boards</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">{taskCount}</div>
                      <div className="text-[#5C5C60] text-xs">Tasks</div>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-[#2A2A30] p-5 bg-[#0D0D0F]">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Members */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-medium text-[#8A8A8E] mb-3">
                          <Users className="w-4 h-4" />
                          Members
                        </h4>
                        <div className="space-y-2">
                          {organization.members.map((member) => (
                            <div 
                              key={member.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#17171A]"
                            >
                              <Avatar name={member.name} avatar={member.avatar} size="sm" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">
                                  {member.name}
                                </div>
                                <div className="text-xs text-[#5C5C60] capitalize">
                                  {member.role}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Agents */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-medium text-[#8A8A8E] mb-3">
                          <Bot className="w-4 h-4" />
                          Agents
                        </h4>
                        <div className="space-y-2">
                          {groupAgents.length === 0 ? (
                            <p className="text-sm text-[#5C5C60]">No agents assigned</p>
                          ) : (
                            groupAgents.map((agent) => (
                              <div 
                                key={agent.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#17171A]"
                              >
                                <Avatar name={agent.name} size="sm" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-white truncate">
                                    {agent.name}
                                  </div>
                                  <div className="text-xs text-[#5C5C60]">
                                    {agent.model}
                                  </div>
                                </div>
                                <StatusBadge status={agent.status} />
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Boards */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-medium text-[#8A8A8E] mb-3">
                          <Kanban className="w-4 h-4" />
                          Boards
                        </h4>
                        <div className="space-y-2">
                          {group.boards.map((board) => (
                            <a
                              key={board.id}
                              href={`/board/${board.id}`}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#17171A] transition-colors"
                            >
                              <Kanban className="w-4 h-4 text-[#5C5C60]" />
                              <span className="text-sm text-white">{board.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
