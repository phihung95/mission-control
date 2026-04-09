"use client";

import { useState } from "react";
import { Bell, X, CheckCircle2, Zap, Bot } from "lucide-react";

interface Notification {
  id: string;
  type: "approval" | "info" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "approval",
    title: "Approval Required",
    message: "Reviewer-1 is requesting approval to deploy to production",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    type: "alert",
    title: "Agent Down",
    message: "Researcher-1 has been idle for 30 minutes",
    time: "8m ago",
    read: false,
  },
  {
    id: "n3",
    type: "info",
    title: "Task Completed",
    message: "Build Gmail Monitor tool has been moved to Done",
    time: "15m ago",
    read: true,
  },
  {
    id: "n4",
    type: "approval",
    title: "Budget Alert",
    message: "OpenRouter spend reached 80% of monthly limit",
    time: "1h ago",
    read: true,
  },
];

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));

  if (!open) return null;

  return (
    <div className="fixed top-14 right-6 z-[60] w-80 bg-[#17171A] border border-[#1A1A1F] rounded-xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1F]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">Notifications</span>
          {unread > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-xs text-[#5E5CE6] hover:text-[#6E6CF0]"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#1F1F24] text-[#5C5C60]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 px-4 py-3 border-b border-[#1A1A1F] last:border-0 hover:bg-[#1A1A1F] transition-colors ${
              !n.read ? "bg-[#1A1A1F]/50" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                n.type === "approval"
                  ? "bg-amber-500/20"
                  : n.type === "alert"
                  ? "bg-red-500/20"
                  : "bg-blue-500/20"
              }`}
            >
              {n.type === "approval" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              ) : n.type === "alert" ? (
                <Zap className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-blue-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white">{n.title}</div>
              <div className="text-xs text-[#8A8A8E] mt-0.5 leading-relaxed">
                {n.message}
              </div>
              <div className="text-[10px] text-[#5C5C60] mt-1">{n.time}</div>
            </div>
            {!n.read && (
              <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
