"use client";

import { Member, Agent } from "@/lib/types";

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = [
    "#5E5CE6", "#8844FF", "#4488FF", "#22C55E", 
    "#FF8800", "#FF4444", "#00AAAA", "#FF44AA",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, avatar, size = "md", className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  const bgColor = getColorFromName(name);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-medium ${className}`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
