/**
 * main.jsx – Widget Entry Point
 *
 * This is the self-bootstrapping script that:
 * 1. Finds or creates a dedicated root DOM node (so it never conflicts with the host page).
 * 2. Renders the ChatWindow component into that root.
 * 3. Imports all Tailwind CSS (which Vite inlines into the JS bundle at build time).
 *
 * Embedding on any website is as simple as:
 *   <script src="https://your-cdn.com/autoticket-widget.js" defer></script>
 */
import React from "react";
import ReactDOM from "react-dom/client";
import "./widget.css"; // Tailwind CSS – will be inlined into the JS bundle
import ChatWindow from "./components/ChatWindow";

(function () {
  // --- 1. Find or create the mount point ---
  const ROOT_ID = "autoticket-widget-root";
  let mountNode = document.getElementById(ROOT_ID);

  if (!mountNode) {
    // The host page doesn't have our root div – create it dynamically
    mountNode = document.createElement("div");
    mountNode.id = ROOT_ID;
    // Ensure the container itself doesn't affect host layout
    mountNode.style.position = "fixed";
    mountNode.style.zIndex = "99999";
    mountNode.style.top = "0";
    mountNode.style.left = "0";
    mountNode.style.width = "0";
    mountNode.style.height = "0";
    mountNode.style.overflow = "visible";
    document.body.appendChild(mountNode);
  }

  // --- 2. Mount the React widget ---
  ReactDOM.createRoot(mountNode).render(
    // StrictMode is intentionally omitted for the widget to avoid double-mounting
    // side-effects on legacy host pages.
    <ChatWindow />
  );
})();
