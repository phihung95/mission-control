"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Kanban, 
  ListTodo, 
  Bot, 
  Users, 
  Settings,
  Zap
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Overview" },
  { href: "/boards", icon: Kanban, label: "Boards" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/agents", icon: Bot, label: "Models" },
  { href: "/teams", icon: Users, label: "Teams" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#17171A] border-r border-[#2A2A30] flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-[#2A2A30]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#5E5CE6] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">Mission Control</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#5E5CE6] text-white"
                      : "text-[#8A8A8E] hover:text-white hover:bg-[#1A1A1F]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-[#2A2A30]">
        <div className="px-3 py-2 text-xs text-[#5C5C60]">
          <div className="font-medium text-[#8A8A8E] mb-1">Phi Hung&apos;s Lab</div>
          <div>Personal workspace</div>
        </div>
      </div>
    </aside>
  );
}
