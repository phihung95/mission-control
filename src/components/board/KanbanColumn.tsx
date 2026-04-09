"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Column, Task } from "@/lib/types";
import { KanbanCard } from "./KanbanCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  column: Column;
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

export function KanbanColumn({ column, onTaskClick, onAddTask }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="text-sm font-semibold text-white">{column.name}</h3>
          <span className="text-xs text-[#5C5C60] bg-[#1A1A1F] px-1.5 py-0.5 rounded">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 rounded hover:bg-[#1A1A1F] text-[#5C5C60] hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-lg p-2 transition-colors kanban-column ${
              snapshot.isDraggingOver ? "bg-[#1A1A1F] border-2 border-dashed border-[#5E5CE6]" : "bg-transparent"
            }`}
            style={{ minHeight: "calc(100vh - 220px)" }}
          >
            {column.tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
            
            {column.tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center py-8 text-[#5C5C60] text-sm">
                No tasks yet
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
