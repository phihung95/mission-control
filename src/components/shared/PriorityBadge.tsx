"use client";

import { Task, priorityColors, priorityLabels } from "@/lib/types";

interface PriorityBadgeProps {
  priority: Task["priority"];
  size?: "sm" | "md";
}

export function PriorityBadge({ priority, size = "sm" }: PriorityBadgeProps) {
  const color = priorityColors[priority];
  const label = priorityLabels[priority];
  
  if (priority === "none") {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-medium ${
        size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1"
      }`}
      style={{ 
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      <span 
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
