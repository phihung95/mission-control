"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { ChatMessage } from "@/lib/types";
import { Send, Bot, ChevronDown, X } from "lucide-react";

interface BoardChatProps {
  boardId: string;
}

export function BoardChat({ boardId }: BoardChatProps) {
  const { agents, messages, addMessage, activeBoardId, setActiveBoardId, clearUnread, organization } = useStore();
  const [input, setInput] = useState("");
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const boardMessages = messages[boardId] ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const leadAgent = agents[0];

  // Get all boards for selector
  const allBoards = organization.boardGroups.flatMap((g) =>
    g.boards.map((b) => ({ id: b.id, name: b.name }))
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [boardMessages]);

  useEffect(() => {
    if (boardId !== activeBoardId) {
      setActiveBoardId(boardId);
    }
    clearUnread(boardId);
  }, [boardId, activeBoardId, setActiveBoardId, clearUnread]);

  const currentBoard = allBoards.find((b) => b.id === boardId);

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage(boardId, {
      id: `msg-${Date.now()}`,
      senderId: "member-1",
      senderName: "Phi Hung",
      senderType: "member",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    setInput("");

    // Simulate agent reply
    setTimeout(() => {
      addMessage(boardId, {
        id: `msg-${Date.now()}`,
        senderId: leadAgent?.id ?? "agent-1",
        senderName: leadAgent?.name ?? "Coder-1",
        senderType: "agent",
        content: "Got it! I'm on it. I'll analyze the task and report back shortly with my findings.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }, 1500);
  };

  return (
    <div className="w-80 bg-[#0D0D0F] border-l border-[#1A1A1F] flex flex-col h-full">
      {/* Header with board selector */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1F]">
        <div className="relative">
          <button
            onClick={() => setShowBoardSelector(!showBoardSelector)}
            className="flex items-center gap-2 hover:bg-[#1F1F24] rounded-md px-2 py-1 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xs font-medium text-white max-w-[140px] truncate">
              {currentBoard?.name ?? "Board Chat"}
            </div>
            <ChevronDown className="w-3 h-3 text-[#5C5C60]" />
          </button>

          {/* Board selector dropdown */}
          {showBoardSelector && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-[#17171A] border border-[#1A1A1F] rounded-lg shadow-xl z-10 py-1">
              {allBoards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => {
                    setActiveBoardId(board.id);
                    setShowBoardSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-[#1F1F24] transition-colors ${
                    board.id === boardId ? "text-indigo-400" : "text-white"
                  }`}
                >
                  {board.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="text-[10px] text-[#5C5C60]">
            {leadAgent?.status ?? "idle"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {boardMessages.length === 0 && (
          <div className="text-center text-xs text-[#5C5C60] mt-8">
            Ask the lead agent anything about this board.
          </div>
        )}
        {boardMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderType === "member" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                msg.senderType === "member"
                  ? "bg-indigo-500 text-white"
                  : "bg-[#1F1F24] text-[#C4C4C8]"
              }`}
            >
              <div className="font-medium text-[10px] mb-1 opacity-70">
                {msg.senderName}
              </div>
              {msg.content}
              <div
                className={`text-[10px] mt-1 ${
                  msg.senderType === "member" ? "text-indigo-200" : "text-[#5C5C60]"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#1A1A1F]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message the lead agent..."
            className="flex-1 bg-[#17171A] border border-[#1A1A1F] rounded-md px-3 py-2 text-xs text-white placeholder-[#5C5C60] outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
