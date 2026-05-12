/**
 * useAgentChat.js
 * Custom hook to manage all chat state and API communication.
 * Decouples business logic from UI components.
 */
import { useState, useCallback } from "react";

// --- Configuration ---
const API_BASE_URL = "http://localhost:8000/api/v1";
// Hardcoded for MVP; will be passed via <script data-tenant-id="..."> in production
const TENANT_ID = "truong_thinh";

/**
 * A single message object shape:
 * { id: string, role: "user" | "bot", content: string, timestamp: Date }
 */
const createMessage = (role, content) => ({
  id: `${role}-${Date.now()}-${Math.random()}`,
  role,
  content,
  timestamp: new Date(),
});

export function useAgentChat() {
  const [messages, setMessages] = useState([
    // Greeting message shown when the widget first opens
    createMessage(
      "bot",
      "Xin chào! Tôi là Trợ lý AI của Xe Trường Thịnh 🚌\nBạn muốn đặt vé đi đâu hôm nay?"
    ),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * sendMessage — appends user message, calls API, appends bot reply.
   * @param {string} userInput - Raw text from the input field.
   */
  const sendMessage = useCallback(
    async (userInput) => {
      const trimmed = userInput.trim();
      if (!trimmed || isLoading) return;

      // 1. Immediately display the user's message in the UI
      const userMsg = createMessage("user", trimmed);
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        // 2. POST to the FastAPI backend
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenant_id: TENANT_ID, message: trimmed }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // 3. Append the bot's reply (backend returns { reply: "..." })
        const botMsg = createMessage("bot", data.reply ?? "Xin lỗi, tôi chưa hiểu. Bạn thử lại nhé!");
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error("[AutoTicket Widget] API Error:", err);
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        const errorMsg = createMessage(
          "bot",
          "⚠️ Lỗi kết nối. Vui lòng kiểm tra lại đường truyền và thử lại."
        );
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  return { messages, isLoading, error, sendMessage };
}
