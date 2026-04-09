"use client";

import { useState, useEffect } from "react";
import { Task, priorityColors, priorityLabels } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/shared/Avatar";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDateTime } from "@/lib/utils";
import { X, Calendar, User, Tag, Clock, Play, ExternalLink } from "lucide-react";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  const { organization, agents, members, updateTask } = useStore();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSave = () => {
    updateTask(task.id, {
      title,
      description,
      priority,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  // Get all columns for status change
  const allColumns: { id: string; name: string; color: string }[] = [];
  organization.boardGroups.forEach((group) => {
    group.boards.forEach((board) => {
      board.columns.forEach((col) => {
        allColumns.push({ id: col.id, name: col.name, color: col.color });
      });
    });
  });

  const currentColumn = allColumns.find((c) => c.id === task.status);
  const allAssignees = [...members, ...agents];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#17171A] border border-[#2A2A30] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A30]">
          <div className="flex items-center gap-3">
            <PriorityBadge priority={priority} size="md" />
            {currentColumn && (
              <span 
                className="text-xs px-2 py-1 rounded font-medium"
                style={{ backgroundColor: `${currentColumn.color}20`, color: currentColumn.color }}
              >
                {currentColumn.name}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1A1A1F] text-[#8A8A8E] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-semibold bg-transparent border-none text-white placeholder-[#5C5C60] focus:outline-none mb-4"
            placeholder="Task title"
          />

          {/* Description */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-[#8A8A8E] mb-2">
              <Tag className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0D0D0F] border border-[#2A2A30] rounded-lg p-3 text-sm text-white placeholder-[#5C5C60] focus:border-[#5E5CE6] resize-none"
              rows={4}
              placeholder="Add a description..."
            />
          </div>

          {/* Meta fields grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Priority */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#8A8A8E] mb-2">
                <Tag className="w-4 h-4" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="w-full bg-[#0D0D0F] border border-[#2A2A30] rounded-lg p-2.5 text-sm"
              >
                {(Object.keys(priorityLabels) as Task["priority"][]).map((p) => (
                  <option key={p} value={p}>
                    {priorityLabels[p]}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#8A8A8E] mb-2">
                <Clock className="w-4 h-4" />
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value })}
                className="w-full bg-[#0D0D0F] border border-[#2A2A30] rounded-lg p-2.5 text-sm"
              >
                {allColumns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#8A8A8E] mb-2">
                <User className="w-4 h-4" />
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-[#0D0D0F] border border-[#2A2A30] rounded-lg p-2.5 text-sm"
              >
                <option value="">Unassigned</option>
                {allAssignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#8A8A8E] mb-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0D0D0F] border border-[#2A2A30] rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>

          {/* Run stats */}
          {task.runCount > 0 && (
            <div className="bg-[#0D0D0F] rounded-lg p-4 mb-6">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-2xl font-semibold text-white">{task.runCount}</div>
                  <div className="text-xs text-[#8A8A8E]">Total runs</div>
                </div>
                {task.lastRunAt && (
                  <div>
                    <div className="text-sm text-white">{formatDateTime(task.lastRunAt)}</div>
                    <div className="text-xs text-[#8A8A8E]">Last run</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity log */}
          <div className="border-t border-[#2A2A30] pt-4">
            <h4 className="text-sm font-medium text-[#8A8A8E] mb-3">Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span className="text-[#8A8A8E]">Created</span>
                <span className="text-white">{formatDateTime(task.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-[#4488FF]" />
                <span className="text-[#8A8A8E]">Updated</span>
                <span className="text-white">{formatDateTime(task.updatedAt)}</span>
              </div>
              {currentColumn && (
                <div className="flex items-center gap-3 text-sm">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: currentColumn.color }}
                  />
                  <span className="text-[#8A8A8E]">Status</span>
                  <span className="text-white">{currentColumn.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#2A2A30] bg-[#0D0D0F]">
          <div className="text-xs text-[#5C5C60]">
            Created {formatDateTime(task.createdAt)}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#8A8A8E] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white rounded-lg transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
