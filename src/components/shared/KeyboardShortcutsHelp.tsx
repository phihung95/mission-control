"use client";

import { X } from "lucide-react";

const shortcuts = [
  { key: "⌘K", description: "Open command palette" },
  { key: "C", description: "New task" },
  { key: "B", description: "Go to Boards" },
  { key: "N", description: "Open notifications" },
  { key: "?", description: "Show shortcuts" },
  { key: "Esc", description: "Close modal" },
];

export function KeyboardShortcutsHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-72 bg-[#17171A] border border-[#1A1A1F] rounded-xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Keyboard Shortcuts</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#1F1F24] text-[#5C5C60]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-1">
              <span className="text-xs text-[#8A8A8E]">{s.description}</span>
              <kbd className="px-2 py-0.5 rounded bg-[#1F1F24] text-xs text-white font-mono">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
