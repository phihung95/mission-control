"use client";

import { Plus, Bell } from "lucide-react";

interface TopBarProps {
  title: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, actions }: TopBarProps) {
  return (
    <header className="h-12 border-b border-[#1A1A1F] flex items-center justify-between px-6 bg-[#0D0D0F] sticky top-0 z-10">
      <h1 className="text-[13px] font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-2">
        {actions}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-[12px] font-medium transition-colors">
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
        <button className="p-1.5 rounded-md hover:bg-[#1F1F24] text-[#8A8A8E] hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
