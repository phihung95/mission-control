"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Search, Kanban, Bot, ListTodo, X, ArrowRight } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { organization, agents } = useStore();

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build results
  const allTasks: { id: string; title: string; type: "task"; path: string }[] = [];
  organization.boardGroups.forEach((group) => {
    group.boards.forEach((board) => {
      board.columns.forEach((col) => {
        col.tasks.forEach((task) => {
          allTasks.push({
            id: task.id,
            title: task.title,
            type: "task",
            path: `/board/${board.id}`,
          });
        });
      });
    });
  });

  const allBoards = organization.boardGroups.flatMap((g) =>
    g.boards.map((b) => ({
      id: b.id,
      title: b.name,
      type: "board" as const,
      group: g.name,
      path: `/board/${b.id}`,
    }))
  );

  const allAgents = agents.map((a) => ({
    id: a.id,
    title: a.name,
    type: "agent" as const,
    model: a.model,
    path: "/agents",
  }));

  const results = [
    ...allBoards.filter((b) =>
      b.title.toLowerCase().includes(query.toLowerCase())
    ),
    ...allTasks
      .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map((t) => ({ ...t, icon: ListTodo, subtitle: "Task" })),
    ...allAgents.filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase())
    ),
  ]
    .filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[selectedIndex]) {
      router.push(results[selectedIndex].path);
      onClose();
    }
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#17171A] border border-[#2A2A30] rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1A1A1F]">
          <Search className="w-4 h-4 text-[#5C5C60]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, boards, agents..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#5C5C60] outline-none"
          />
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-[#1F1F24] text-[10px] text-[#5C5C60]">esc</kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 && (
            <div className="text-center py-6 text-sm text-[#5C5C60]">
              No results for &quot;{query}&quot;
            </div>
          )}
          {results.map((result, i) => {
            const Icon = "icon" in result ? result.icon : result.type === "board" ? Kanban : Bot;
            const subtitle = "subtitle" in result ? result.subtitle : result.type === "board" ? (result as any).group : (result as any).model;
            
            return (
              <button
                key={result.id}
                onClick={() => {
                  router.push(result.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  i === selectedIndex ? "bg-[#1F1F24]" : "hover:bg-[#17171A]"
                }`}
              >
                <Icon className="w-4 h-4 text-[#5C5C60] flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="text-sm text-white">{result.title}</div>
                  <div className="text-xs text-[#5C5C60]">{subtitle}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#3A3A40]" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[#1A1A1F] text-[10px] text-[#5C5C60]">
          <span><kbd className="px-1 bg-[#1F1F24] rounded">↑↓</kbd> navigate</span>
          <span><kbd className="px-1 bg-[#1F1F24] rounded">↵</kbd> open</span>
          <span><kbd className="px-1 bg-[#1F1F24] rounded">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
