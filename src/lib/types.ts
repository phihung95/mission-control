// Organization
export interface Organization {
  id: string;
  name: string;
  slug: string;
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
  boards: Board[];
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
}

// Member
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
