"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

const evals = [
  {
    id: "e1",
    name: "Gmail parsing accuracy",
    score: 94.2,
    change: +1.4,
    runs: 1284,
    lastRun: "2h ago",
  },
  {
    id: "e2",
    name: "Slack message format",
    score: 87.6,
    change: -0.8,
    runs: 892,
    lastRun: "4h ago",
  },
  {
    id: "e3",
    name: "HN topic classification",
    score: 91.3,
    change: +2.1,
    runs: 567,
    lastRun: "1h ago",
  },
  {
    id: "e4",
    name: "Invoice OCR extraction",
    score: 78.9,
    change: +5.3,
    runs: 44,
    lastRun: "5h ago",
  },
  {
    id: "e5",
    name: "CRM field mapping",
    score: 82.1,
    change: -1.2,
    runs: 156,
    lastRun: "1d ago",
  },
];

function EvalBar({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-emerald-400"
      : score >= 75
      ? "bg-blue-400"
      : "bg-amber-400";
  return (
    <div className="w-24 h-1.5 bg-[#252529] rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function EvaluationsPage() {
  const avgScore = Math.round(
    evals.reduce((a, e) => a + e.score, 0) / evals.length
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar title="Evaluations" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#17171A] rounded-lg p-4 border border-[#1A1A1F]">
            <div className="text-[10px] text-[#5C5C60] uppercase tracking-wide mb-2">
              Avg Score
            </div>
            <div className="text-2xl font-semibold text-white">{avgScore}%</div>
          </div>
          <div className="bg-[#17171A] rounded-lg p-4 border border-[#1A1A1F]">
            <div className="text-[10px] text-[#5C5C60] uppercase tracking-wide mb-2">
              Evaluations
            </div>
            <div className="text-2xl font-semibold text-white">{evals.length}</div>
          </div>
          <div className="bg-[#17171A] rounded-lg p-4 border border-[#1A1A1F]">
            <div className="text-[10px] text-[#5C5C60] uppercase tracking-wide mb-2">
              Total Runs
            </div>
            <div className="text-2xl font-semibold text-white">
              {evals.reduce((a, e) => a + e.runs, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Eval list */}
        <div className="bg-[#17171A] rounded-lg border border-[#1A1A1F]">
          <div className="flex items-center px-4 py-3 border-b border-[#1A1A1F]">
            <h2 className="text-[13px] font-semibold text-white">
              Evaluation Results
            </h2>
          </div>
          <div className="divide-y divide-[#1A1A1F]">
            {evals.map((eval_) => (
              <div
                key={eval_.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#1F1F24] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white mb-1">
                    {eval_.name}
                  </div>
                  <div className="flex items-center gap-4">
                    <EvalBar score={eval_.score} />
                    <span className="text-[11px] text-[#5C5C60]">
                      {eval_.runs.toLocaleString()} runs
                    </span>
                    <span className="text-[11px] text-[#5C5C60]">
                      <Clock className="w-3 h-3 inline mr-0.5" />
                      {eval_.lastRun}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[14px] font-semibold text-white">
                    {eval_.score}%
                  </div>
                  <div
                    className={`flex items-center justify-end gap-0.5 text-[11px] ${
                      eval_.change >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {eval_.change >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {Math.abs(eval_.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
