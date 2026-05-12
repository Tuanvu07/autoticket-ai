import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:        "#1565C0",
          "blue-dark": "#0D47A1",
          "blue-light":"#1E88E5",
          red:         "#C62828",
          "red-dark":  "#B71C1C",
          gold:        "#F9A825",
          "gold-dark": "#F57F17",
          bg:          "#F5F7FA",
          surface:     "#FFFFFF",
          border:      "#E0E6EF",
          text:        "#1A1A2E",
          muted:       "#64748B",
          subtle:      "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card:         "0 2px 12px 0 rgba(21,101,192,0.08)",
        "card-hover": "0 10px 40px 0 rgba(21,101,192,0.18)",
        header:       "0 2px 16px 0 rgba(0,0,0,0.09)",
        cta:          "0 4px 20px 0 rgba(198,40,40,0.35)",
        gold:         "0 4px 20px 0 rgba(249,168,37,0.35)",
        glass:        "0 8px 32px 0 rgba(21,101,192,0.12)",
        qr:           "0 0 0 12px rgba(21,101,192,0.06), 0 8px 32px rgba(21,101,192,0.15)",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulse2: {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.06)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        qrPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(21,101,192,0.25)" },
          "50%":      { boxShadow: "0 0 0 12px rgba(21,101,192,0)" },
        },
      },
      animation: {
        "fade-up":      "fadeUp 0.55s ease-out forwards",
        "fade-in-up":   "fadeInUp 0.4s ease-out forwards",
        "slide-in":     "slideIn 0.4s ease-out forwards",
        "slide-right":  "slideRight 0.4s ease-out forwards",
        "scale-in":     "scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        pulse2:         "pulse2 2s ease-in-out infinite",
        shimmer:        "shimmer 2s infinite linear",
        "qr-pulse":     "qrPulse 2s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
