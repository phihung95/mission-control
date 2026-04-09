"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { Send, Bot, ChevronDown, Move } from "lucide-react";

export function BoardChat() {
  const { agents, messages, addMessage, activeBoardId, setActiveBoardId, clearUnread, organization } = useStore();
  const [input, setInput] = useState("");
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const currentBoardId = activeBoardId ?? "default";
  const boardMessages = messages[currentBoardId] ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const leadAgent = agents[0];

  // Drag state
  const [pos, setPos] = useState({ x: window.innerWidth - 320, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // All boards for selector
  const allBoards = organization.boardGroups.flatMap((g) =>
    g.boards.map((b) => ({ id: b.id, name: b.name }))
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [boardMessages]);

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setDragOffset({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragOffset.x;
      const dy = e.clientY - dragOffset.y;
      setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
      setDragOffset({ x: e.clientX, y: e.clientY });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, dragOffset]);

  const currentBoard = allBoards.find((b) => b.id === currentBoardId);

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage(currentBoardId, {
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
      addMessage(currentBoardId, {
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
    <div
      className="fixed z-50 w-80 bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl shadow-2xl flex flex-col"
      style={{ left: pos.x, top: pos.y, height: "calc(100vh - 48px)", maxHeight: "calc(100vh - 48px)" }}
    >
      {/* Header — draggable */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-b border-[#1A1A1F] cursor-move select-none flex-shrink-0"
        onMouseDown={handleDragStart}
      >
        {/* Board selector + agent info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Move className="w-3.5 h-3.5 text-[#3A3A40] flex-shrink-0" />
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowBoardSelector(!showBoardSelector); }}
              className="flex items-center gap-1.5 hover:bg-[#1F1F24] rounded-md px-1.5 py-1 transition-colors"
            >
              <span className="text-xs font-medium text-white max-w-[100px] truncate">
                {currentBoard?.name ?? "Board Chat"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#5C5C60] flex-shrink-0" />
            </button>

            {showBoardSelector && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#17171A] border border-[#1A1A1F] rounded-lg shadow-xl z-10 py-1">
                {allBoards.map((board) => (
                  <button
                    key={board.id}
                    onClick={(e) => { e.stopPropagation(); setActiveBoardId(board.id); setShowBoardSelector(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#1F1F24] transition-colors ${
                      board.id === currentBoardId ? "text-indigo-400" : "text-white"
                    }`}
                  >
                    {board.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Agent status */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pl-2">
          <div className={`w-1.5 h-1.5 rounded-full ${leadAgent?.status === "active" ? "bg-emerald-400" : "bg-[#5C5C60]"}`} />
          <span className="text-[10px] text-[#5C5C60]">{leadAgent?.name ?? "Agent"}</span>
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
              <div className={`text-[10px] mt-1 ${
                msg.senderType === "member" ? "text-indigo-200" : "text-[#5C5C60]"
              }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#1A1A1F] flex-shrink-0">
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
