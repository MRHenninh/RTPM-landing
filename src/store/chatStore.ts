import { create } from "zustand";
import type { ChatMode } from "../types";

interface ChatState {
  open: boolean;
  mode: ChatMode;
  /** Timestamp of the last agent call, for client-side rate limiting. */
  lastAgentCall: number;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setMode: (mode: ChatMode) => void;
  markAgentCall: () => void;
  canCallAgent: () => boolean;
}

const AGENT_RATE_LIMIT_MS = 3000;

export const useChatStore = create<ChatState>((set, get) => ({
  open: false,
  mode: "chat",
  lastAgentCall: 0,
  toggleOpen: () => set({ open: !get().open }),
  setOpen: (open) => set({ open }),
  setMode: (mode) => set({ mode }),
  markAgentCall: () => set({ lastAgentCall: Date.now() }),
  canCallAgent: () => Date.now() - get().lastAgentCall >= AGENT_RATE_LIMIT_MS,
}));
