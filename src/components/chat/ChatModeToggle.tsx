import { MessageSquare, Bot } from "lucide-react";
import type { ChatMode } from "../../types";

interface Props {
  mode: ChatMode;
  onToggle: () => void;
}

/**
 * Toggle between team chat and AI agent. The icon shape AND color change so
 * the active mode is visually distinct, not just labelled.
 */
export default function ChatModeToggle({ mode, onToggle }: Props) {
  const isAgent = mode === "agent";
  return (
    <button
      onClick={onToggle}
      title={isAgent ? "Switch to team chat" : "Switch to AI agent"}
      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
      style={{
        background: isAgent ? "rgba(245,158,11,0.15)" : "rgba(79,70,229,0.12)",
        color: isAgent ? "#F59E0B" : "#4F46E5",
      }}
    >
      {isAgent ? <Bot size={18} /> : <MessageSquare size={18} />}
    </button>
  );
}
