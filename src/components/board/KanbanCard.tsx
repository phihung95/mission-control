"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/lib/types";
import { Avatar } from "@/components/shared/Avatar";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate, getRelativeTime } from "@/lib/utils";
import { Calendar, Play, GripVertical } from "lucide-react";
import { useStore } from "@/lib/store";

interface KanbanCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

export function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  const { getMemberById, getAgentById } = useStore();
  
  const assignee = task.assigneeId 
    ? (getMemberById(task.assigneeId) || getAgentById(task.assigneeId))
    : undefined;
  const assigneeAvatar = assignee && 'avatar' in assignee ? assignee.avatar : undefined;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-[#17171A] border border-[#2A2A30] rounded-lg p-3 cursor-pointer transition-all hover:border-[#3A3A40] ${
            snapshot.isDragging ? "shadow-lg rotate-2" : ""
          }`}
          onClick={onClick}
        >
          <div className="flex items-start gap-2">
            <div {...provided.dragHandleProps} className="mt-0.5 text-[#5C5C60] hover:text-[#8A8A8E]">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white mb-2 leading-snug">
                {task.title}
              </h4>
              
              <div className="flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={task.priority} />
                
                {task.dueDate && (
                  <span className="flex items-center gap-1 text-xs text-[#8A8A8E]">
                    <Calendar className="w-3 h-3" />
                    {formatDate(task.dueDate)}
                  </span>
                )}
                
                {task.runCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-[#8A8A8E]">
                    <Play className="w-3 h-3" />
                    {task.runCount}
                    {task.lastRunAt && ` · ${getRelativeTime(task.lastRunAt)}`}
                  </span>
                )}
              </div>
            </div>
            
            {assignee && (
              <Avatar 
                name={assignee.name} 
                avatar={assigneeAvatar}
                size="sm"
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
