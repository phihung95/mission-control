"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Board, Task } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { useStore } from "@/lib/store";
import { LiveFeed } from "@/components/shared/LiveFeed";
import { BoardChat } from "./BoardChat";
import { MessageSquare, Rss } from "lucide-react";

interface KanbanBoardProps {
  board: Board;
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

export function KanbanBoard({ board, onTaskClick, onAddTask }: KanbanBoardProps) {
  const { moveTask } = useStore();
  const [showFeed, setShowFeed] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    moveTask(draggableId, source.droppableId, destination.droppableId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Board header with toggle buttons */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1A1A1F]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFeed(!showFeed)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              showFeed
                ? "bg-[#5E5CE6] text-white"
                : "bg-[#1F1F24] text-[#8A8A8E] hover:text-white"
            }`}
          >
            <Rss className="w-3.5 h-3.5" />
            Live Feed
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              showChat
                ? "bg-[#5E5CE6] text-white"
                : "bg-[#1F1F24] text-[#8A8A8E] hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Live Feed panel - left side */}
        {showFeed && (
          <div className="w-72 border-r border-[#1A1A1F] bg-[#0D0D0F]">
            <LiveFeed />
          </div>
        )}

        {/* Kanban columns */}
        <div className="flex-1 overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 px-6 py-4">
              {board.columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  onTaskClick={onTaskClick}
                  onAddTask={onAddTask}
                />
              ))}
            </div>
          </DragDropContext>
        </div>

        {/* Chat panel - right side */}
        {showChat && (
          <BoardChat boardId={board.id} onClose={() => setShowChat(false)} />
        )}
      </div>
    </div>
  );
}
