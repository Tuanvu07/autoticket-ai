import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Build as a single self-contained library file
    lib: {
      entry: "src/main.jsx",
      name: "AutoTicketWidget",
      // Output as a single JS file – this is the file that gets embedded via <script>
      fileName: () => "autoticket-widget.js",
      formats: ["iife"], // IIFE = Immediately Invoked Function Expression, safe for any website
    },
    rollupOptions: {
      // Bundle React INSIDE the widget so the host site needs zero dependencies
      external: [],
      output: {
        // Inject all CSS directly into JS via style tags – prevents conflicts with host CSS
        inlineDynamicImports: true,
      },
    },
    // Do NOT split CSS into a separate file – inject it via JS instead
    cssCodeSplit: false,
    // Output to dist/
    outDir: "dist",
    emptyOutDir: true,
  },
});
