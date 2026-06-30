import { useEffect, useRef, useState } from "react";
import { Bot, Send, PanelRight, PanelRightClose } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useShellStore } from "../../store/shellStore";

export default function ProjectManagerPanel() {
  const { pmMessages, pmTyping, sendPM, rightPanelCollapsed, toggleRightPanel } =
    useShellStore();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pmMessages.length, pmTyping]);

  function submit() {
    const value = text.trim();
    if (!value) return;
    void sendPM(value);
    setText("");
  }

  // Collapsed: shrink to a thin strip with a re-open control (mirrors the
  // left sidebar's collapse behaviour, using the panel-toggle icon).
  if (rightPanelCollapsed) {
    return (
      <div
        className="flex h-full w-12 shrink-0 flex-col items-center border-l py-3"
        style={{ borderColor: "#e7e6fa", background: "#ffffff" }}
      >
        <button
          onClick={toggleRightPanel}
          title="Open Project Manager Agent"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#0d08d2] hover:bg-[#e7e6fa]"
        >
          <PanelRight size={18} />
        </button>
        <div className="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#e7e6fa] text-[#0d08d2]">
          <Bot size={16} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-80 shrink-0 flex-col border-l bg-white"
      style={{ borderColor: "#e7e6fa" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "#e7e6fa" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e7e6fa] text-[#0d08d2]">
            <Bot size={16} />
          </div>
          <span className="font-head text-[14px] font-bold text-[#0d08d2]">
            Project Manager Agent
          </span>
        </div>
        <button
          onClick={toggleRightPanel}
          title="Collapse panel"
          className="flex h-7 w-7 items-center justify-center rounded-full text-graytext hover:bg-[#e7e6fa]"
        >
          <PanelRightClose size={18} />
        </button>
      </div>

      {/* History */}
      <div className="scroll-thin flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3">
        {pmMessages.length === 0 && !pmTyping && (
          <div className="mt-6 text-center text-[12px] text-graytext">
            Ask the Project Manager Agent about any risk across Viking Project.
          </div>
        )}
        {pmMessages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div
              key={i}
              className={`max-w-[85%] px-3 py-2 text-[13px] leading-relaxed ${
                isUser ? "self-end whitespace-pre-wrap" : "self-start"
              }`}
              style={
                isUser
                  ? {
                      background: "#0d08d2",
                      color: "#ffffff",
                      borderRadius: "14px 14px 4px 14px",
                    }
                  : {
                      background: "#e7e6fa",
                      color: "#1f2937",
                      borderRadius: "14px 14px 14px 4px",
                    }
              }
            >
              {isUser ? (
                m.content
              ) : (
                <div className="prose prose-sm prose-indigo max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
        {pmTyping && (
          <div
            className="self-start px-3 py-2.5"
            style={{ background: "#e7e6fa", borderRadius: "14px 14px 14px 4px" }}
          >
            <span className="typing-dot mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#0d08d2]" />
            <span
              className="typing-dot mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#0d08d2]"
              style={{ animationDelay: "0.2s" }}
            />
            <span
              className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-[#0d08d2]"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t p-2" style={{ borderColor: "#e7e6fa" }}>
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            rows={1}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Ask anything..."
            disabled={pmTyping}
            className="scroll-thin max-h-28 flex-1 resize-none rounded-input border px-3 py-2 text-[13px] outline-none focus:border-[#0d08d2]"
            style={{ borderColor: "#e7e6fa" }}
          />
          <button
            onClick={submit}
            disabled={pmTyping || !text.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn text-black disabled:opacity-40"
            style={{ background: "#ffcc00" }}
            title="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
