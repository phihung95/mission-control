export type RunStatus = "success" | "failure" | "running" | "queued";

export interface RunStep {
  name: string;
  duration: number;
  status: "ok" | "error";
  detail?: string;
}

export interface Run {
  id: string;
  name: string;
  status: RunStatus;
  source: string;
  sourceIcon: string;
  startedAt: string;
  duration: number;
  steps: RunStep[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  trigger: string;
  lastRun: string;
  runs: number;
  status: "active" | "paused";
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  status: "active" | "inactive";
  latency: string;
  costPerM: string;
}

export const mockTools: Tool[] = [
  {
    id: "tool-1",
    name: "Gmail Monitor",
    description: "Check Gmail for meeting requests and extract details",
    trigger: "schedule / cron",
    lastRun: "9m ago",
    runs: 2847,
    status: "active",
  },
  {
    id: "tool-2",
    name: "Slack Notifier",
    description: "Send weekly standup notes to #general channel",
    trigger: "webhook",
    lastRun: "15m ago",
    runs: 312,
    status: "active",
  },
  {
    id: "tool-3",
    name: "HN Scraper",
    description: "Scrape Hacker News frontpage and post top stories to #ai",
    trigger: "schedule / cron",
    lastRun: "19m ago",
    runs: 1204,
    status: "active",
  },
  {
    id: "tool-4",
    name: "Tech News Digest",
    description: "Scrape tech news and format into digest for #tools",
    trigger: "schedule / cron",
    lastRun: "1h ago",
    runs: 892,
    status: "active",
  },
  {
    id: "tool-5",
    name: "CRM Sync",
    description: "Sync new leads from web forms to CRM",
    trigger: "webhook",
    lastRun: "3h ago",
    runs: 156,
    status: "paused",
  },
  {
    id: "tool-6",
    name: "Invoice OCR",
    description: "Extract invoice data via OCR and save to spreadsheet",
    trigger: "email",
    lastRun: "5h ago",
    runs: 44,
    status: "active",
  },
];

export const mockRuns: Run[] = [
  {
    id: "run-1",
    name: "Check gmail for meeting requests",
    status: "success",
    source: "webhook",
    sourceIcon: "⚡",
    startedAt: "9m ago",
    duration: 2.1,
    steps: [
      { name: "Build prompt", duration: 21, status: "ok" },
      { name: "Search inbox", duration: 45, status: "ok", detail: "Found 3 new emails" },
      { name: "Parse meeting requests", duration: 12, status: "ok" },
      { name: "Make API request", duration: 412, status: "ok" },
      { name: "Format output", duration: 8, status: "ok" },
      { name: "Save to Notion", duration: 1602, status: "ok" },
    ],
  },
  {
    id: "run-2",
    name: "Send weekly standup notes to #general",
    status: "success",
    source: "webhook",
    sourceIcon: "⚡",
    startedAt: "15m ago",
    duration: 1.8,
    steps: [
      { name: "Aggregate tasks", duration: 34, status: "ok" },
      { name: "Format message", duration: 18, status: "ok" },
      { name: "Post to Slack", duration: 1728, status: "ok" },
    ],
  },
  {
    id: "run-3",
    name: "Scrape tech news and post to #tools",
    status: "success",
    source: "schedule",
    sourceIcon: "⏰",
    startedAt: "19m ago",
    duration: 4.2,
    steps: [
      { name: "Fetch news sources", duration: 892, status: "ok" },
      { name: "Extract headlines", duration: 124, status: "ok" },
      { name: "Rank by relevance", duration: 56, status: "ok" },
      { name: "Format digest", duration: 28, status: "ok" },
      { name: "Post to Slack", duration: 3100, status: "ok" },
    ],
  },
  {
    id: "run-4",
    name: "Scrape HN frontpage and post to #ai",
    status: "success",
    source: "schedule",
    sourceIcon: "⏰",
    startedAt: "28m ago",
    duration: 3.1,
    steps: [
      { name: "Fetch HN API", duration: 312, status: "ok" },
      { name: "Filter AI topics", duration: 89, status: "ok" },
      { name: "Generate summary", duration: 1892, status: "ok" },
      { name: "Post to Slack", duration: 807, status: "ok" },
    ],
  },
  {
    id: "run-5",
    name: "Sync new CRM leads",
    status: "failure",
    source: "webhook",
    sourceIcon: "⚡",
    startedAt: "1h ago",
    duration: 0.8,
    steps: [
      { name: "Receive webhook", duration: 4, status: "ok" },
      { name: "Validate payload", duration: 12, status: "ok" },
      { name: "Authenticate CRM", duration: 764, status: "error", detail: "API key expired" },
    ],
  },
  {
    id: "run-6",
    name: "Process invoice from accounting@...",
    status: "success",
    source: "email",
    sourceIcon: "📧",
    startedAt: "5h ago",
    duration: 6.4,
    steps: [
      { name: "Receive email", duration: 2, status: "ok" },
      { name: "Extract attachment", duration: 18, status: "ok" },
      { name: "Run OCR", duration: 4200, status: "ok" },
      { name: "Parse fields", duration: 89, status: "ok" },
      { name: "Validate data", duration: 34, status: "ok" },
      { name: "Write to spreadsheet", duration: 2057, status: "ok" },
    ],
  },
];

export const mockModels: Model[] = [
  { id: "m1", name: "gemma4:e4b", provider: "Ollama", status: "active", latency: "120ms", costPerM: "Free" },
  { id: "m2", name: "llama4-scout", provider: "OpenRouter", status: "active", latency: "340ms", costPerM: "$0.20" },
  { id: "m3", name: "minimax-m2.7", provider: "OpenRouter", status: "inactive", latency: "210ms", costPerM: "$0.10" },
  { id: "m4", name: "qwen3:30b", provider: "Ollama", status: "active", latency: "280ms", costPerM: "Free" },
];
