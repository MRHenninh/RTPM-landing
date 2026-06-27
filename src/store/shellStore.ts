import { create } from "zustand";
import { useRiskStore } from "./riskStore";
import {
  askRiskManager,
  buildProjectContext,
  type ChatMessage,
} from "../services/geminiService";

export type ShellMode = "landing" | "active" | "focus";

interface PMMessage {
  role: "user" | "assistant";
  content: string;
}

interface ShellState {
  mode: ShellMode;
  todosOpen: boolean;
  // Project Manager (global AI) chat — shared between the landing card and
  // the always-on right panel.
  pmMessages: PMMessage[];
  pmTyping: boolean;

  dismissLanding: () => void;
  setMode: (mode: ShellMode) => void;
  toggleFocus: () => void;
  openTodos: () => void;
  closeTodos: () => void;
  sendPM: (text: string) => Promise<void>;
}

export const useShellStore = create<ShellState>((set, get) => ({
  // App opens at the AI landing every time.
  mode: "landing",
  todosOpen: false,
  pmMessages: [],
  pmTyping: false,

  dismissLanding: () => set({ mode: "active" }),
  setMode: (mode) => set({ mode }),
  toggleFocus: () =>
    set({ mode: get().mode === "focus" ? "active" : "focus" }),
  openTodos: () => set({ todosOpen: true }),
  closeTodos: () => set({ todosOpen: false }),

  sendPM: async (text) => {
    const trimmed = text.trim();
    if (!trimmed || get().pmTyping) return;

    const userMsg: PMMessage = { role: "user", content: trimmed };
    set({ pmMessages: [...get().pmMessages, userMsg], pmTyping: true });

    try {
      // The Project Manager sees the whole programme, not a single risk.
      const risks = useRiskStore.getState().risks;
      const context = buildProjectContext(risks);
      const history: ChatMessage[] = get().pmMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const reply = await askRiskManager(history, context);
      set({
        pmMessages: [
          ...get().pmMessages,
          { role: "assistant", content: reply || "No response." },
        ],
      });
    } catch (err) {
      set({
        pmMessages: [
          ...get().pmMessages,
          {
            role: "assistant",
            content:
              err instanceof Error
                ? `Risk Manager AI is unavailable: ${err.message}`
                : "Risk Manager AI is unavailable right now.",
          },
        ],
      });
    } finally {
      set({ pmTyping: false });
    }
  },
}));
