"use client";

import { useState, use } from "react";
import { useStore } from "@/lib/store";
import { TopBar } from "@/components/layout/TopBar";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { TaskModal } from "@/components/board/TaskModal";
import { Task } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id } = use(params);
  const { getBoardById, addTask } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  const board = getBoardById(id);

  if (!board) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Board not found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#8A8A8E] mb-4">The requested board could not be found.</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-[#5E5CE6] hover:text-[#6E6CF0]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: generateId(),
      title: "New task",
      description: "",
      priority: "none",
      status: columnId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0,
    };
    addTask(columnId, newTask);
    setSelectedTask(newTask);
    setAddingToColumn(null);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar 
        title={board.name}
        actions={
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-[#8A8A8E] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        }
      />
      
      <div className="flex-1 overflow-x-auto py-6">
        <KanbanBoard 
          board={board} 
          onTaskClick={setSelectedTask}
          onAddTask={handleAddTask}
        />
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
