"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Board, Task } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { useStore } from "@/lib/store";

interface KanbanBoardProps {
  board: Board;
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

export function KanbanBoard({ board, onTaskClick, onAddTask }: KanbanBoardProps) {
  const { moveTask } = useStore();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    moveTask(draggableId, source.droppableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 px-6">
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
  );
}
