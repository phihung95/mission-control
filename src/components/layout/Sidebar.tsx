"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  Plug,
  Cpu,
  BarChart3,
  Settings,
  Search,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/runs", label: "Runs", icon: Zap },
  { href: "/tools", label: "Tools", icon: Plug },
  { href: "/models", label: "Models", icon: Cpu },
  { href: "/evaluations", label: "Evaluations", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#0D0D0F] border-r border-[#1A1A1F] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#1A1A1F]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13px] font-semibold text-white tracking-tight">
            Mission Control
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-[#1A1A1F]">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#1A1A1F] text-[#8A8A8E] text-[12px]">
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <span className="ml-auto text-[10px] bg-[#252529] px-1 py-0.5 rounded">⌘K</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors",
                isActive
                  ? "bg-[#1F1F24] text-white"
                  : "text-[#8A8A8E] hover:text-[#C4C4C8] hover:bg-[#17171A]"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Create New */}
      <div className="px-3 py-3 border-t border-[#1A1A1F]">
        <button className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-md bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-[12px] font-medium transition-colors">
          <Plus className="w-3.5 h-3.5" />
          New Tool
        </button>
      </div>
    </aside>
  );
}
