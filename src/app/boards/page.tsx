"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { useStore } from "@/lib/store";
import { Plus, Kanban, Users, Bot, ChevronRight, Folder } from "lucide-react";

export default function BoardsPage() {
  const { organization, addBoard } = useStore();
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const org = organization;

  const handleCreateBoard = () => {
    if (!newBoardName.trim() || !selectedGroupId) return;
    const prefix = `board-${Date.now()}`;
    addBoard({
      id: prefix,
      name: newBoardName.trim(),
      groupId: selectedGroupId,
      columns: [
        { id: `${prefix}-backlog`, name: "Backlog", color: "#5C5C60", position: 0, tasks: [] },
        { id: `${prefix}-inprogress`, name: "In Progress", color: "#3B82F6", position: 1, tasks: [] },
        { id: `${prefix}-inreview`, name: "In Review", color: "#F59E0B", position: 2, tasks: [] },
        { id: `${prefix}-done`, name: "Done", color: "#22C55E", position: 3, tasks: [] },
      ],
    });
    setNewBoardName("");
    setSelectedGroupId("");
    setShowNewBoard(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        title="Boards"
        actions={
          <button
            onClick={() => setShowNewBoard(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Board
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {org.boardGroups.map((group) => (
          <div key={group.id}>
            {/* Group header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8A8E]">
                {group.identifier}
              </span>
              <span className="text-sm font-semibold text-white">{group.name}</span>
              <span className="text-xs text-[#5C5C60]">· {group.boards.length} boards</span>
            </div>

            {/* Boards grid */}
            <div className="grid grid-cols-3 gap-3">
              {group.boards.map((board) => {
                const totalTasks = board.columns.reduce((sum, col) => sum + col.tasks.length, 0);
                const doneTasks = board.columns.find((c) => c.name === "Done")?.tasks.length ?? 0;
                const inProgressTasks = board.columns.find((c) => c.name === "In Progress")?.tasks.length ?? 0;

                return (
                  <Link
                    key={board.id}
                    href={`/board/${board.id}`}
                    className="group bg-[#17171A] border border-[#1A1A1F] rounded-lg p-4 hover:border-[#2A2A30] transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 rounded-md bg-[#1F1F24] flex items-center justify-center">
                        <Kanban className="w-4 h-4 text-[#5E5CE6]" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#3A3A40] group-hover:text-[#8A8A8E] transition-colors" />
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{board.name}</div>
                    <div className="flex items-center gap-3 text-xs text-[#5C5C60]">
                      <span>{totalTasks} tasks</span>
                      <span className="text-blue-400">{inProgressTasks} in progress</span>
                      <span className="text-emerald-400">{doneTasks} done</span>
                    </div>

                    {/* Mini column progress */}
                    <div className="mt-3 flex gap-1">
                      {board.columns.map((col) => (
                        <div
                          key={col.id}
                          className="h-1 flex-1 rounded-full"
                          style={{
                            backgroundColor: col.tasks.length > 0 ? col.color : "#1F1F24",
                            opacity: col.tasks.length > 0 ? 0.6 : 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* New board modal */}
        {showNewBoard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowNewBoard(false)}
            />
            <div className="relative w-96 bg-[#17171A] border border-[#1A1A1F] rounded-xl shadow-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Create New Board</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#8A8A8E] mb-1">Board Name</label>
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="e.g. Sprint 25"
                    className="w-full bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-2 text-sm text-white placeholder-[#5C5C60] outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8A8A8E] mb-1">Team</label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="">Select a team...</option>
                    {org.boardGroups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name} ({g.identifier})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowNewBoard(false)}
                  className="px-3 py-1.5 text-xs text-[#8A8A8E] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBoard}
                  disabled={!newBoardName.trim() || !selectedGroupId}
                  className="px-4 py-1.5 rounded-md bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-xs font-medium transition-colors disabled:opacity-40"
                >
                  Create Board
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
