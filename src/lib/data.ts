import { Organization, Member, Agent, BoardGroup, Team, FeedEvent, Task } from "./types";

// Create members
export const seedMembers: Member[] = [
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
export const seedAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Coder-1",
    model: "gemma4:e4b",
    provider: "ollama",
    status: "active",
    role: "coder",
    teamId: "team-coder",
  },
  {
    id: "agent-2",
    name: "Researcher-1",
    model: "llama4-scout",
    provider: "openrouter",
    status: "idle",
    role: "researcher",
    teamId: "team-researcher",
  },
  {
    id: "agent-3",
    name: "Reviewer-1",
    model: "mixtral",
    provider: "openrouter",
    status: "active",
    role: "reviewer",
    teamId: "team-reviewer",
  },
];

// Create teams
const seedTeams: Team[] = [
  {
    id: "team-coder",
    name: "Coder Team",
    leadAgentId: "agent-1",
    agents: ["agent-1"],
    boards: [],
    color: "#3B82F6",
  },
  {
    id: "team-researcher",
    name: "Researcher Team",
    leadAgentId: "agent-2",
    agents: ["agent-2"],
    boards: [],
    color: "#10B981",
  },
  {
    id: "team-reviewer",
    name: "Reviewer Team",
    leadAgentId: "agent-3",
    agents: ["agent-3"],
    boards: [],
    color: "#F59E0B",
  },
];

// Create board groups with teams
export const boardGroups: BoardGroup[] = [
  {
    id: "bg-ops",
    name: "AI Operations",
    identifier: "AI OPS",
    color: "#8B5CF6",
    teams: seedTeams,
    boards: [],
    members: [seedMembers[0], seedMembers[1]],
  },
];

// Create organization
export const seedOrganization: Organization = {
  id: "org-1",
  name: "Phi Hung's Lab",
  slug: "phi-hungs-lab",
  ownerName: "Phi Hung Nguyen",
  boardGroups,
  members: seedMembers,
  createdAt: "2025-03-01T00:00:00Z",
};

// Helper to get all tasks across all boards
export function getAllTasks(org: Organization) {
  const tasks: Task[] = [];
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
  const activeAgents = seedAgents.filter((a) => a.status === "active" || a.status === "busy").length;
  
  return {
    total: allTasks.length,
    inProgress: 0,
    completedThisWeek: 0,
    activeAgents,
  };
}

// Feed Events
export const feedEvents: FeedEvent[] = [
  {
    id: "evt-1",
    type: "task_moved",
    actor: "Coder-1",
    actorType: "agent",
    message: "moved 'Build Gmail Monitor' from Backlog to In Progress",
    timestamp: "3m ago",
  },
  {
    id: "evt-2",
    type: "agent_msg",
    actor: "Researcher-1",
    actorType: "agent",
    message: "Found 3 relevant Hacker News articles for 'AI Tools' board",
    timestamp: "8m ago",
  },
  {
    id: "evt-3",
    type: "task_completed",
    actor: "Coder-1",
    actorType: "agent",
    message: "completed 'Setup CI/CD pipeline'",
    timestamp: "12m ago",
  },
  {
    id: "evt-4",
    type: "approval",
    actor: "Reviewer-1",
    actorType: "agent",
    message: "approved 'Integrate Slack webhook'",
    timestamp: "15m ago",
  },
];
