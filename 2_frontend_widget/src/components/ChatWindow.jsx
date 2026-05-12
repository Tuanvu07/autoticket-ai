/**
 * ChatWindow.jsx
 * The main widget UI: a floating action button (FAB) that toggles
 * a polished chat window. Fully self-contained with TailwindCSS.
 */
import { useState, useEffect, useRef } from "react";
import { useAgentChat } from "../hooks/useAgentChat";

// --- Sub-component: Individual message bubble ---
function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 animate-fade-in ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
          AI
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

// --- Sub-component: Animated typing indicator ---
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
        AI
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// --- Main component ---
export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, sendMessage } = useAgentChat();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    // Send on Enter, allow Shift+Enter for newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // Fixed container anchored to bottom-right – z-index ensures it floats above host content
    <div className="fixed bottom-5 right-5 z-[99999] flex flex-col items-end gap-3 font-sans">
      
      {/* ===== CHAT WINDOW ===== */}
      {isOpen && (
        <div
          className="
            w-[370px] max-w-[calc(100vw-40px)]
            h-[560px] max-h-[calc(100vh-100px)]
            bg-gray-50 rounded-2xl shadow-2xl
            flex flex-col overflow-hidden
            border border-gray-200
            animate-slide-up
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Logo / Avatar */}
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🚌
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">
                  Trường Thịnh AI
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-blue-100 text-xs">Trực tuyến 24/7</span>
                </div>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Đóng cửa sổ chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {/* Typing indicator shown while waiting for API response */}
            {isLoading && <TypingIndicator />}
            {/* Invisible anchor div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips (shown only at start) */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap flex-shrink-0">
              {["Vé đi Đà Lạt", "Xem lịch chuyến", "Giá vé hôm nay"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="px-3 pb-3 pt-2 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none max-h-24 disabled:opacity-50"
                style={{ lineHeight: "1.5" }}
              />
              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="
                  flex-shrink-0 w-8 h-8 rounded-lg
                  bg-gradient-to-br from-blue-500 to-indigo-600
                  text-white flex items-center justify-center
                  hover:opacity-90 active:scale-95
                  transition-all duration-150
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                "
                aria-label="Gửi tin nhắn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-1.5">
              Powered by <span className="font-semibold text-blue-500">AutoTicket AI</span>
            </p>
          </div>
        </div>
      )}

      {/* ===== FLOATING ACTION BUTTON (FAB) ===== */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          w-14 h-14 rounded-full shadow-lg
          bg-gradient-to-br from-blue-500 to-indigo-600
          text-white text-2xl
          flex items-center justify-center
          hover:scale-110 active:scale-95
          transition-transform duration-200
          relative
        "
        aria-label={isOpen ? "Đóng chat" : "Mở chat với AI"}
      >
        {/* Toggle icon: chat bubble ↔ X */}
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        )}

        {/* Notification dot – shown when chat is closed and there are messages */}
        {!isOpen && messages.length > 1 && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
