"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { NotificationPanel } from "@/components/shared/NotificationPanel";
import { KeyboardShortcutsHelp } from "@/components/shared/KeyboardShortcutsHelp";
import { BoardChat } from "@/components/board/BoardChat";
import { Bot, Search } from "lucide-react";

interface GlobalUIProps {
  children: React.ReactNode;
}

export function GlobalUI({ children }: GlobalUIProps) {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const pathname = usePathname();
  const { unreadCounts, setActiveBoardId } = useStore();

  // Extract boardId from pathname
  const boardIdMatch = pathname.match(/^\/board\/([^/]+)/);
  const currentBoardId = boardIdMatch ? boardIdMatch[1] : null;

  // Calculate total unread messages
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // ⌘K or Ctrl+K - Open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((p) => !p);
      }

      // C - Open command palette focused on "new task"
      if (e.key === "c" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      // B - Go to boards
      if (e.key === "b" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.location.href = "/boards";
      }

      // N - Open notifications
      if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowNotifications((p) => !p);
      }

      // ? - Show shortcuts help
      if (e.key === "?") {
        e.preventDefault();
        setShowShortcutsHelp((p) => !p);
      }

      // Escape - Close all modals
      if (e.key === "Escape") {
        setShowCommandPalette(false);
        setShowNotifications(false);
        setShowShortcutsHelp(false);
        setShowChat(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Update active board when pathname changes
  useEffect(() => {
    if (currentBoardId) {
      setActiveBoardId(currentBoardId);
    }
  }, [currentBoardId, setActiveBoardId]);

  return (
    <>
      {/* Main layout container */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onNotificationClick={() => setShowNotifications(true)}
          onSearchClick={() => setShowCommandPalette(true)}
        />

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {/* Notification Panel */}
      <NotificationPanel
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        open={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      {/* Persistent Chat FAB */}
      {currentBoardId && (
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#5E5CE6] hover:bg-[#6E6CF0] shadow-lg flex items-center justify-center transition-all hover:scale-105"
          style={{ boxShadow: "0 4px 20px rgba(94, 92, 230, 0.4)" }}
        >
          {showChat ? (
            <Bot className="w-6 h-6 text-white" />
          ) : (
            <>
              <Bot className="w-6 h-6 text-white" />
              {totalUnread > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </div>
              )}
            </>
          )}
        </button>
      )}

      {/* Chat Panel (when open) */}
      {showChat && currentBoardId && (
        <BoardChat boardId={currentBoardId} />
      )}

      {/* Chat FAB placeholder when not on a board page - shows search icon */}
      {!currentBoardId && (
        <button
          onClick={() => setShowCommandPalette(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#5E5CE6] hover:bg-[#6E6CF0] shadow-lg flex items-center justify-center transition-all hover:scale-105"
          style={{ boxShadow: "0 4px 20px rgba(94, 92, 230, 0.4)" }}
          title="Open command palette (⌘K)"
        >
          <Search className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
}
