import { Organization, Member, Agent, BoardGroup } from "./types";

// Create members
export const members: Member[] = [
  {
    id: "member-1",
    name: "Phi Hung",
    email: "phihung@example.com",
    avatar: undefined,
    role: "owner",
  },
  {
    id: "member-2",
    name: "Jarvis",
    email: "jarvis@ai.com",
    avatar: undefined,
    role: "admin",
  },
];

// Create agents
export const agents: Agent[] = [
  {
    id: "agent-1",
    name: "Coder-1",
    model: "gemma4:e4b",
    provider: "ollama",
    status: "active",
    role: "coder",
    teamId: "group-1",
  },
  {
    id: "agent-2",
    name: "Researcher-1",
    model: "llama4-scout",
    provider: "openrouter",
    status: "idle",
    role: "researcher",
    teamId: "group-2",
  },
  {
    id: "agent-3",
    name: "Operator-1",
    model: "qwen3:30b",
    provider: "ollama",
    status: "busy",
    role: "operator",
    teamId: "group-2",
  },
  {
    id: "agent-4",
    name: "Reviewer-1",
    model: "mixtral",
    provider: "openrouter",
    status: "active",
    role: "reviewer",
    teamId: "group-1",
  },
];

// Create board groups
export const boardGroups: BoardGroup[] = [
  {
    id: "group-1",
    name: "Engineering",
    identifier: "ENG",
    color: "#4488FF",
    boards: [
      {
        id: "board-1",
        name: "Sprint 24",
        groupId: "group-1",
        columns: [
          {
            id: "col-1",
            name: "Backlog",
            color: "#5C5C60",
            position: 0,
            tasks: [
              {
                id: "task-1",
                title: "Build Gmail Monitor tool",
                description: "Create an automated tool to check Gmail for meeting requests and extract details",
                priority: "high",
                status: "col-1",
                assigneeId: "agent-1",
                dueDate: "2025-04-15",
                createdAt: "2025-04-01T10:00:00Z",
                updatedAt: "2025-04-08T14:30:00Z",
                runCount: 0,
              },
              {
                id: "task-2",
                title: "Set up CI/CD pipeline",
                description: "Configure GitHub Actions for automated testing and deployment",
                priority: "medium",
                status: "col-1",
                assigneeId: "member-1",
                dueDate: "2025-04-20",
                createdAt: "2025-04-02T09:00:00Z",
                updatedAt: "2025-04-02T09:00:00Z",
                runCount: 0,
              },
            ],
          },
          {
            id: "col-2",
            name: "In Progress",
            color: "#4488FF",
            position: 1,
            tasks: [
              {
                id: "task-3",
                title: "Integrate Slack webhook",
                description: "Add Slack webhook integration for notifications and alerts",
                priority: "urgent",
                status: "col-2",
                assigneeId: "agent-3",
                dueDate: "2025-04-10",
                createdAt: "2025-04-03T11:00:00Z",
                updatedAt: "2025-04-08T16:00:00Z",
                runCount: 12,
                lastRunAt: "2025-04-08T16:00:00Z",
              },
            ],
          },
          {
            id: "col-3",
            name: "In Review",
            color: "#FFCC00",
            position: 2,
            tasks: [
              {
                id: "task-4",
                title: "Design system documentation",
                description: "Document the component library and design tokens",
                priority: "low",
                status: "col-3",
                assigneeId: "agent-4",
                dueDate: "2025-04-12",
                createdAt: "2025-04-04T14:00:00Z",
                updatedAt: "2025-04-08T10:00:00Z",
                runCount: 3,
                lastRunAt: "2025-04-08T10:00:00Z",
              },
            ],
          },
          {
            id: "col-4",
            name: "Done",
            color: "#22C55E",
            position: 3,
            tasks: [
              {
                id: "task-5",
                title: "Project kickoff meeting",
                description: "Initial project setup and team alignment",
                priority: "none",
                status: "col-4",
                assigneeId: "member-1",
                createdAt: "2025-03-28T09:00:00Z",
                updatedAt: "2025-04-01T17:00:00Z",
                runCount: 0,
              },
              {
                id: "task-6",
                title: "Tech stack selection",
                description: "Evaluate and select Next.js, TypeScript, and core libraries",
                priority: "none",
                status: "col-4",
                assigneeId: "member-2",
                createdAt: "2025-03-29T10:00:00Z",
                updatedAt: "2025-04-02T12:00:00Z",
                runCount: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "group-2",
    name: "AI Ops",
    identifier: "OPS",
    color: "#8844FF",
    boards: [
      {
        id: "board-2",
        name: "Agent Tasks",
        groupId: "group-2",
        columns: [
          {
            id: "col-5",
            name: "Backlog",
            color: "#5C5C60",
            position: 0,
            tasks: [],
          },
          {
            id: "col-6",
            name: "In Progress",
            color: "#4488FF",
            position: 1,
            tasks: [],
          },
          {
            id: "col-7",
            name: "In Review",
            color: "#FFCC00",
            position: 2,
            tasks: [],
          },
          {
            id: "col-8",
            name: "Done",
            color: "#22C55E",
            position: 3,
            tasks: [],
          },
        ],
      },
    ],
  },
];

// Create organization
export const seedOrganization: Organization = {
  id: "org-1",
  name: "Phi Hung's Lab",
  slug: "phi-hungs-lab",
  boardGroups,
  members,
  createdAt: "2025-03-01T00:00:00Z",
};

// Helper to get all tasks across all boards
export function getAllTasks(org: Organization) {
  const tasks: import("./types").Task[] = [];
  org.boardGroups.forEach((group) => {
    group.boards.forEach((board) => {
      board.columns.forEach((col) => {
        tasks.push(...col.tasks);
      });
    });
  });
  return tasks;
}

// Helper to get task count by status
export function getTaskStats(org: Organization) {
  const allTasks = getAllTasks(org);
  const inProgress = allTasks.filter((t) => t.status.includes("col-2") || t.status.includes("col-6")).length;
  const done = allTasks.filter((t) => t.status.includes("col-4") || t.status.includes("col-8")).length;
  
  // Calculate completed this week (tasks updated in last 7 days that are in done columns)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const completedThisWeek = allTasks.filter((t) => {
    const updated = new Date(t.updatedAt);
    return (t.status.includes("col-4") || t.status.includes("col-8")) && updated >= oneWeekAgo;
  }).length;

  return {
    total: allTasks.length,
    inProgress,
    completedThisWeek,
    activeAgents: agents.filter((a) => a.status === "active" || a.status === "busy").length,
  };
}
