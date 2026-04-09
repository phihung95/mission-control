// Team (sub-unit within a board group)
export interface Team {
  id: string;
  name: string; // e.g. "Coder Team"
  leadAgentId: string; // which agent is the lead
  agents: string[]; // agent IDs
  boards: string[]; // board IDs
  color: string;
}

// Organization
export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  boardGroups: BoardGroup[];
  members: Member[];
  createdAt: string;
}

// Board Group (like "team" in Linear)
export interface BoardGroup {
  id: string;
  name: string;
  identifier: string; // e.g. "ENG", "MKT"
  color: string;
  teams: Team[];
  boards: Board[];
  members: Member[];
}

// Board
export interface Board {
  id: string;
  name: string;
  groupId: string;
  columns: Column[];
}

// Column (status lane)
export interface Column {
  id: string;
  name: string;
  color: string;
  position: number;
  tasks: Task[];
}

// Task
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low" | "none";
  status: string; // column id
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  runCount: number;
  lastRunAt?: string;
}

// Agent (AI agent assigned to work)
export interface Agent {
  id: string;
  name: string;
  model: string;
  provider: "ollama" | "openrouter";
  status: "active" | "idle" | "busy";
  role: "coder" | "researcher" | "operator" | "reviewer";
  teamId?: string;
  sessionKey?: string;
}

// Member (user in the organization)
export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "member";
}

// Priority colors
export const priorityColors: Record<Task["priority"], string> = {
  urgent: "#FF4444",
  high: "#FF8800",
  medium: "#FFCC00",
  low: "#4488FF",
  none: "#5C5C60",
};

// Priority labels
export const priorityLabels: Record<Task["priority"], string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "No priority",
};

// Feed Events
export type FeedEventType = "task_moved" | "task_created" | "task_completed" | "agent_msg" | "approval" | "agent_status";

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  actor: string;
  actorType: "agent" | "member";
  message: string;
  timestamp: string;
  boardId?: string;
  taskId?: string;
  avatar?: string;
}

// Chat Messages
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "agent" | "member";
  content: string;
  timestamp: string;
}
