"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { TopBar } from "@/components/layout/TopBar";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { Avatar } from "@/components/shared/Avatar";
import { TaskModal } from "@/components/board/TaskModal";
import { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Search, Filter, ListTodo } from "lucide-react";

export default function TasksPage() {
  const { organization, agents, members } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [priorityFilter, setPriorityFilter] = useState<Task["priority"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get all tasks
  const allTasks: (Task & { columnName: string; boardName: string })[] = [];
  organization.boardGroups.forEach((group) => {
    group.boards.forEach((board) => {
      board.columns.forEach((col) => {
        col.tasks.forEach((task) => {
          allTasks.push({
            ...task,
            columnName: col.name,
            boardName: board.name,
          });
        });
      });
    });
  });

  // Filter tasks
  const filteredTasks = allTasks.filter((task) => {
    if (filter === "active" && (task.status.includes("col-4") || task.status.includes("col-8"))) return false;
    if (filter === "done" && !task.status.includes("col-4") && !task.status.includes("col-8")) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const allAssignees = [...members, ...agents];

  return (
    <div className="flex flex-col h-full">
      <TopBar 
        title="Tasks" 
        subtitle={`${filteredTasks.length} tasks`}
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C60]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#17171A] border border-[#2A2A30] rounded-lg text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "active" | "done")}
            className="bg-[#17171A] border border-[#2A2A30] rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="done">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Task["priority"] | "all")}
            className="bg-[#17171A] border border-[#2A2A30] rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">No priority</option>
          </select>
        </div>

        {/* Tasks Table */}
        <div className="bg-[#17171A] border border-[#2A2A30] rounded-xl overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ListTodo className="w-12 h-12 text-[#3A3A40] mb-4" />
              <p className="text-[#8A8A8E]">No tasks found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A30]">
                  <th className="text-left text-xs font-medium text-[#8A8A8E] uppercase tracking-wider px-4 py-3">
                    Task
                  </th>
                  <th className="text-left text-xs font-medium text-[#8A8A8E] uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-[#8A8A8E] uppercase tracking-wider px-4 py-3">
                    Priority
                  </th>
                  <th className="text-left text-xs font-medium text-[#8A8A8E] uppercase tracking-wider px-4 py-3">
                    Assignee
                  </th>
                  <th className="text-left text-xs font-medium text-[#8A8A8E] uppercase tracking-wider px-4 py-3">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const assignee = task.assigneeId 
                    ? allAssignees.find((a) => a.id === task.assigneeId)
                    : null;
                  const assigneeAvatar = assignee && 'avatar' in assignee ? assignee.avatar : undefined;
                  
                  return (
                    <tr 
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="border-b border-[#1A1A1F] last:border-0 hover:bg-[#1A1A1F] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{task.title}</div>
                          <div className="text-xs text-[#5C5C60]">{task.boardName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#8A8A8E]">{task.columnName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-4">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={assignee.name} avatar={assigneeAvatar} size="sm" />
                            <span className="text-sm text-[#8A8A8E]">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-[#5C5C60]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {task.dueDate ? (
                          <span className="text-sm text-[#8A8A8E]">{formatDate(task.dueDate)}</span>
                        ) : (
                          <span className="text-sm text-[#5C5C60]">No date</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
}
