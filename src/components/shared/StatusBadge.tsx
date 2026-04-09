"use client";

interface StatusBadgeProps {
  status: "active" | "idle" | "busy" | "paused";
  size?: "sm" | "md";
}

const statusConfig = {
  active: { color: "#22C55E", label: "Active" },
  idle: { color: "#8A8A8E", label: "Idle" },
  busy: { color: "#FF8800", label: "Busy" },
  paused: { color: "#5C5C60", label: "Paused" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
      }`}
      style={{ 
        backgroundColor: `${config.color}20`,
        color: config.color,
      }}
    >
      <span 
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
