"use client";

import { useStore } from "@/lib/store";
import { FeedEventType } from "@/lib/types";
import { Zap, Bot, CheckCircle2, ArrowRight, MessageSquare } from "lucide-react";

function getEventIcon(type: FeedEventType) {
  if (type === "task_moved") return <ArrowRight className="w-3.5 h-3.5 text-blue-400" />;
  if (type === "task_completed") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (type === "agent_msg") return <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />;
  if (type === "agent_status") return <Bot className="w-3.5 h-3.5 text-purple-400" />;
  return <Zap className="w-3.5 h-3.5 text-[#8A8A8E]" />;
}

export function LiveFeed() {
  const events = useStore((s) => s.events);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#1A1A1F]">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Live Feed</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-2.5 py-2 px-2 rounded-md hover:bg-[#17171A] transition-colors">
            <div className="w-6 h-6 rounded-full bg-[#1F1F24] flex items-center justify-center flex-shrink-0 mt-0.5">
              {getEventIcon(event.type)}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-[#C4C4C8] leading-relaxed">
                <span className="font-medium text-white">{event.actor}</span>{" "}
                <span className="text-[#8A8A8E]">{event.message}</span>
              </div>
              <div className="text-[10px] text-[#5C5C60] mt-0.5">{event.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
