import { create } from "zustand";
import { Organization, Task, Agent, Member, BoardGroup, Board, FeedEvent, ChatMessage } from "./types";
import { seedOrganization, agents as seedAgents, members as seedMembers, feedEvents } from "./data";

interface AppState {
  organization: Organization;
  agents: Agent[];
  members: Member[];
  events: FeedEvent[];
  messages: Record<string, ChatMessage[]>;
  
  // Active board for chat
  activeBoardId: string | null;
  setActiveBoardId: (id: string | null) => void;
  
  // Unread message counts per board
  unreadCounts: Record<string, number>;
  incrementUnread: (boardId: string) => void;
  clearUnread: (boardId: string) => void;
  
  // Task actions
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (columnId: string, task: Task) => void;

  // Agent actions
  addAgent: (agent: Agent) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  toggleAgentStatus: (agentId: string) => void;

  // Board actions
  addBoard: (board: Board) => void;

  // Organization actions
  updateOrganizationName: (name: string) => void;
  addMember: (member: Member) => void;
  removeMember: (memberId: string) => void;

  // Feed actions
  addEvent: (event: FeedEvent) => void;

  // Chat actions
  addMessage: (boardId: string, message: ChatMessage) => void;

  // Helpers
  getTaskById: (taskId: string) => Task | undefined;
  getMemberById: (memberId: string) => Member | undefined;
  getAgentById: (agentId: string) => Agent | undefined;
  getBoardById: (boardId: string) => Board | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  organization: seedOrganization,
  agents: seedAgents,
  members: seedMembers,
  events: feedEvents,
  messages: {},
  
  activeBoardId: null,
  setActiveBoardId: (id) => set({ activeBoardId: id }),
  
  unreadCounts: {},
  incrementUnread: (boardId) => set((state) => ({
    unreadCounts: {
      ...state.unreadCounts,
      [boardId]: (state.unreadCounts[boardId] ?? 0) + 1,
    },
  })),
  clearUnread: (boardId) => set((state) => ({
    unreadCounts: {
      ...state.unreadCounts,
      [boardId]: 0,
    },
  })),

  moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => {
    set((state) => {
      const newOrg = JSON.parse(JSON.stringify(state.organization)) as Organization;
      
      // Find and remove task from source column
      let movedTask: Task | undefined;
      for (const group of newOrg.boardGroups) {
        for (const board of group.boards) {
          const col = board.columns.find((c) => c.id === fromColumnId);
          if (col) {
            const taskIndex = col.tasks.findIndex((t) => t.id === taskId);
            if (taskIndex !== -1) {
              movedTask = col.tasks.splice(taskIndex, 1)[0];
              break;
            }
          }
        }
        if (movedTask) break;
      }
      
      // Add task to target column
      if (movedTask) {
        movedTask.status = toColumnId;
        movedTask.updatedAt = new Date().toISOString();
        
        for (const group of newOrg.boardGroups) {
          for (const board of group.boards) {
            const col = board.columns.find((c) => c.id === toColumnId);
            if (col) {
              col.tasks.push(movedTask!);
              break;
            }
          }
        }
      }
      
      return { organization: newOrg };
    });
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    set((state) => {
      const newOrg = JSON.parse(JSON.stringify(state.organization)) as Organization;
      
      for (const group of newOrg.boardGroups) {
        for (const board of group.boards) {
          for (const col of board.columns) {
            const task = col.tasks.find((t) => t.id === taskId);
            if (task) {
              Object.assign(task, updates, { updatedAt: new Date().toISOString() });
              break;
            }
          }
        }
      }
      
      return { organization: newOrg };
    });
  },

  addTask: (columnId: string, task: Task) => {
    set((state) => {
      const newOrg = JSON.parse(JSON.stringify(state.organization)) as Organization;
      
      for (const group of newOrg.boardGroups) {
        for (const board of group.boards) {
          const col = board.columns.find((c) => c.id === columnId);
          if (col) {
            col.tasks.push(task);
            break;
          }
        }
      }
      
      return { organization: newOrg };
    });
  },

  addBoard: (board: Board) => {
    set((state) => {
      const newOrg = JSON.parse(JSON.stringify(state.organization)) as Organization;
      const group = newOrg.boardGroups.find((g) => g.id === board.groupId);
      if (group) {
        group.boards.push(board);
      }
      return { organization: newOrg };
    });
  },

  addAgent: (agent: Agent) => {
    set((state) => ({
      agents: [...state.agents, agent],
    }));
  },

  updateAgent: (agentId: string, updates: Partial<Agent>) => {
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === agentId ? { ...a, ...updates } : a
      ),
    }));
  },

  toggleAgentStatus: (agentId: string) => {
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === "active" ? "idle" : "active" }
          : a
      ),
    }));
  },

  updateOrganizationName: (name: string) => {
    set((state) => ({
      organization: { ...state.organization, name },
    }));
  },

  addMember: (member: Member) => {
    set((state) => ({
      members: [...state.members, member],
      organization: {
        ...state.organization,
        members: [...state.organization.members, member],
      },
    }));
  },

  removeMember: (memberId: string) => {
    set((state) => ({
      members: state.members.filter((m) => m.id !== memberId),
      organization: {
        ...state.organization,
        members: state.organization.members.filter((m) => m.id !== memberId),
      },
    }));
  },

  addEvent: (event: FeedEvent) => {
    set((state) => ({
      events: [event, ...state.events],
    }));
  },

  addMessage: (boardId: string, message: ChatMessage) => {
    set((state) => {
      const isFromAgent = message.senderType === "agent";
      const isActiveBoard = state.activeBoardId === boardId;
      
      return {
        messages: {
          ...state.messages,
          [boardId]: [...(state.messages[boardId] ?? []), message],
        },
        unreadCounts: {
          ...state.unreadCounts,
          [boardId]: isFromAgent && !isActiveBoard
            ? (state.unreadCounts[boardId] ?? 0) + 1
            : state.unreadCounts[boardId],
        },
      };
    });
  },

  getTaskById: (taskId: string) => {
    const { organization } = get();
    for (const group of organization.boardGroups) {
      for (const board of group.boards) {
        for (const col of board.columns) {
          const task = col.tasks.find((t) => t.id === taskId);
          if (task) return task;
        }
      }
    }
    return undefined;
  },

  getMemberById: (memberId: string) => {
    return get().members.find((m) => m.id === memberId);
  },

  getAgentById: (agentId: string) => {
    return get().agents.find((a) => a.id === agentId);
  },

  getBoardById: (boardId: string) => {
    const { organization } = get();
    for (const group of organization.boardGroups) {
      const board = group.boards.find((b) => b.id === boardId);
      if (board) return board;
    }
    return undefined;
  },
}));
